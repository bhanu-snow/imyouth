-- Normalize designation level and vacancy-status dropdown catalogs.
begin;

create table if not exists public.designation_levels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
create table if not exists public.designation_statuses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
alter table public.designation_levels enable row level security;
alter table public.designation_statuses enable row level security;
drop policy if exists designation_levels_read_active on public.designation_levels;
create policy designation_levels_read_active on public.designation_levels for select to anon, authenticated using (is_active);
drop policy if exists designation_statuses_read_active on public.designation_statuses;
create policy designation_statuses_read_active on public.designation_statuses for select to anon, authenticated using (is_active);

insert into public.designation_levels(code,name_en,name_hi,sort_order)
values ('state','State','प्रदेश',1),('zonal','Zonal','ज़ोनल',2),('district','District','ज़िला',3),('block','Block / Campus','ब्लॉक / कैंपस',4),('ward','Ward / Mohalla','वार्ड / मोहल्ला',5)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;
insert into public.designation_statuses(code,name_en,name_hi,sort_order)
values ('active','Active','सक्रिय',1),('reserved','Reserved','आरक्षित',2),('vacant','Vacant','रिक्त',3)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

commit;
