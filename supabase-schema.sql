-- NexusMind Supabase 数据库 Schema
-- 在 Supabase Dashboard > SQL Editor 中执行此文件
-- 注意：如果已执行过旧版本，请先执行底部的"重置脚本"再执行此文件

-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- ============================================================
-- 用户历史记录表（对撞、断裂测试、MVA、翻译）
-- ============================================================
create table if not exists public.user_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('collider', 'stress-test', 'mva', 'translator')),
  input jsonb not null,
  output text,
  created_at timestamptz default now()
);

alter table public.user_sessions enable row level security;
create policy "Users can view own sessions"
  on public.user_sessions for select
  using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on public.user_sessions for insert
  with check (auth.uid() = user_id);
create policy "Users can delete own sessions"
  on public.user_sessions for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 社区点子表（去隐私化后的创意，支持匿名发布）
-- ============================================================
create table if not exists public.community_ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,  -- 可为空（匿名）
  core_logic text not null,
  tags text[] default '{}',
  domain_cross text,
  cert_id text unique not null,
  cert_hash text,
  cert_timestamp timestamptz default now(),
  reviews_count int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

alter table public.community_ideas enable row level security;

-- 所有人可以读已发布的点子
create policy "Anyone can view published ideas"
  on public.community_ideas for select
  using (is_published = true);

-- 允许匿名发布（user_id 可以为 null）
create policy "Anyone can insert ideas"
  on public.community_ideas for insert
  with check (true);

-- 只有作者可以更新自己的点子（匿名发布的无法更新）
create policy "Authors can update own ideas"
  on public.community_ideas for update
  using (auth.uid() = user_id);

-- ============================================================
-- 点子评议表（支持匿名评议）
-- ============================================================
create table if not exists public.idea_reviews (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.community_ideas(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewer_domain text,
  content text not null,
  created_at timestamptz default now()
);

alter table public.idea_reviews enable row level security;

create policy "Anyone can view reviews"
  on public.idea_reviews for select
  using (true);

-- 允许匿名评议
create policy "Anyone can insert reviews"
  on public.idea_reviews for insert
  with check (true);

-- ============================================================
-- 合伙请求表
-- ============================================================
create table if not exists public.partnership_requests (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.community_ideas(id) on delete cascade,
  requester_id uuid references auth.users(id) on delete cascade,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now()
);

alter table public.partnership_requests enable row level security;
create policy "Idea owners can view requests"
  on public.partnership_requests for select
  using (
    auth.uid() = requester_id or
    auth.uid() = (select user_id from public.community_ideas where id = idea_id)
  );
create policy "Authenticated users can send requests"
  on public.partnership_requests for insert
  with check (auth.uid() = requester_id);

-- ============================================================
-- 索引优化
-- ============================================================
create index if not exists idx_user_sessions_user_id on public.user_sessions(user_id);
create index if not exists idx_user_sessions_type on public.user_sessions(type);
create index if not exists idx_community_ideas_tags on public.community_ideas using gin(tags);
create index if not exists idx_community_ideas_created on public.community_ideas(created_at desc);

-- ============================================================
-- 如果已有旧表需要重置，先执行以下语句（取消注释）：
-- ============================================================
-- drop policy if exists "Users can insert own ideas" on public.community_ideas;
-- drop policy if exists "Authenticated users can insert reviews" on public.idea_reviews;
-- create policy "Anyone can insert ideas" on public.community_ideas for insert with check (true);
-- create policy "Anyone can insert reviews" on public.idea_reviews for insert with check (true);
