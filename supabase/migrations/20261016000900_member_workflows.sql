-- Member directory: enforce geography consistency and provide a privacy-safe public verification endpoint.
begin;

drop policy if exists members_submit_application on public.members;
create policy members_submit_application on public.members
for insert to anon, authenticated
with check (
  status = 'pending'
  and verified = false
  and approved_by is null
  and approved_at is null
  and exists (
    select 1 from public.districts d
    where d.id = public.members.district_id
      and d.state_id = public.members.state_id
      and d.is_active = true
  )
  and (sub_district_id is null or exists (
    select 1 from public.sub_districts sd
    where sd.id = public.members.sub_district_id
      and sd.district_id = public.members.district_id
      and sd.is_active = true
  ))
);

create or replace function public.verify_public_cadre(p_cadre_id text)
returns table (
  id text,
  full_name text,
  full_name_hi text,
  designation_text text,
  designation_hi text,
  district_name text,
  sub_district_name text,
  wing_code text,
  status text,
  verified boolean,
  approved_at date,
  joined_at date
)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.id,
    m.full_name,
    m.full_name_hi,
    m.designation_text,
    m.designation_hi,
    d.name_en as district_name,
    sd.name_en as sub_district_name,
    w.code as wing_code,
    m.status,
    m.verified,
    m.approved_at::date,
    m.joined_at
  from public.members m
  join public.districts d on d.id = m.district_id
  left join public.sub_districts sd on sd.id = m.sub_district_id and sd.district_id = m.district_id
  left join public.org_wings w on w.id = m.wing_id
  where upper(m.id) = upper(trim(p_cadre_id))
    and m.status = 'approved'
    and m.verified = true
  limit 1;
$$;

revoke all on function public.verify_public_cadre(text) from public;
grant execute on function public.verify_public_cadre(text) to anon, authenticated;

commit;
