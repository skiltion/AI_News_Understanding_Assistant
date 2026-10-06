# AI News Understanding Assistant

## 프로젝트 이름

**AI News Understanding Assistant**

## 프로젝트 소개

AI News Understanding Assistant는 사용자가 뉴스 기사 URL이나 뉴스 이미지를 입력하면 AI를 활용하여 뉴스 내용을 분석하고 이해하기 쉽게 정리해주는 웹 서비스입니다.

복잡하거나 어려운 뉴스 내용을 **한눈에 이해할 수 있도록 요약하고**, 어려운 용어와 배경지식, 사실과 해석의 구분, 예상되는 영향 등을 정리하여 사용자가 뉴스의 핵심 내용을 쉽게 파악할 수 있도록 제작했습니다.

## 주요 기능

- **뉴스 URL 분석**
  - 뉴스 기사 URL을 입력하여 기사 내용을 가져오고 분석
  - 기사 제목, 언론사, 작성일 등의 정보 추출
  - 원문 기사로 이동할 수 있는 링크 제공

- **뉴스 이미지 분석**
  - 뉴스 기사 캡처 이미지 또는 사진 업로드
  - 이미지에서 기사 제목, 본문, 언론사, 날짜 등의 정보 분석
  - 이미지에서 확인하기 어려운 내용은 임의로 생성하지 않고 확인이 어렵다고 표시

- **AI 뉴스 분석**
  - 뉴스 한 줄 요약 및 1분 요약
  - 어려운 내용을 쉽게 설명
  - 어려운 용어 정리
  - 뉴스의 배경 및 맥락 설명
  - 사실, 해석, 전망 구분
  - 뉴스가 미칠 수 있는 영향 분석
  - 관련 정보 및 참고 자료 제공

- **분석 결과 저장**
  - 분석 결과를 Supabase 데이터베이스에 저장
  - 이전에 분석한 뉴스 목록 확인
  - 저장된 분석 결과를 다시 확인

## Google API

### Google Gemini API

Google Gemini API를 사용하여 뉴스 기사와 뉴스 이미지의 내용을 분석합니다.

뉴스 URL을 통해 가져온 기사 내용이나 사용자가 업로드한 뉴스 이미지를 Gemini에 전달하고 다음과 같은 작업을 수행합니다.

- 뉴스 내용 요약
- 뉴스 내용 이해 및 설명
- 주요 용어 분석
- 배경 및 맥락 분석
- 사실과 해석 구분
- 예상되는 영향 정리
- 뉴스 관련 정보 추출
- 이미지 속 뉴스 텍스트 및 정보 분석

Gemini API를 서버 측에서 호출하여 API Key가 클라이언트에 노출되지 않도록 구성했습니다.

## 데이터베이스

### Supabase PostgreSQL

Supabase의 PostgreSQL 데이터베이스를 사용하여 사용자가 분석한 뉴스 결과를 저장합니다.

주요 저장 데이터는 다음과 같습니다.

- 분석 결과 ID
- 입력 방식(URL/이미지)
- 뉴스 원문 URL
- 뉴스 출처
- 뉴스 제목
- 뉴스 작성일
- AI 분석 결과
- 분석 생성일

분석 결과를 데이터베이스에 저장하기 때문에 웹페이지를 새로고침하거나 다시 접속하더라도 기존 분석 결과를 확인할 수 있습니다.

## 사용 기술

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Google Gemini API
- Zod

### Database

- Supabase
- PostgreSQL

### 배포

- Vercel
- GitHub

### 기타

- Cheerio
- Responsive Web Design
- REST API

## 실행 주소

**배포된 웹서비스 주소:**  
`https://ai-news-understanding-assistant.vercel.app`
