"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NewsAnalysisRow } from "@/types/news";

export default function HistoryPage() {
  const [rows, setRows] = useState<NewsAnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const result = await supabase.from("news_analyses").select("*").order("created_at", { ascending: false }).limit(100);
      if (result.error) setError(`기록을 불러오지 못했습니다: ${result.error.message}`);
      else setRows((result.data as NewsAnalysisRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  async function remove(id: string) {
    const supabase = getSupabaseBrowserClient();
    const result = await supabase.from("news_analyses").delete().eq("id", id);
    if (result.error) {
      setError(`삭제하지 못했습니다: ${result.error.message}`);
      return;
    }
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return <AppShell>
    <div className="mb-8">
      <p className="text-sm font-bold text-slate-400">SUPABASE HISTORY</p>
      <h1 className="mt-2 text-4xl font-black">분석 기록</h1>
      <p className="mt-3 text-slate-500">분석한 결과가 Supabase에 계속 저장됩니다. 브라우저를 바꾸어도 같은 프로젝트의 기록을 확인할 수 있습니다.</p>
    </div>
    {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    {loading ? <div className="py-20 text-center text-slate-500">기록을 불러오는 중입니다…</div> : rows.length === 0 ? <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center"><div className="text-4xl">🗂️</div><h2 className="mt-4 font-black">아직 분석 기록이 없습니다.</h2><Link href="/" className="mt-5 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold !text-white">첫 뉴스 분석하기</Link></div> : <div className="space-y-3">{rows.map((row) => <div key={row.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"><Link href={`/result/${row.id}`} className="min-w-0 flex-1"><div className="flex gap-2 text-xs font-bold text-slate-400"><span>{row.input_type === "url" ? "URL" : "IMAGE"}</span><span>·</span><span>{new Date(row.created_at).toLocaleString("ko-KR")}</span></div><div className="mt-2 truncate font-black">{row.title}</div><div className="mt-1 truncate text-sm text-slate-500">{row.source_name || "출처 미상"}</div></Link><button onClick={() => remove(row.id)} className="rounded-xl px-3 py-2 text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-600">삭제</button></div>)}</div>}
  </AppShell>;
}
