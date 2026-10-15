-- Store the administrative vacancy state separately from publication activity.
-- Existing records are active by default; this does not invent vacancy status.
begin;
alter table public.post_designations
  add column if not exists status text not null default 'active'
  check (status in ('active','reserved','vacant'));
update public.post_designations set status = case when is_active then 'active' else 'vacant' end
where status is null;
commit;
