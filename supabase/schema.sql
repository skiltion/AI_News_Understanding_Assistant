-- 뉴스 분석 서비스용 Supabase 스키마
-- 테스트용: 별도의 Supabase Auth 없이 모든 분석 기록을 Supabase에 영구 저장합니다.
-- Supabase Dashboard > SQL Editor에서 전체 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.news_analyses (
  id uuid primary key default gen_random_uuid(),
  input_type text not null check (input_type in ('url', 'image')),
  source_url text,
  source_name text,
  title text not null,
  published_at text,
  analysis_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 기존 Anonymous Auth 버전의 정책을 먼저 제거합니다.
drop policy if exists "Users can view their own analyses" on public.news_analyses;
drop policy if exists "Users can create their own analyses" on public.news_analyses;
drop policy if exists "Users can delete their own analyses" on public.news_analyses;
drop policy if exists "Anonymous users only access their own analyses" on public.news_analyses;
drop policy if exists "Public can view analyses" on public.news_analyses;
drop policy if exists "Public can create analyses" on public.news_analyses;
drop policy if exists "Public can delete analyses" on public.news_analyses;

-- 기존 Anonymous Auth 버전으로 만든 테이블을 재사용하는 경우 user_id를 제거합니다.
alter table public.news_analyses drop column if exists user_id;

create index if not exists news_analyses_created_idx
  on public.news_analyses(created_at desc);

create index if not exists news_analyses_source_url_idx
  on public.news_analyses(source_url)
  where source_url is not null;

-- 테스트 서비스이므로 RLS는 유지하되 익명(public anon) 접근을 허용합니다.
-- 따라서 로그인이나 Anonymous Auth 없이도 분석 결과를 저장/조회할 수 있습니다.
alter table public.news_analyses enable row level security;

create policy "Public can view analyses"
  on public.news_analyses
  for select
  to anon, authenticated
  using (true);

create policy "Public can create analyses"
  on public.news_analyses
  for insert
  to anon, authenticated
  with check (true);

create policy "Public can delete analyses"
  on public.news_analyses
  for delete
  to anon, authenticated
  using (true);
