import * as cheerio from "cheerio";
import { validatePublicNewsUrl } from "@/lib/validate";

export interface ExtractedArticle {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  content: string;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

export async function extractArticle(inputUrl: string): Promise<ExtractedArticle> {
  const url = validatePublicNewsUrl(inputUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-News-Understanding-Assistant/2.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) throw new Error(`뉴스 페이지를 가져오지 못했습니다. (${response.status})`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("HTML 뉴스 페이지가 아닌 주소입니다.");
    }

    const html = await response.text();
    if (html.length > 5_000_000) throw new Error("페이지가 너무 큽니다.");

    const $ = cheerio.load(html);
    $("script, style, noscript, svg, nav, footer, header, form, iframe, aside").remove();

    const title = cleanText(
      $("meta[property='og:title']").attr("content") || $("h1").first().text() || $("title").text(),
    );
    const source = cleanText(
      $("meta[property='og:site_name']").attr("content") || new URL(url).hostname,
    );
    const publishedAt = cleanText(
      $("meta[property='article:published_time']").attr("content") ||
        $("time[datetime]").first().attr("datetime") ||
        $("time").first().text(),
    );

    const candidates = [
      "article",
      "main",
      "[role='main']",
      ".article-body",
      ".article_view",
      ".article-content",
      ".news-content",
      ".story-body",
    ];

    let content = "";
    for (const selector of candidates) {
      const text = cleanText($(selector).first().text());
      if (text.length > content.length) content = text;
    }

    if (content.length < 300) content = cleanText($("body").text());
    if (content.length < 200) throw new Error("기사 본문을 충분히 읽지 못했습니다.");

    return {
      title: title || "제목을 확인할 수 없는 기사",
      source,
      publishedAt,
      url,
      content: content.slice(0, 80_000),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("뉴스 페이지 응답 시간이 초과되었습니다.");
    }
    throw error instanceof Error ? error : new Error("뉴스 페이지를 읽는 중 오류가 발생했습니다.");
  } finally {
    clearTimeout(timeout);
  }
}
