import Link from "next/link";
import AppShell from "@/components/AppShell";
import Analyzer from "@/components/Analyzer";

export default function HomePage() {
  return <AppShell>
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
      <div>
        <div className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">AI NEWS UNDERSTANDING ASSISTANT</div>
        <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">어려운 뉴스를<br /><span className="text-slate-500">쉽게 이해해보세요.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">뉴스 링크를 붙여넣거나 기사를 사진으로 올리면 핵심 내용, 어려운 용어, 배경, 사실과 해석의 차이를 한눈에 정리해드립니다.</p>
        <div className="mt-7 flex gap-3 text-sm font-bold text-slate-500"><span>✓ 핵심 요약</span><span>✓ 용어 설명</span><span>✓ 사실·해석 구분</span></div>
        <Link href="/history" className="mt-7 inline-block text-sm font-bold text-slate-500 hover:text-slate-900">내 분석 기록 보기 →</Link>
      </div>
      <Analyzer />
    </div>
    <div className="mt-14 grid gap-4 md:grid-cols-3"><Feature icon="📰" title="한눈에 파악" text="복잡한 기사의 핵심을 짧고 이해하기 쉽게 정리합니다." /><Feature icon="📚" title="용어와 배경" text="뉴스를 이해하는 데 필요한 개념과 맥락을 설명합니다." /><Feature icon="⚖️" title="구분해서 보기" text="확인된 사실과 해석, 전망을 구분해 보여줍니다." /></div>
  </AppShell>;
}
function Feature({ icon, title, text }: { icon: string; title: string; text: string }) { return <div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="text-2xl">{icon}</div><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>; }
