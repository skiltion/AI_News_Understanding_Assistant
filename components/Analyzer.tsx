"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Analyzer() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"url" | "image">("url");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setLoading(true);
    try {
      let response: Response;
      if (mode === "url") {
        if (!url.trim()) throw new Error("뉴스 URL을 입력해주세요.");
        response = await fetch("/api/analyze/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } else {
        if (!file) throw new Error("뉴스 이미지를 선택해주세요.");
        const form = new FormData();
        form.append("image", file);
        response = await fetch("/api/analyze/image", {
          method: "POST",
          body: form,
        });
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "분석에 실패했습니다.");
      router.push(`/result/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
        <button onClick={() => setMode("url")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${mode === "url" ? "bg-white shadow-sm" : "text-slate-500"}`}>🔗 뉴스 링크</button>
        <button onClick={() => setMode("image")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${mode === "image" ? "bg-white shadow-sm" : "text-slate-500"}`}>📷 뉴스 이미지</button>
      </div>

      {mode === "url" ? (
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">뉴스 기사 URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="https://example.com/news/article" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-slate-900 focus:bg-white" />
          <p className="mt-2 text-xs text-slate-400">공개적으로 접근할 수 있는 기사 URL을 입력해주세요.</p>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()} className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center hover:border-slate-400">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <div className="text-4xl">📷</div>
          <p className="mt-3 font-bold">{file ? file.name : "뉴스 이미지를 선택하세요"}</p>
          <p className="mt-1 text-xs text-slate-400">JPG · PNG · WEBP / 최대 8MB</p>
        </div>
      )}

      {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      <button disabled={loading} onClick={submit} className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "뉴스를 분석하고 있습니다…" : "✨ 뉴스 분석하기"}</button>
    </section>
  );
}
