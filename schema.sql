-- ARC APP STORE DATABASE SCHEMA (UPDATED & MATCHED)
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Note: Running this will drop existing empty tables and create them with all columns.

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Drop existing tables if needed (cascade to clear policies/indexes)
drop table if exists public.apps cascade;
drop table if exists public.submissions cascade;

-- 3. Create the Apps Table
create table public.apps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  logo_url text not null,
  screenshot_urls text[] default '{}'::text[] not null,
  short_description text not null,
  description text not null,
  website text not null,
  twitter text,
  telegram text,
  discord text,
  category text not null,
  blockchain text,
  wallet_address text,
  approved boolean default true not null,
  is_featured boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create the Submissions Table
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text not null,
  screenshot_urls text[] default '{}'::text[] not null,
  short_description text not null,
  description text not null,
  website text not null,
  twitter text,
  telegram text,
  discord text,
  category text not null,
  blockchain text,
  wallet_address text,
  status text default 'pending'::text not null check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Indexes
create index idx_apps_category on public.apps(category);
create index idx_apps_slug on public.apps(slug);
create index idx_apps_approved on public.apps(approved);
create index idx_submissions_status on public.submissions(status);

-- 6. Enable Row Level Security (RLS)
alter table public.apps enable row level security;
alter table public.submissions enable row level security;

-- 7. RLS Policies for 'apps'
create policy "Allow public read approved apps"
  on public.apps for select
  using (approved = true);

create policy "Allow authenticated admin full control on apps"
  on public.apps for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 8. RLS Policies for 'submissions'
create policy "Allow public insert submissions"
  on public.submissions for insert
  with check (true);

create policy "Allow authenticated admin full control on submissions"
  on public.submissions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
