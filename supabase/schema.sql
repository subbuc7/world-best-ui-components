create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  component_count int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text default '',
  preview_html text not null default '',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.component_versions (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.components(id) on delete cascade,
  name text not null,
  tech_key text not null check (tech_key in ('html-css-js','tailwind','react','nextjs')),
  price numeric(10,2) not null default 0 check (price >= 0),
  is_free boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  unique(component_id, tech_key)
);

create table if not exists public.component_code (
  id uuid primary key default gen_random_uuid(),
  component_version_id uuid not null unique references public.component_versions(id) on delete cascade,
  html text default '',
  css text default '',
  js text default '',
  code_text text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  component_version_id uuid not null references public.component_versions(id) on delete restrict,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  amount numeric(10,2) not null,
  currency text not null default 'INR',
  status text not null default 'created' check(status in ('created','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.access_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  component_version_id uuid not null references public.component_versions(id) on delete cascade,
  purchase_id uuid references public.purchases(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(user_id, component_version_id)
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.components enable row level security;
alter table public.component_versions enable row level security;
alter table public.component_code enable row level security;
alter table public.purchases enable row level security;
alter table public.access_permissions enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select lower(coalesce(auth.jwt()->>'email','')) = 'reddysubramanyam.h@gmail.com' $$;

drop policy if exists "published categories are public" on public.categories;
create policy "published categories are public" on public.categories for select using (is_published or public.is_admin());
drop policy if exists "published components are public" on public.components;
create policy "published components are public" on public.components for select using (is_published or public.is_admin());
drop policy if exists "published versions are public" on public.component_versions;
create policy "published versions are public" on public.component_versions for select using (is_published or public.is_admin());

drop policy if exists "admin manages categories" on public.categories;
create policy "admin manages categories" on public.categories for all using(public.is_admin()) with check(public.is_admin());
drop policy if exists "admin manages components" on public.components;
create policy "admin manages components" on public.components for all using(public.is_admin()) with check(public.is_admin());
drop policy if exists "admin manages versions" on public.component_versions;
create policy "admin manages versions" on public.component_versions for all using(public.is_admin()) with check(public.is_admin());
drop policy if exists "admin manages code" on public.component_code;
create policy "admin manages code" on public.component_code for all using(public.is_admin()) with check(public.is_admin());

drop policy if exists "users see own purchases" on public.purchases;
create policy "users see own purchases" on public.purchases for select using(auth.uid()=user_id or public.is_admin());
drop policy if exists "users see own access" on public.access_permissions;
create policy "users see own access" on public.access_permissions for select using(auth.uid()=user_id or public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$ begin insert into public.profiles(id,email) values(new.id,new.email) on conflict(id) do update set email=excluded.email; return new; end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.categories(name,slug,sort_order) values
('Form & Input','form-input',1),('Layout & Containers','layout-containers',2),('Navigation','navigation',3),
('Feedback & Status','feedback-status',4),('Identity & User','identity-user',5),('Data & Visualization','data-visualization',6),
('Authentication','authentication',7),('E-commerce','e-commerce',8),('AI','ai',9),('Charts','charts',10),
('Marketing','marketing',11),('Mobile','mobile',12),('Landing Pages','landing-pages',13)
on conflict(slug) do nothing;
