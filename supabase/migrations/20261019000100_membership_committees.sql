-- Dated MYL membership and office history, scoped committees, reviewer alerts,
-- and a public FAQ cache revision token.
begin;

-- Keep legacy wing rows for historical references, but accept new records only
-- under the single active Muslim Youth League wing.
update public.org_wings
set is_active = (code = 'myl_cadre'),
    updated_at = now();

update public.post_designations
set wing_id = (select id from public.org_wings where code = 'myl_cadre')
where wing_id is null;

update public.post_designations p
set is_active = false
where not exists (
  select 1 from public.org_wings w
  where w.id = p.wing_id and w.is_active = true
);

update public.members
set wing_id = (select id from public.org_wings where code = 'myl_cadre')
where status in ('pending','approved');

alter table public.post_designations
  alter column wing_id set not null;

create unique index if not exists uq_district_id_state_zone
  on public.districts(id, state_id, zone_id);

create or replace function public.enforce_single_active_myl_wing()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.is_active and new.code <> 'myl_cadre' then
    raise exception 'Only Muslim Youth League may be an active wing.';
  end if;
  if new.code = 'myl_cadre' and not new.is_active then
    raise exception 'The Muslim Youth League wing must remain active.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_single_active_myl_wing on public.org_wings;
create trigger enforce_single_active_myl_wing
before insert or update of code, is_active on public.org_wings
for each row execute function public.enforce_single_active_myl_wing();

create or replace function public.validate_myl_committee_wing()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.org_wings
    where id = new.wing_id and code = 'myl_cadre' and is_active = true
  ) then
    raise exception 'Committees must belong to the active Muslim Youth League wing.';
  end if;
  return new;
end;
$$;

create table if not exists public.committees (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  description_en text not null default '',
  description_hi text not null default '',
  wing_id uuid not null references public.org_wings(id) on delete restrict,
  scope_level text not null check (scope_level in ('state','zonal','district')),
  state_id uuid not null references public.states(id) on delete restrict,
  zone_id uuid,
  district_id uuid,
  starts_on date not null default current_date,
  ends_on date,
  status text not null default 'forming' check (status in ('forming','active','closed')),
  created_by uuid not null default auth.uid() references public.user_profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (zone_id, state_id) references public.zones(id, state_id) on delete restrict,
  foreign key (district_id, state_id, zone_id) references public.districts(id, state_id, zone_id) on delete restrict,
  check (
    (scope_level = 'state' and zone_id is null and district_id is null)
    or (scope_level = 'zonal' and zone_id is not null and district_id is null)
    or (scope_level = 'district' and zone_id is not null and district_id is not null)
  ),
  check (ends_on is null or ends_on >= starts_on),
  unique (id, wing_id),
  unique (id, scope_level, state_id, zone_id, district_id)
);

create index if not exists idx_committees_scope_active
  on public.committees(scope_level, state_id, zone_id, district_id, status);

drop trigger if exists validate_myl_committee_wing on public.committees;
create trigger validate_myl_committee_wing
before insert or update of wing_id on public.committees
for each row execute function public.validate_myl_committee_wing();

create table if not exists public.member_memberships (
  id uuid primary key default gen_random_uuid(),
  member_id text not null references public.members(id) on delete restrict,
  wing_id uuid not null references public.org_wings(id) on delete restrict,
  membership_type text not null default 'primary'
    check (membership_type = 'primary'),
  starts_on date not null,
  ends_on date,
  end_reason text check (end_reason in ('joined_other_organization','resigned','other')),
  end_notes text,
  started_by uuid references public.user_profiles(user_id) on delete set null,
  ended_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on),
  check ((ends_on is null and end_reason is null) or (ends_on is not null and end_reason is not null))
);

create unique index if not exists uq_member_memberships_one_active_primary
  on public.member_memberships(member_id)
  where membership_type = 'primary' and ends_on is null;
create index if not exists idx_member_memberships_member_history
  on public.member_memberships(member_id, starts_on desc);

create or replace function public.validate_myl_member_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.org_wings
    where id = new.wing_id and code = 'myl_cadre' and is_active = true
  ) then
    raise exception 'Primary membership must belong to the active Muslim Youth League wing.';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_myl_member_membership on public.member_memberships;
create trigger validate_myl_member_membership
before insert or update of wing_id on public.member_memberships
for each row execute function public.validate_myl_member_membership();

create table if not exists public.member_designation_appointments (
  id uuid primary key default gen_random_uuid(),
  member_id text not null references public.members(id) on delete restrict,
  post_designation_id uuid not null references public.post_designations(id) on delete restrict,
  scope_level text not null check (scope_level in ('state','zonal','district','block','ward')),
  state_id uuid not null references public.states(id) on delete restrict,
  zone_id uuid,
  district_id uuid,
  sub_district_id uuid,
  starts_on date not null,
  ends_on date,
  end_reason text check (end_reason in ('term_ended','resigned','replaced','other')),
  end_notes text,
  appointed_by uuid not null default auth.uid() references public.user_profiles(user_id) on delete restrict,
  ended_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (zone_id, state_id) references public.zones(id, state_id) on delete restrict,
  foreign key (district_id, state_id, zone_id) references public.districts(id, state_id, zone_id) on delete restrict,
  foreign key (sub_district_id, district_id) references public.sub_districts(id, district_id) on delete restrict,
  check (
    (scope_level = 'state' and zone_id is null and district_id is null and sub_district_id is null)
    or (scope_level = 'zonal' and zone_id is not null and district_id is null and sub_district_id is null)
    or (scope_level = 'district' and zone_id is not null and district_id is not null and sub_district_id is null)
    or (scope_level in ('block','ward') and zone_id is not null and district_id is not null and sub_district_id is not null)
  ),
  check (ends_on is null or ends_on >= starts_on),
  check ((ends_on is null and end_reason is null) or (ends_on is not null and end_reason is not null))
);

create unique index if not exists uq_active_member_designation_scope
  on public.member_designation_appointments(
    member_id,
    post_designation_id,
    scope_level,
    coalesce(zone_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(district_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(sub_district_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  where ends_on is null;
create index if not exists idx_member_appointments_member_history
  on public.member_designation_appointments(member_id, starts_on desc);
create index if not exists idx_member_appointments_scope
  on public.member_designation_appointments(state_id, zone_id, district_id, scope_level);

alter table public.post_designations add column if not exists committee_id uuid;
alter table public.post_designations
  add constraint post_designations_committee_wing_fk
  foreign key (committee_id, wing_id) references public.committees(id, wing_id)
  on delete restrict;

create or replace function public.validate_post_designation_committee()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  committee_scope text;
  committee_wing uuid;
begin
  if new.wing_id is null then
    raise exception 'A post designation must belong to an organization wing.';
  end if;
  if new.is_active and not exists (
    select 1 from public.org_wings where id = new.wing_id and is_active = true
  ) then
    raise exception 'An active designation must belong to an active wing.';
  end if;
  if new.committee_id is not null then
    select c.scope_level, c.wing_id
      into committee_scope, committee_wing
      from public.committees c
     where c.id = new.committee_id;
    if not found then
      raise exception 'Committee does not exist.';
    end if;
    if committee_wing <> new.wing_id then
      raise exception 'Committee post and designation must belong to the same wing.';
    end if;
    if new.level <> committee_scope then
      raise exception 'Committee post level must match its committee scope.';
    end if;
    if new.is_active and exists (
      select 1 from public.committees c
      where c.id = new.committee_id and c.status = 'closed'
    ) then
      raise exception 'An active designation cannot be added to a closed committee.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists validate_post_designation_committee on public.post_designations;
create trigger validate_post_designation_committee
before insert or update of wing_id, committee_id, level on public.post_designations
for each row execute function public.validate_post_designation_committee();

alter table public.committees enable row level security;
alter table public.member_memberships enable row level security;
alter table public.member_designation_appointments enable row level security;

create or replace function public.can_manage_org_scope(
  p_scope_level text,
  p_state_id uuid,
  p_zone_id uuid,
  p_district_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_any_role(array['superadmin'])
    or (
      p_scope_level in ('state','zonal')
      and public.has_any_role(array['state_admin'])
    )
    or (
      p_district_id is not null
      and public.has_any_role(array['district_incharge'])
      and exists (
        select 1
        from public.user_profiles up
        where up.user_id = auth.uid()
          and up.is_active = true
          and up.allow_login = true
          and up.district_id = p_district_id
      )
    );
$$;

create or replace function public.can_manage_member(p_member_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.members m
    where m.id = p_member_id
      and (
        public.has_any_role(array['superadmin','state_admin'])
        or (
          public.has_any_role(array['district_incharge'])
          and m.district_id = (
            select up.district_id from public.user_profiles up
            where up.user_id = auth.uid()
              and up.is_active = true
              and up.allow_login = true
          )
        )
      )
  );
$$;

drop policy if exists committees_read_authenticated on public.committees;
create policy committees_read_authenticated on public.committees
for select to authenticated
using (public.can_manage_org_scope(scope_level, state_id, zone_id, district_id));
drop policy if exists committees_manage_by_scope on public.committees;
create policy committees_manage_by_scope on public.committees
for all to authenticated
using (public.can_manage_org_scope(scope_level, state_id, zone_id, district_id))
with check (public.can_manage_org_scope(scope_level, state_id, zone_id, district_id));
grant select, insert, update on public.committees to authenticated;

drop policy if exists designations_read_active on public.post_designations;
create policy designations_read_active on public.post_designations
for select to anon, authenticated using (
  is_active
  or public.has_any_role(array['superadmin','state_admin','district_incharge'])
);
drop policy if exists designations_manage_admin on public.post_designations;
create policy designations_manage_admin on public.post_designations
for all to authenticated
using (
  public.has_any_role(array['superadmin'])
  or (committee_id is null and public.has_any_role(array['state_admin']))
  or exists (
    select 1 from public.committees c
    where c.id = post_designations.committee_id
      and public.can_manage_org_scope(c.scope_level, c.state_id, c.zone_id, c.district_id)
  )
)
with check (
  public.has_any_role(array['superadmin'])
  or (committee_id is null and public.has_any_role(array['state_admin']))
  or exists (
    select 1 from public.committees c
    where c.id = post_designations.committee_id
      and public.can_manage_org_scope(c.scope_level, c.state_id, c.zone_id, c.district_id)
  )
);
grant select on public.org_wings, public.post_designations to anon, authenticated;
grant update on public.org_wings to authenticated;
grant insert, update on public.post_designations to authenticated;

drop policy if exists wings_manage_admin on public.org_wings;
drop policy if exists wings_admin_read_all on public.org_wings;
create policy wings_admin_read_all on public.org_wings for select to authenticated
using (public.has_any_role(array['superadmin','state_admin']));
create policy wings_manage_admin on public.org_wings for all to authenticated
using (public.has_any_role(array['superadmin']))
with check (public.has_any_role(array['superadmin']));

drop policy if exists members_update_admin on public.members;
create policy members_update_admin on public.members
for update to authenticated
using (
  public.has_any_role(array['superadmin','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and district_id = (
      select up.district_id from public.user_profiles up
      where up.user_id = auth.uid() and up.is_active and up.allow_login
    )
  )
)
with check (
  public.has_any_role(array['superadmin','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and district_id = (
      select up.district_id from public.user_profiles up
      where up.user_id = auth.uid() and up.is_active and up.allow_login
    )
  )
);
drop policy if exists members_read_self_or_admin on public.members;
create policy members_read_self_or_admin on public.members
for select to authenticated
using (
  auth_user_id = auth.uid()
  or public.has_any_role(array['superadmin','state_admin'])
  or (
    public.has_any_role(array['district_incharge'])
    and district_id = (
      select up.district_id from public.user_profiles up
      where up.user_id = auth.uid() and up.is_active and up.allow_login
    )
  )
);
drop policy if exists members_submit_application on public.members;
create policy members_submit_application on public.members
for insert to anon, authenticated
with check (
  status = 'pending'
  and verified = false
  and approved_by is null
  and approved_at is null
  and (auth_user_id is null or auth_user_id = auth.uid())
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
  and exists (
    select 1 from public.org_wings w
    where w.id = public.members.wing_id
      and w.code = 'myl_cadre'
      and w.is_active = true
  )
);
drop policy if exists members_delete_admin on public.members;
grant select, update on public.members to authenticated;
grant insert on public.members to anon, authenticated;

create policy memberships_read_self_or_manager on public.member_memberships
for select to authenticated
using (
  exists (select 1 from public.members m where m.id = member_memberships.member_id and m.auth_user_id = auth.uid())
  or public.can_manage_member(member_id)
);

create policy appointments_read_self_or_manager on public.member_designation_appointments
for select to authenticated
using (
  exists (select 1 from public.members m where m.id = member_designation_appointments.member_id and m.auth_user_id = auth.uid())
  or public.has_any_role(array['superadmin','state_admin'])
  or public.can_manage_org_scope(scope_level, state_id, zone_id, district_id)
);

create or replace function public.validate_member_designation_appointment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  designation_level text;
  designation_committee_id uuid;
  committee public.committees%rowtype;
begin
  select level, committee_id
    into designation_level, designation_committee_id
    from public.post_designations
   where id = new.post_designation_id and is_active = true;
  if not found then
    raise exception 'Select an active post designation.';
  end if;
  if designation_level <> new.scope_level then
    raise exception 'Appointment scope must match the designation level.';
  end if;
  if not exists (
    select 1 from public.member_memberships mm
    where mm.member_id = new.member_id and mm.ends_on is null
  ) then
    raise exception 'Only an active Primary Member can receive an appointment.';
  end if;
  if designation_committee_id is not null then
    select * into committee from public.committees where id = designation_committee_id;
    if committee.status = 'closed'
      or committee.scope_level <> new.scope_level
      or committee.state_id <> new.state_id
      or committee.zone_id is distinct from new.zone_id
      or committee.district_id is distinct from new.district_id then
      raise exception 'Appointment scope must match its active committee.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists validate_member_designation_appointment on public.member_designation_appointments;
create trigger validate_member_designation_appointment
before insert or update of member_id, post_designation_id, scope_level, state_id, zone_id, district_id, sub_district_id
on public.member_designation_appointments
for each row execute function public.validate_member_designation_appointment();

create or replace function public.close_committee_appointments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'closed' and old.status <> 'closed' then
    new.ends_on := coalesce(new.ends_on, current_date);
    if exists (
      select 1
      from public.member_designation_appointments a
      join public.post_designations p on p.id = a.post_designation_id
      where p.committee_id = new.id and a.ends_on is null
        and a.starts_on > new.ends_on
    ) then
      raise exception 'Committee end date cannot precede an active appointment start date.';
    end if;
    update public.member_designation_appointments a
       set ends_on = new.ends_on, end_reason = 'term_ended', ended_by = auth.uid()
      from public.post_designations p
     where p.id = a.post_designation_id
       and p.committee_id = new.id
       and a.ends_on is null;
  end if;
  return new;
end;
$$;

drop trigger if exists close_committee_appointments on public.committees;
create trigger close_committee_appointments
before update of status on public.committees
for each row execute function public.close_committee_appointments();

create or replace function public.approve_member_request(p_request_id text, p_cadre_id text)
returns public.members
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_actor uuid := auth.uid();
  v_member public.members%rowtype;
  v_wing_id uuid;
begin
  if v_actor is null
    or not public.has_any_role(array['superadmin','state_admin','district_incharge']) then
    raise exception 'You are not authorized to approve membership requests.';
  end if;

  select * into v_member from public.members where id = p_request_id and status = 'pending' for update;
  if not found then
    raise exception 'This application is no longer pending.';
  end if;
  if not public.can_manage_member(v_member.id) then
    raise exception 'You cannot approve applications outside your assigned scope.';
  end if;

  select id into v_wing_id from public.org_wings
   where code = 'myl_cadre' and is_active = true;
  if v_wing_id is null then
    raise exception 'The active Muslim Youth League wing is missing.';
  end if;

  update public.members
     set cadre_id = p_cadre_id, status = 'approved', verified = true,
         approved_by = v_actor, approved_at = now(), wing_id = v_wing_id,
         designation_text = 'Primary Member', designation_hi = 'प्राथमिक सदस्य'
   where id = v_member.id
   returning * into v_member;

  insert into public.member_memberships(member_id, wing_id, starts_on, started_by)
  values (v_member.id, v_wing_id, current_date, v_actor);
  return v_member;
end;
$$;

create or replace function public.reject_member_request(p_request_id text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_member public.members%rowtype;
begin
  if auth.uid() is null
    or not public.has_any_role(array['superadmin','state_admin','district_incharge']) then
    raise exception 'You are not authorized to reject membership requests.';
  end if;
  select * into v_member from public.members where id = p_request_id and status = 'pending' for update;
  if not found then
    raise exception 'This application is no longer pending.';
  end if;
  if not public.can_manage_member(v_member.id) then
    raise exception 'You cannot reject applications outside your assigned scope.';
  end if;
  update public.members set status = 'rejected', verified = false where id = v_member.id;
end;
$$;

create or replace function public.end_member_membership(
  p_membership_id uuid,
  p_ends_on date,
  p_reason text,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_membership public.member_memberships%rowtype;
begin
  if auth.uid() is null
    or not public.has_any_role(array['superadmin','state_admin','district_incharge']) then
    raise exception 'You are not authorized to update membership status.';
  end if;
  select * into v_membership from public.member_memberships
   where id = p_membership_id and ends_on is null for update;
  if not found then
    raise exception 'This membership is already ended or no longer exists.';
  end if;
  if not public.can_manage_member(v_membership.member_id) then
    raise exception 'You cannot update membership outside your assigned scope.';
  end if;
  if p_reason not in ('joined_other_organization','resigned','other') then
    raise exception 'Select a valid membership end reason.';
  end if;
  if p_ends_on < v_membership.starts_on or p_ends_on > current_date then
    raise exception 'Membership end date must be between its start date and today.';
  end if;
  if exists (
    select 1 from public.member_designation_appointments a
    where a.member_id = v_membership.member_id
      and a.ends_on is null
      and a.starts_on > p_ends_on
  ) then
    raise exception 'Membership end date cannot precede an active appointment start date.';
  end if;
  update public.member_designation_appointments
     set ends_on = p_ends_on,
         end_reason = case when p_reason = 'resigned' then 'resigned' else 'other' end,
         ended_by = auth.uid()
   where member_id = v_membership.member_id and ends_on is null;
  update public.member_memberships
     set ends_on = p_ends_on, end_reason = p_reason, end_notes = nullif(trim(p_notes), ''),
         ended_by = auth.uid()
   where id = v_membership.id;
end;
$$;

create or replace function public.assign_member_designation(
  p_member_id text,
  p_post_designation_id uuid,
  p_scope_level text,
  p_state_id uuid,
  p_zone_id uuid,
  p_district_id uuid,
  p_sub_district_id uuid,
  p_starts_on date
)
returns public.member_designation_appointments
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_appointment public.member_designation_appointments%rowtype;
begin
  if auth.uid() is null
    or not public.has_any_role(array['superadmin','state_admin','district_incharge']) then
    raise exception 'You are not authorized to assign designations.';
  end if;
  if not public.can_manage_org_scope(p_scope_level, p_state_id, p_zone_id, p_district_id)
    or not public.can_manage_member(p_member_id) then
    raise exception 'You cannot assign posts outside your authorized scope.';
  end if;
  if p_starts_on > current_date then
    raise exception 'Appointment start date cannot be in the future.';
  end if;
  insert into public.member_designation_appointments(
    member_id, post_designation_id, scope_level, state_id, zone_id, district_id,
    sub_district_id, starts_on, appointed_by
  ) values (
    p_member_id, p_post_designation_id, p_scope_level, p_state_id, p_zone_id,
    p_district_id, p_sub_district_id, p_starts_on, auth.uid()
  ) returning * into v_appointment;
  return v_appointment;
end;
$$;

create or replace function public.end_member_designation(
  p_appointment_id uuid,
  p_ends_on date,
  p_reason text,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_appointment public.member_designation_appointments%rowtype;
begin
  if auth.uid() is null
    or not public.has_any_role(array['superadmin','state_admin','district_incharge']) then
    raise exception 'You are not authorized to end designations.';
  end if;
  select * into v_appointment from public.member_designation_appointments
   where id = p_appointment_id and ends_on is null for update;
  if not found then
    raise exception 'This appointment is already ended or no longer exists.';
  end if;
  if not public.can_manage_org_scope(
      v_appointment.scope_level, v_appointment.state_id, v_appointment.zone_id, v_appointment.district_id
    )
    or not public.can_manage_member(v_appointment.member_id) then
    raise exception 'You cannot end appointments outside your authorized scope.';
  end if;
  if p_reason not in ('term_ended','resigned','replaced','other') then
    raise exception 'Select a valid appointment end reason.';
  end if;
  if p_ends_on < v_appointment.starts_on or p_ends_on > current_date then
    raise exception 'Appointment end date must be between its start date and today.';
  end if;
  update public.member_designation_appointments
     set ends_on = p_ends_on, end_reason = p_reason, end_notes = nullif(trim(p_notes), ''),
         ended_by = auth.uid()
   where id = v_appointment.id;
end;
$$;

-- Existing approved records become current members, using the best available
-- approval/join date. Pending and rejected applications remain unchanged.
insert into public.member_memberships(member_id, wing_id, starts_on, started_by)
select m.id, w.id, coalesce(m.approved_at::date, m.joined_at), m.approved_by
from public.members m
cross join public.org_wings w
where m.status = 'approved'
  and w.code = 'myl_cadre'
  and not exists (
    select 1 from public.member_memberships mm
    where mm.member_id = m.id and mm.ends_on is null
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
    coalesce(m.cadre_id, m.id),
    m.full_name,
    m.full_name_hi,
    case when exists (
      select 1 from public.member_memberships mm
      where mm.member_id = m.id
        and mm.membership_type = 'primary'
        and mm.starts_on <= current_date
        and (mm.ends_on is null or mm.ends_on >= current_date)
    ) then 'Primary Member' else 'Membership inactive' end,
    case when exists (
      select 1 from public.member_memberships mm
      where mm.member_id = m.id
        and mm.membership_type = 'primary'
        and mm.starts_on <= current_date
        and (mm.ends_on is null or mm.ends_on >= current_date)
    ) then 'प्राथमिक सदस्य' else 'सदस्यता निष्क्रिय' end,
    d.name_en,
    sd.name_en,
    w.code,
    m.status,
    m.verified,
    m.approved_at::date,
    m.joined_at
  from public.members m
  join public.districts d on d.id = m.district_id
  left join public.sub_districts sd on sd.id = m.sub_district_id and sd.district_id = m.district_id
  left join public.org_wings w on w.id = m.wing_id
  where upper(coalesce(m.cadre_id, m.id)) = upper(trim(p_cadre_id))
    and m.status = 'approved'
    and m.verified = true
    and exists (
      select 1 from public.member_memberships mm
      where mm.member_id = m.id
        and mm.membership_type = 'primary'
        and mm.starts_on <= current_date
        and (mm.ends_on is null or mm.ends_on >= current_date)
    )
  limit 1;
$$;
revoke all on function public.verify_public_cadre(text) from public;
grant execute on function public.verify_public_cadre(text) to anon, authenticated;

create table if not exists public.member_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade,
  notification_type text not null default 'membership_request'
    check (notification_type in ('membership_request')),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  unique (recipient_user_id, member_id, notification_type)
);
create index if not exists idx_member_notifications_unread
  on public.member_notifications(recipient_user_id, created_at desc)
  where read_at is null;

create or replace function public.notify_reviewers_of_membership_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> 'pending' then
    return new;
  end if;
  insert into public.member_notifications(recipient_user_id, member_id)
  select distinct up.user_id, new.id
  from public.user_profiles up
  join public.user_roles ur on ur.user_id = up.user_id
  join public.roles r on r.id = ur.role_id and r.is_active
  where up.is_active and up.allow_login
    and (
      (r.code in ('superadmin','state_admin'))
      or (r.code = 'district_incharge' and up.district_id = new.district_id)
    )
  on conflict (recipient_user_id, member_id, notification_type) do nothing;
  return new;
end;
$$;

drop trigger if exists notify_reviewers_of_membership_request on public.members;
create trigger notify_reviewers_of_membership_request
after insert on public.members
for each row when (new.status = 'pending')
execute function public.notify_reviewers_of_membership_request();

alter table public.member_notifications enable row level security;
create policy member_notifications_read_own on public.member_notifications
for select to authenticated using (recipient_user_id = auth.uid());
grant select on public.member_notifications to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.member_notifications;
    exception when duplicate_object then
      null;
    end;
  end if;
end;
$$;

create or replace function public.mark_member_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to update notifications.';
  end if;
  update public.member_notifications
     set read_at = coalesce(read_at, now())
   where id = p_notification_id
     and recipient_user_id = auth.uid();
  if not found then
    raise exception 'Notification not found or not accessible.';
  end if;
end;
$$;
grant select on public.member_memberships, public.member_designation_appointments to authenticated;

create table if not exists public.faq_content_revision (
  singleton boolean primary key default true check (singleton),
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
insert into public.faq_content_revision(singleton) values (true)
on conflict (singleton) do nothing;
alter table public.faq_content_revision enable row level security;
create policy faq_content_revision_read_public on public.faq_content_revision
for select to anon, authenticated using (singleton);
grant select on public.faq_content_revision to anon, authenticated;

create or replace function public.bump_faq_content_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.faq_content_revision
     set revision = revision + 1, updated_at = now()
   where singleton = true;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists bump_faq_revision_on_faq on public.myth_faqs;
create trigger bump_faq_revision_on_faq
after insert or update or delete on public.myth_faqs
for each row execute function public.bump_faq_content_revision();
drop trigger if exists bump_faq_revision_on_points on public.faq_talking_points;
create trigger bump_faq_revision_on_points
after insert or update or delete on public.faq_talking_points
for each row execute function public.bump_faq_content_revision();
drop trigger if exists bump_faq_revision_on_categories on public.faq_categories;
create trigger bump_faq_revision_on_categories
after insert or update or delete on public.faq_categories
for each row execute function public.bump_faq_content_revision();

revoke all on function public.can_manage_org_scope(text,uuid,uuid,uuid) from public;
revoke all on function public.can_manage_member(text) from public;
revoke all on function public.approve_member_request(text,text) from public;
revoke all on function public.reject_member_request(text) from public;
revoke all on function public.end_member_membership(uuid,date,text,text) from public;
revoke all on function public.assign_member_designation(text,uuid,text,uuid,uuid,uuid,uuid,date) from public;
revoke all on function public.end_member_designation(uuid,date,text,text) from public;
revoke all on function public.mark_member_notification_read(uuid) from public;
grant execute on function public.can_manage_org_scope(text,uuid,uuid,uuid) to authenticated;
grant execute on function public.can_manage_member(text) to authenticated;
grant execute on function public.approve_member_request(text,text) to authenticated;
grant execute on function public.reject_member_request(text) to authenticated;
grant execute on function public.end_member_membership(uuid,date,text,text) to authenticated;
grant execute on function public.assign_member_designation(text,uuid,text,uuid,uuid,uuid,uuid,date) to authenticated;
grant execute on function public.end_member_designation(uuid,date,text,text) to authenticated;
grant execute on function public.mark_member_notification_read(uuid) to authenticated;

commit;
