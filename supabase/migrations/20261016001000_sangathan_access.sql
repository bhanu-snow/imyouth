-- Sangathan access hardening: district in-charges can only manage leadership in their assigned district.
begin;

drop policy if exists leadership_manage_admin on public.leadership_tenures;
create policy leadership_manage_admin on public.leadership_tenures
for all to authenticated
using (
  public.has_any_role(array['superadmin','state_president','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and district_id = (
      select up.district_id
      from public.user_profiles up
      where up.user_id = auth.uid()
        and up.is_active = true
        and up.allow_login = true
    )
  )
)
with check (
  public.has_any_role(array['superadmin','state_president','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and district_id = (
      select up.district_id
      from public.user_profiles up
      where up.user_id = auth.uid()
        and up.is_active = true
        and up.allow_login = true
    )
  )
);

drop policy if exists leadership_achievements_manage on public.leadership_achievements;
create policy leadership_achievements_manage on public.leadership_achievements
for all to authenticated
using (
  public.has_any_role(array['superadmin','state_president','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and exists (
      select 1
      from public.leadership_tenures lt
      join public.user_profiles up on up.district_id = lt.district_id
      where lt.id = leadership_achievements.tenure_id
        and up.user_id = auth.uid()
        and up.is_active = true
        and up.allow_login = true
    )
  )
)
with check (
  public.has_any_role(array['superadmin','state_president','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and exists (
      select 1
      from public.leadership_tenures lt
      join public.user_profiles up on up.district_id = lt.district_id
      where lt.id = leadership_achievements.tenure_id
        and up.user_id = auth.uid()
        and up.is_active = true
        and up.allow_login = true
    )
  )
);

commit;
