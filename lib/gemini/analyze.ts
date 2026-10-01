import { GoogleGenAI } from "@google/genai";
import { newsAnalysisSchema } from "@/lib/gemini/schema";
import type { NewsAnalysis } from "@/types/news";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  return new GoogleGenAI({ apiKey: key });
}

const rules = `
당신은 'AI 뉴스 이해 도우미'의 분석 AI입니다.
반드시 자연스러운 한국어로 작성하세요.
사용자의 판단을 대신하지 말고, 제공된 기사/이미지 내용을 이해하기 쉽게 설명하세요.
기사에 없는 사실, 숫자, 인용문, 출처, URL을 만들지 마세요.
확인된 사실과 해석/분석, 미래 전망을 구분하세요.
불확실한 내용은 억지로 단정하지 말고 불확실성을 명시하세요.
추가 출처는 실제 입력 자료에서 확인된 경우에만 넣으세요. 확인하지 못한 출처나 URL은 만들지 마세요.
현재 시점의 사실을 모델 기억만으로 보충하지 마세요.
정보가 부족하면 limitations에 무엇이 부족한지 적으세요.
`;

export async function analyzeArticle(article: {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  content: string;
}): Promise<NewsAnalysis> {
  const ai = getAI();
  const prompt = `${rules}

다음 뉴스 기사를 분석하세요.

[기사 메타데이터]
제목: ${article.title}
언론사/출처: ${article.source}
게시일: ${article.publishedAt || "확인되지 않음"}
원문 URL: ${article.url}

[기사 본문]
${article.content}

요구사항:
- summary는 1분 안에 읽을 수 있게 핵심만 설명하세요.
- easyExplanation은 처음 접하는 사람도 이해할 수 있게 설명하세요.
- keyPoints는 3~6개 정도로 작성하세요.
- terms는 기사 이해에 실제로 필요한 어려운 용어만 넣으세요.
- background는 기사 본문에서 확인 가능한 배경을 중심으로 정리하고, 기사 밖의 내용을 임의로 추가하지 마세요.
- classifications는 중요한 주장들을 FACT/INTERPRETATION/EXPECTATION으로 구분하세요.
- possibleImpacts는 기사 내용으로 합리적으로 설명할 수 있는 영향만 조심스럽게 작성하세요.
- additionalSources는 이 요청에서 실제로 제공되거나 확인된 출처가 없으므로 원칙적으로 빈 배열로 두세요.
- limitations에는 URL 본문 추출 방식의 한계나 기사만으로 판단하기 어려운 부분을 필요할 때 적으세요.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: newsAnalysisSchema,
      temperature: 0.2,
    },
  });

  if (!response.text) throw new Error("AI 분석 결과가 비어 있습니다.");
  const parsed = JSON.parse(response.text) as NewsAnalysis;
  parsed.article.url = article.url;
  if (!parsed.article.title) parsed.article.title = article.title;
  if (!parsed.article.source) parsed.article.source = article.source;
  return parsed;
}

export async function analyzeImage(input: { base64: string; mimeType: string }) {
  const ai = getAI();
  const prompt = `${rules}

첨부된 뉴스 이미지를 분석하세요.
이미지에서 실제로 읽을 수 있는 정보만 사용하세요.
헤드라인, 본문 일부, 언론사, 날짜, 인물/기관/지역/숫자 등을 읽을 수 있다면 반영하세요.
흐릿하거나 잘린 부분은 추측하지 마세요.
이미지에 원문 URL이 보이지 않으면 article.url은 빈 문자열로 두세요.
additionalSources는 실제로 확인된 자료가 없으므로 빈 배열로 두세요.
기사 이미지가 충분히 읽히지 않는 경우 limitations에 명확히 적으세요.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { text: prompt },
      { inlineData: { mimeType: input.mimeType, data: input.base64 } },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: newsAnalysisSchema,
      temperature: 0.2,
    },
  });

  if (!response.text) throw new Error("AI 이미지 분석 결과가 비어 있습니다.");
  return JSON.parse(response.text) as NewsAnalysis;
}
