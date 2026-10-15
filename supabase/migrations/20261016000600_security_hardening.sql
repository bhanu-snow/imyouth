-- Security hardening: users cannot self-enable or mutate authorization fields.
begin;

drop policy if exists profiles_update_self_or_admin on public.user_profiles;
drop policy if exists profiles_update_admin on public.user_profiles;
create policy profiles_update_admin on public.user_profiles for update to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin']))
with check (public.has_any_role(array['superadmin','state_president','state_admin']));

drop policy if exists members_submit_application on public.members;
create policy members_submit_application on public.members for insert to anon, authenticated
with check (
  status = 'pending'
  and verified = false
  and approved_by is null
  and approved_at is null
  and (auth_user_id is null or auth_user_id = auth.uid())
);

-- Prevent public users from reading child rows belonging to unpublished editorial content.
drop policy if exists faq_points_read on public.faq_talking_points;
create policy faq_points_read on public.faq_talking_points for select to anon, authenticated
using (
  exists (
    select 1 from public.myth_faqs f
    where f.id = faq_talking_points.faq_id
      and (f.is_published = true or public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
  )
);

drop policy if exists parliamentary_roles_read on public.parliamentary_leader_roles;
create policy parliamentary_roles_read on public.parliamentary_leader_roles for select to anon, authenticated
using (
  exists (
    select 1 from public.parliamentary_leaders l
    where l.id = parliamentary_leader_roles.leader_id
      and (l.is_published = true or public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
  )
);

drop policy if exists parliamentary_contributions_read on public.parliamentary_leader_contributions;
create policy parliamentary_contributions_read on public.parliamentary_leader_contributions for select to anon, authenticated
using (
  exists (
    select 1 from public.parliamentary_leaders l
    where l.id = parliamentary_leader_contributions.leader_id
      and (l.is_published = true or public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
  )
);

commit;
