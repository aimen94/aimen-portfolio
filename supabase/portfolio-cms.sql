-- Aimen Portfolio CMS schema
-- Run this once in the Supabase SQL editor.

create table if not exists public.portfolio_site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.portfolio_site_content enable row level security;
alter table public.portfolio_admins enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.portfolio_admins a where a.user_id = auth.uid()
  );
$$;

grant execute on function public.is_portfolio_admin() to anon, authenticated;

-- Public visitors can read the published site document.
drop policy if exists "portfolio content public read" on public.portfolio_site_content;
create policy "portfolio content public read"
on public.portfolio_site_content for select
to anon, authenticated
using (true);

-- Only approved admins can create/update/delete content.
drop policy if exists "portfolio content admin insert" on public.portfolio_site_content;
create policy "portfolio content admin insert"
on public.portfolio_site_content for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "portfolio content admin update" on public.portfolio_site_content;
create policy "portfolio content admin update"
on public.portfolio_site_content for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "portfolio content admin delete" on public.portfolio_site_content;
create policy "portfolio content admin delete"
on public.portfolio_site_content for delete
to authenticated
using (public.is_portfolio_admin());

-- Admin table: an authenticated user may only see their own membership row.
drop policy if exists "portfolio admin read self" on public.portfolio_admins;
create policy "portfolio admin read self"
on public.portfolio_admins for select
to authenticated
using (user_id = auth.uid());

-- Public asset bucket for portfolio screenshots and CV files.
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio assets public read" on storage.objects;
create policy "portfolio assets public read"
on storage.objects for select
to public
using (bucket_id = 'portfolio-assets');

drop policy if exists "portfolio assets admin insert" on storage.objects;
create policy "portfolio assets admin insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

drop policy if exists "portfolio assets admin update" on storage.objects;
create policy "portfolio assets admin update"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin())
with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

drop policy if exists "portfolio assets admin delete" on storage.objects;
create policy "portfolio assets admin delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

-- AFTER creating your admin user in Authentication, run this with your email:
-- insert into public.portfolio_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL@example.com'
-- on conflict (user_id) do nothing;
