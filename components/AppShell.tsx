"use client";

import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">N</span>
            뉴스렌즈
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Link href="/" className="rounded-lg px-3 py-2 hover:bg-slate-100">분석하기</Link>
            <Link href="/history" className="rounded-lg px-3 py-2 hover:bg-slate-100">분석 기록</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 pb-10 text-xs text-slate-400">AI가 판단을 대신하는 서비스가 아니라, 뉴스를 이해하는 데 도움을 주는 서비스입니다.</footer>
    </div>
  );
}
