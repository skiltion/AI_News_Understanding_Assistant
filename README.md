# 뉴스렌즈 — AI 뉴스 이해 도우미

뉴스 URL 또는 뉴스 이미지를 입력하면 Gemini가 기사의 핵심 내용, 쉬운 설명, 어려운 용어, 배경, 사실·해석·전망 구분, 가능한 영향을 구조화해 보여주는 웹 서비스입니다.

## 핵심 기술

- Next.js / React / TypeScript
- Tailwind CSS
- Google Gemini API
- Supabase PostgreSQL
- Vercel
- GitHub

## 중요: 이 프로젝트는 Vercel + Supabase를 필수로 사용합니다.

분석 기록은 브라우저 `localStorage`가 아니라 Supabase PostgreSQL에 저장됩니다. 테스트용 서비스이므로 회원가입, 로그인, Supabase Anonymous Auth 없이 모든 분석 기록을 하나의 공개 기록 공간에 계속 저장합니다.

> 주의: 이 구조에서는 같은 Supabase 프로젝트를 사용하는 모든 사용자가 분석 기록을 조회할 수 있습니다. 실제 서비스로 공개할 때는 반드시 Supabase Auth와 사용자별 RLS로 변경해야 합니다.

## 1. Supabase 설정

1. Supabase에서 새 프로젝트를 생성합니다.
2. `supabase/schema.sql` 전체를 SQL Editor에서 실행합니다.
3. Authentication / Anonymous Sign-Ins는 활성화할 필요가 없습니다.
4. Project Settings > API에서 Project URL과 Publishable Key를 확인합니다.

`schema.sql`은 기존 Anonymous Auth 버전의 `user_id` 컬럼과 정책도 정리하도록 작성되어 있습니다. 기존 테이블을 이미 사용 중이라면 이 SQL을 다시 실행해도 기존 분석 결과는 유지하고 `user_id`만 제거합니다.

## 2. Gemini 설정

Google AI Studio에서 Gemini API Key를 발급합니다.

## 3. 환경변수

Vercel 프로젝트의 Settings > Environment Variables에 다음 값을 등록합니다.

```text
GEMINI_API_KEY=실제 Gemini API 키
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_SUPABASE_URL=Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=Supabase Publishable Key
```

`.env.example`에는 변수 이름만 포함되어 있습니다.

## 4. GitHub → Vercel

1. 이 프로젝트를 GitHub 저장소에 push합니다.
2. Vercel에서 New Project를 선택합니다.
3. GitHub 저장소를 연결합니다.
4. Framework Preset은 Next.js를 사용합니다.
5. Environment Variables에 위 값을 입력합니다.
6. Deploy를 실행합니다.

이후 GitHub의 새 커밋마다 Vercel이 자동으로 배포할 수 있습니다.

## 5. 기능

- 뉴스 URL 분석
- 뉴스 이미지 분석
- 한눈에 보는 요약
- 쉬운 설명
- 핵심 내용
- 어려운 용어
- 배경과 맥락
- 사실 / 해석 / 전망 구분
- 가능한 영향
- 원문 출처 표시 및 URL 이동
- Supabase 분석 기록 영구 저장
- Supabase 기반 분석 기록 조회/삭제

## 6. 뉴스 URL 분석의 한계

일부 뉴스 사이트는 로그인, 유료벽, robots/access restrictions, JavaScript 렌더링 등으로 서버에서 본문을 가져오지 못할 수 있습니다. 이 경우 이미지 입력을 사용할 수 있습니다.

서비스는 기사의 진위를 최종 판정하지 않습니다. 원문과 출처를 직접 확인할 수 있도록 설계되어 있습니다.
