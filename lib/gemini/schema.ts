export const newsAnalysisSchema = {
  type: "object",
  properties: {
    article: {
      type: "object",
      properties: {
        title: { type: "string" },
        source: { type: "string" },
        publishedAt: { type: "string" },
        url: { type: "string" },
      },
      required: ["title", "source", "publishedAt", "url"],
    },
    summary: { type: "string" },
    easyExplanation: { type: "string" },
    keyPoints: { type: "array", items: { type: "string" } },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: { term: { type: "string" }, explanation: { type: "string" } },
        required: ["term", "explanation"],
      },
    },
    background: { type: "array", items: { type: "string" } },
    classifications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          type: { type: "string", enum: ["FACT", "INTERPRETATION", "EXPECTATION"] },
          explanation: { type: "string" },
        },
        required: ["text", "type", "explanation"],
      },
    },
    possibleImpacts: { type: "array", items: { type: "string" } },
    additionalSources: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, source: { type: "string" }, url: { type: "string" } },
        required: ["title", "source", "url"],
      },
    },
    limitations: { type: "array", items: { type: "string" } },
  },
  required: [
    "article",
    "summary",
    "easyExplanation",
    "keyPoints",
    "terms",
    "background",
    "classifications",
    "possibleImpacts",
    "additionalSources",
    "limitations",
  ],
};
