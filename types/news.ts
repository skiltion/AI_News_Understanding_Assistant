export type ClassificationType = "FACT" | "INTERPRETATION" | "EXPECTATION";

export interface NewsTerm {
  term: string;
  explanation: string;
}

export interface NewsClassification {
  text: string;
  type: ClassificationType;
  explanation: string;
}

export interface NewsSource {
  title: string;
  source: string;
  url: string;
}

export interface NewsAnalysis {
  article: {
    title: string;
    source: string;
    publishedAt: string;
    url: string;
  };
  summary: string;
  easyExplanation: string;
  keyPoints: string[];
  terms: NewsTerm[];
  background: string[];
  classifications: NewsClassification[];
  possibleImpacts: string[];
  additionalSources: NewsSource[];
  limitations: string[];
}

export interface NewsAnalysisRow {
  id: string;
  input_type: "url" | "image";
  source_url: string | null;
  source_name: string | null;
  title: string;
  published_at: string | null;
  analysis_json: NewsAnalysis;
  created_at: string;
  updated_at: string;
}
