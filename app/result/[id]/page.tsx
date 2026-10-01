"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import AnalysisView from "@/components/AnalysisView";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NewsAnalysisRow } from "@/types/news";

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const [row, setRow] = useState<NewsAnalysisRow | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(async ({ id }) => {
      const supabase = getSupabaseBrowserClient();
      const result = await supabase.from("news_analyses").select("*").eq("id", id).single();
      if (result.error) setError("분석 결과를 찾지 못했습니다.");
      else setRow(result.data as NewsAnalysisRow);
    }).catch(() => setError("분석 결과를 불러오지 못했습니다."));
  }, [params]);

  return <AppShell><div className="mb-6"><Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900">← 다시 분석하기</Link></div>{error ? <div className="rounded-3xl bg-white p-10 text-center text-slate-600">{error}</div> : row ? <AnalysisView analysis={row.analysis_json} /> : <div className="py-24 text-center text-slate-500">분석 결과를 불러오는 중입니다…</div>}</AppShell>;
}
