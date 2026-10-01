import { NextResponse } from "next/server";
import { analyzeImage } from "@/lib/gemini/analyze";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) throw new Error("뉴스 이미지 파일이 필요합니다.");
    if (!ALLOWED_TYPES.has(file.type)) throw new Error("JPG, PNG, WEBP 이미지만 사용할 수 있습니다.");
    if (file.size > MAX_FILE_SIZE) throw new Error("이미지는 최대 8MB까지 업로드할 수 있습니다.");

    const buffer = Buffer.from(await file.arrayBuffer());
    const analysis = await analyzeImage({ base64: buffer.toString("base64"), mimeType: file.type });
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("news_analyses")
      .insert({
        input_type: "image",
        source_url: analysis.article.url || null,
        source_name: analysis.article.source || null,
        title: analysis.article.title || "이미지 뉴스 분석",
        published_at: analysis.article.publishedAt || null,
        analysis_json: analysis,
      })
      .select("id")
      .single();

    if (error) throw new Error(`분석 결과 저장에 실패했습니다: ${error.message}`);
    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "뉴스 이미지 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
