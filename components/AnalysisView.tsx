import type { NewsAnalysis } from "@/types/news";

const labels = { FACT: "확인된 사실", INTERPRETATION: "해석·분석", EXPECTATION: "전망·가능성" } as const;
const badge = { FACT: "bg-emerald-50 text-emerald-700", INTERPRETATION: "bg-amber-50 text-amber-700", EXPECTATION: "bg-blue-50 text-blue-700" } as const;

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AnalysisView({ analysis }: { analysis: NewsAnalysis }) {
  const originalUrl = analysis.article.url?.trim() || "";
  const hasOriginalUrl = isValidHttpUrl(originalUrl);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
        <div className="text-sm text-slate-300">{analysis.article.source || "출처 미상"}</div>
        <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{analysis.article.title}</h1>
        {analysis.article.publishedAt && <p className="mt-3 text-sm text-slate-400">게시일: {analysis.article.publishedAt}</p>}
        {hasOriginalUrl && (
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-xl bg-white px-4 py-3 text-sm font-black !text-slate-900 transition hover:bg-slate-100"
          >
            원문 기사 보러 가기 ↗
          </a>
        )}
      </section>

      <Section icon="📰" title="한눈에 보기"><p className="whitespace-pre-line leading-8 text-slate-700">{analysis.summary}</p></Section>
      <Section icon="💡" title="쉽게 설명하면"><p className="whitespace-pre-line leading-8 text-slate-700">{analysis.easyExplanation}</p></Section>

      <Section icon="📌" title="핵심 내용"><ul className="space-y-3">{analysis.keyPoints.map((item, i) => <li key={i} className="flex gap-3 rounded-2xl bg-slate-50 p-4"><span className="font-black text-slate-400">0{i + 1}</span><span className="leading-7">{item}</span></li>)}</ul></Section>

      <Section icon="📚" title="어려운 용어"><div className="grid gap-3 sm:grid-cols-2">{analysis.terms.map((item) => <div key={item.term} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">{item.term}</div><p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p></div>)}</div></Section>

      <Section icon="🧭" title="배경과 맥락"><div className="space-y-3">{analysis.background.map((item, i) => <div key={i} className="flex gap-3"><span className="mt-1 h-6 w-6 shrink-0 rounded-full bg-slate-900 text-center text-xs font-bold leading-6 text-white">{i + 1}</span><p className="leading-7 text-slate-700">{item}</p></div>)}</div></Section>

      <Section icon="⚖️" title="사실 · 해석 · 전망"><div className="space-y-3">{analysis.classifications.map((item, i) => <div key={i} className="rounded-2xl border border-slate-200 p-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${badge[item.type]}`}>{labels[item.type]}</span><p className="mt-3 font-semibold leading-7">{item.text}</p><p className="mt-2 text-sm leading-6 text-slate-500">{item.explanation}</p></div>)}</div></Section>

      <Section icon="🌱" title="가능한 영향"><ul className="space-y-2">{analysis.possibleImpacts.map((item, i) => <li key={i} className="rounded-2xl bg-slate-50 p-4 leading-7">{item}</li>)}</ul></Section>

      <Section icon="🔗" title="출처">
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-xs font-bold text-slate-400">원문</div>
            <div className="mt-1 font-bold">{analysis.article.source || "원문 출처"}</div>
            {hasOriginalUrl ? (
              <div className="mt-3">
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold !text-white transition hover:bg-slate-700"
                >
                  원문 기사 보러 가기 ↗
                </a>
                <p className="mt-3 break-all text-sm text-slate-500">{originalUrl}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">이미지에서 원문 URL을 확인하지 못했습니다.</p>
            )}
          </div>
          {analysis.additionalSources.map((source) => (
            <div key={source.url} className="rounded-2xl border border-slate-200 p-4">
              <div className="font-bold">{source.title}</div>
              <div className="text-sm text-slate-500">{source.source}</div>
              {isValidHttpUrl(source.url) && (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm text-blue-600 hover:underline">{source.url}</a>
              )}
            </div>
          ))}
        </div>
      </Section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6"><h2 className="font-black">⚠️ 분석의 한계</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">{(analysis.limitations.length ? analysis.limitations : ["AI 분석은 원문과 제공된 정보에 기반한 이해 보조 자료입니다."]).map((item, i) => <li key={i}>• {item}</li>)}</ul></section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><h2 className="mb-5 flex items-center gap-2 text-xl font-black"><span>{icon}</span>{title}</h2>{children}</section>;
}
