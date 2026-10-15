-- Add stable ordering columns consumed by lookup queries.
begin;
alter table public.states add column if not exists sort_order integer not null default 0;
alter table public.districts add column if not exists sort_order integer not null default 0;
alter table public.sub_districts add column if not exists sort_order integer not null default 0;
commit;
