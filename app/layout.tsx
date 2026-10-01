import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "뉴스렌즈 | AI 뉴스 이해 도우미",
  description: "어려운 뉴스를 쉽게 이해하고 핵심 정보와 맥락을 확인하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
