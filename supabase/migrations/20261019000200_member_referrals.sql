-- Capture optional cadre referrals on membership requests and validate them
-- against currently active, verified MYL membership records.
begin;

alter table public.members
  add column if not exists referred_by_cadre_id text;

alter table public.members
  drop constraint if exists members_referred_by_cadre_id_length;

alter table public.members
  add constraint members_referred_by_cadre_id_length
  check (referred_by_cadre_id is null or char_length(referred_by_cadre_id) <= 64);

create or replace function public.validate_member_referral()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.referred_by_cadre_id is null or btrim(new.referred_by_cadre_id) = '' then
    new.referred_by_cadre_id := null;
    return new;
  end if;

  new.referred_by_cadre_id := upper(btrim(new.referred_by_cadre_id));

  if not exists (
    select 1
    from public.members referrer
    join public.member_memberships membership
      on membership.member_id = referrer.id
    join public.org_wings wing
      on wing.id = membership.wing_id
    where upper(referrer.cadre_id) = new.referred_by_cadre_id
      and referrer.status = 'approved'
      and referrer.verified = true
      and wing.code = 'myl_cadre'
      and wing.is_active = true
      and membership.membership_type = 'primary'
      and membership.starts_on <= current_date
      and (membership.ends_on is null or membership.ends_on >= current_date)
      and regexp_replace(coalesce(referrer.phone, ''), '[^0-9]', '', 'g')
        <> regexp_replace(coalesce(new.phone, ''), '[^0-9]', '', 'g')
  ) then
    raise exception 'Referring cadre ID must belong to a different, currently active and verified MYL member.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_member_referral on public.members;
create trigger validate_member_referral
before insert or update of referred_by_cadre_id on public.members
for each row execute function public.validate_member_referral();

revoke all on function public.validate_member_referral() from public, anon, authenticated;

commit;
