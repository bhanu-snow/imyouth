-- IM Youth Portal: Row Level Security and least-privilege policies
-- Depends on 20261016000100_relational_core.sql.
begin;

create or replace function public.has_any_role(required_codes text[])
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    join public.user_profiles up on up.user_id = ur.user_id
    where ur.user_id = auth.uid()
      and up.is_active = true
      and up.allow_login = true
      and r.is_active = true
      and r.code = any(required_codes)
  );
$$;
revoke all on function public.has_any_role(text[]) from public;
grant execute on function public.has_any_role(text[]) to authenticated;

alter table public.states enable row level security;
alter table public.zones enable row level security;
alter table public.districts enable row level security;
alter table public.sub_districts enable row level security;
alter table public.roles enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.org_wings enable row level security;
alter table public.post_designations enable row level security;
alter table public.organizational_districts enable row level security;
alter table public.members enable row level security;
alter table public.leadership_tenures enable row level security;
alter table public.leadership_achievements enable row level security;
alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.news_categories enable row level security;
alter table public.news_posts enable row level security;
alter table public.news_tags enable row level security;
alter table public.news_post_tags enable row level security;
alter table public.social_platforms enable row level security;
alter table public.social_broadcasts enable row level security;
alter table public.social_broadcast_platforms enable row level security;
alter table public.social_broadcast_hashtags enable row level security;
alter table public.faq_categories enable row level security;
alter table public.myth_faqs enable row level security;
alter table public.faq_talking_points enable row level security;
alter table public.parliamentary_houses enable row level security;
alter table public.parliamentary_leaders enable row level security;
alter table public.parliamentary_leader_roles enable row level security;
alter table public.parliamentary_leader_contributions enable row level security;
alter table public.ideology_comparisons enable row level security;

-- Public read-only access to active lookup catalogs.
create policy states_read_active on public.states for select to anon, authenticated using (is_active);
create policy zones_read_active on public.zones for select to anon, authenticated using (is_active);
create policy districts_read_active on public.districts for select to anon, authenticated using (is_active);
create policy sub_districts_read_active on public.sub_districts for select to anon, authenticated using (is_active);
create policy roles_read_active on public.roles for select to authenticated using (is_active);
create policy wings_read_active on public.org_wings for select to anon, authenticated using (is_active);
create policy designations_read_active on public.post_designations for select to anon, authenticated using (is_active);
create policy event_categories_read_active on public.event_categories for select to anon, authenticated using (is_active);
create policy news_categories_read_active on public.news_categories for select to anon, authenticated using (is_active);
create policy social_platforms_read_active on public.social_platforms for select to authenticated using (is_active);
create policy faq_categories_read_active on public.faq_categories for select to anon, authenticated using (is_active);
create policy parliamentary_houses_read_active on public.parliamentary_houses for select to anon, authenticated using (is_active);

-- User identity: a user can read their own profile. Elevated roles can manage profiles.
create policy profiles_read_self_or_admin on public.user_profiles for select to authenticated
using (user_id = auth.uid() or public.has_any_role(array['superadmin','state_president','state_admin']));
create policy profiles_insert_admin on public.user_profiles for insert to authenticated
with check (public.has_any_role(array['superadmin','state_president','state_admin']));
create policy profiles_update_self_or_admin on public.user_profiles for update to authenticated
using (user_id = auth.uid() or public.has_any_role(array['superadmin','state_president','state_admin']))
with check (user_id = auth.uid() or public.has_any_role(array['superadmin','state_president','state_admin']));
create policy user_roles_read_self_or_admin on public.user_roles for select to authenticated
using (user_id = auth.uid() or public.has_any_role(array['superadmin','state_president','state_admin']));
create policy user_roles_manage_admin on public.user_roles for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin']))
with check (public.has_any_role(array['superadmin','state_president','state_admin']));
create policy roles_manage_admin on public.roles for all to authenticated
using (public.has_any_role(array['superadmin'])) with check (public.has_any_role(array['superadmin']));

-- Organization catalogs are public-read, admin-write.
create policy wings_manage_admin on public.org_wings for all to authenticated
using (public.has_any_role(array['superadmin','state_president'])) with check (public.has_any_role(array['superadmin','state_president']));
create policy designations_manage_admin on public.post_designations for all to authenticated
using (public.has_any_role(array['superadmin','state_president'])) with check (public.has_any_role(array['superadmin','state_president']));
create policy org_districts_read on public.organizational_districts for select to anon, authenticated using (true);
create policy org_districts_manage_admin on public.organizational_districts for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin'])) with check (public.has_any_role(array['superadmin','state_president','state_admin']));

-- Member applications may be submitted anonymously, but public clients cannot read member data.
create policy members_submit_application on public.members for insert to anon, authenticated
with check (status = 'pending' and verified = false and approved_by is null and approved_at is null);
create policy members_read_self_or_admin on public.members for select to authenticated
using (auth_user_id = auth.uid()
  or public.has_any_role(array['superadmin','state_president','state_admin'])
  or (public.has_any_role(array['district_incharge']) and district_id = (
    select up.district_id from public.user_profiles up where up.user_id = auth.uid()
  )));
create policy members_update_admin on public.members for update to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin'])
  or (public.has_any_role(array['district_incharge']) and district_id = (
    select up.district_id from public.user_profiles up where up.user_id = auth.uid()
  )))
with check (public.has_any_role(array['superadmin','state_president','state_admin'])
  or (public.has_any_role(array['district_incharge']) and district_id = (
    select up.district_id from public.user_profiles up where up.user_id = auth.uid()
  )));
create policy members_delete_admin on public.members for delete to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin']));

-- Leadership and event content: public reads only current/published; role-gated writes.
create policy leadership_read on public.leadership_tenures for select to anon, authenticated using (true);
create policy leadership_manage_admin on public.leadership_tenures for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','district_incharge']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','district_incharge']));
create policy leadership_achievements_read on public.leadership_achievements for select to anon, authenticated using (true);
create policy leadership_achievements_manage on public.leadership_achievements for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','district_incharge']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','district_incharge']));

create policy events_read_published on public.events for select to anon, authenticated using (is_published or public.has_any_role(array['superadmin','state_president','state_admin','press_release','district_incharge']));
create policy events_manage_editor on public.events for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','district_incharge']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','district_incharge']));
create policy rsvps_read_own_or_editor on public.event_rsvps for select to authenticated
using (user_id = auth.uid() or public.has_any_role(array['superadmin','state_president','state_admin','press_release']));
create policy rsvps_insert_own on public.event_rsvps for insert to authenticated
with check (user_id = auth.uid());
create policy rsvps_update_own on public.event_rsvps for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy rsvps_delete_own_or_admin on public.event_rsvps for delete to authenticated
using (user_id = auth.uid() or public.has_any_role(array['superadmin','state_president','state_admin']));

create policy news_posts_read_published on public.news_posts for select to anon, authenticated
using (is_published or public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));
create policy news_posts_manage_editor on public.news_posts for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));
create policy news_tags_read on public.news_tags for select to anon, authenticated using (true);
create policy news_tags_manage on public.news_tags for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));
create policy news_post_tags_read on public.news_post_tags for select to anon, authenticated using (true);
create policy news_post_tags_manage on public.news_post_tags for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));

create policy broadcasts_read on public.social_broadcasts for select to authenticated using (true);
create policy broadcasts_manage on public.social_broadcasts for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));
create policy broadcast_platforms_read on public.social_broadcast_platforms for select to authenticated using (true);
create policy broadcast_platforms_manage on public.social_broadcast_platforms for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));
create policy broadcast_hashtags_read on public.social_broadcast_hashtags for select to authenticated using (true);
create policy broadcast_hashtags_manage on public.social_broadcast_hashtags for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','press_release','content_manager']));

create policy faqs_read_published on public.myth_faqs for select to anon, authenticated
using (is_published or public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy faqs_manage_editor on public.myth_faqs for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy faq_points_read on public.faq_talking_points for select to anon, authenticated using (true);
create policy faq_points_manage on public.faq_talking_points for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));

create policy parliamentary_leaders_read on public.parliamentary_leaders for select to anon, authenticated using (is_published or public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy parliamentary_leaders_manage on public.parliamentary_leaders for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy parliamentary_roles_read on public.parliamentary_leader_roles for select to anon, authenticated using (true);
create policy parliamentary_roles_manage on public.parliamentary_leader_roles for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy parliamentary_contributions_read on public.parliamentary_leader_contributions for select to anon, authenticated using (true);
create policy parliamentary_contributions_manage on public.parliamentary_leader_contributions for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy ideology_read on public.ideology_comparisons for select to anon, authenticated using (is_published or public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));
create policy ideology_manage on public.ideology_comparisons for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']))
with check (public.has_any_role(array['superadmin','state_president','state_admin','content_manager']));

-- Authenticated access to catalogs whose contents are operationally sensitive.
create policy social_platforms_manage on public.social_platforms for all to authenticated
using (public.has_any_role(array['superadmin','state_president','state_admin']))
with check (public.has_any_role(array['superadmin','state_president','state_admin']));

commit();
