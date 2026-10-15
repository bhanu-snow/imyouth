-- Publish only organisational directory fields intended for public display.
-- Private contact details remain available to authorised authenticated workflows,
-- but anonymous clients read through these allow-listed views only.
begin;

create or replace view public.sangathan_public_districts as
select
  d.id as district_id,
  d.code as district_code,
  d.name_en,
  d.name_hi,
  od.headquarters,
  od.in_charge_name,
  od.active_cadre_count,
  od.status,
  od.updated_at
from public.districts d
left join public.organizational_districts od on od.district_id = d.id
where d.is_active = true;

create or replace view public.sangathan_public_leadership as
select
  lt.id,
  lt.district_id,
  lt.leader_name_en,
  lt.leader_name_hi,
  lt.post_title_en,
  lt.post_title_hi,
  lt.tenure_start,
  lt.tenure_end,
  lt.status
from public.leadership_tenures lt
join public.districts d on d.id = lt.district_id and d.is_active = true
where lt.status in ('current','past','acting');

revoke select on public.organizational_districts from anon;
revoke select on public.leadership_tenures from anon;
revoke select on public.leadership_achievements from anon;
grant select on public.sangathan_public_districts to anon, authenticated;
grant select on public.sangathan_public_leadership to anon, authenticated;

commit;
