-- Complete the minimum lookup graph and tighten geographic referential integrity.
begin;

-- These are generic district-level units, not claims about official tehsil boundaries.
-- Replace/extend with the verified UP tehsil/block/ward directory before production.
insert into public.sub_districts(district_id,code,name_en,name_hi,unit_type)
select d.id,'district_hq','District HQ / Local Unit','ज़िला मुख्यालय / स्थानीय इकाई','local_unit'
from public.districts d
where d.code in ('moradabad','sambhal','rampur','bareilly','meerut','aligarh','saharanpur','muzaffarnagar','lucknow','kanpur_nagar','agra','varanasi')
on conflict(district_id,code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,unit_type=excluded.unit_type;

-- Ensure the selected district belongs to the selected state.
alter table public.members drop constraint if exists members_district_state_fk;
alter table public.members add constraint members_district_state_fk
  foreign key(district_id,state_id) references public.districts(id,state_id) on delete restrict;

alter table public.events drop constraint if exists events_district_state_fk;
alter table public.events add constraint events_district_state_fk
  foreign key(district_id,state_id) references public.districts(id,state_id) on delete restrict;

-- has_any_role returns false for anonymous users; allowing execution lets public RLS
-- policies safely call it while preserving role checks for authenticated users.
grant execute on function public.has_any_role(text[]) to anon, authenticated;

commit;
