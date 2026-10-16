-- Run this in the Supabase SQL Editor before configuring the Vercel environment.
-- The service role key is used only by the server route and must never be public.
create table if not exists public.attendance_responses (
  voter_id uuid primary key,
  choice text not null check (choice in ('attending', 'not-attending')),
  updated_at timestamptz not null default now()
);

create table if not exists public.website_reviews (
  voter_id uuid primary key,
  choice text not null check (choice in ('stunning', 'fair')),
  updated_at timestamptz not null default now()
);

create table if not exists public.visitor_reviews (
  voter_id uuid primary key,
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 1000),
  submitted_at timestamptz not null default now()
);

create table if not exists public.guest_messages (
  message_id uuid primary key,
  name text not null check (char_length(name) between 1 and 80),
  relationship text check (relationship is null or char_length(relationship) <= 80),
  message text not null check (char_length(message) between 1 and 1000),
  submitted_at timestamptz not null default now()
);

alter table public.attendance_responses enable row level security;
alter table public.website_reviews enable row level security;
alter table public.visitor_reviews enable row level security;
alter table public.guest_messages enable row level security;

-- All access is mediated by the Next.js API using its server-only service role key.
revoke all on table public.attendance_responses from anon, authenticated;
revoke all on table public.website_reviews from anon, authenticated;
revoke all on table public.visitor_reviews from anon, authenticated;
revoke all on table public.guest_messages from anon, authenticated;
grant all on table public.attendance_responses to service_role;
grant all on table public.website_reviews to service_role;
grant all on table public.visitor_reviews to service_role;
grant all on table public.guest_messages to service_role;
