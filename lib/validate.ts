import { z } from "zod";

export const urlSchema = z.string().trim().url().refine((value) => {
  const parsed = new URL(value);
  return parsed.protocol === "http:" || parsed.protocol === "https:";
}, "HTTP 또는 HTTPS URL만 사용할 수 있습니다.");

export function validatePublicNewsUrl(value: string) {
  const url = urlSchema.parse(value);
  const parsed = new URL(url);
  const hostname = parsed.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("내부 네트워크 주소는 분석할 수 없습니다.");
  }

  if (/^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname)) {
    throw new Error("내부 네트워크 주소는 분석할 수 없습니다.");
  }

  return url;
}
