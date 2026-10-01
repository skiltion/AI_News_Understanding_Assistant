import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeArticle } from "@/lib/gemini/analyze";
import { extractArticle } from "@/lib/news/extractor";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ url: z.string().min(1).max(2048) });

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const article = await extractArticle(body.url);
    const analysis = await analyzeArticle(article);
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("news_analyses")
      .insert({
        input_type: "url",
        source_url: article.url,
        source_name: article.source,
        title: analysis.article.title || article.title,
        published_at: analysis.article.publishedAt || article.publishedAt || null,
        analysis_json: analysis,
      })
      .select("id")
      .single();

    if (error) throw new Error(`분석 결과 저장에 실패했습니다: ${error.message}`);
    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "뉴스 URL 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
