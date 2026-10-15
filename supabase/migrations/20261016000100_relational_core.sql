-- IM Youth Portal: normalized Supabase relational schema
-- Migration: 20261016000100_relational_core.sql
-- Geography is canonical reference data. Application forms must store IDs, not labels.
-- Apply to Supabase. This migration does not import browser localStorage data.

begin;

create extension if not exists pgcrypto;

-- Geography ------------------------------------------------------------------
create table if not exists public.states (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.zones (
  id uuid primary key default gen_random_uuid(),
  state_id uuid not null references public.states(id) on delete restrict,
  code text not null,
  name_en text not null,
  name_hi text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(state_id, code),
  unique(id, state_id)
);

create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  state_id uuid not null references public.states(id) on delete restrict,
  zone_id uuid,
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(id, state_id),
  foreign key(zone_id, state_id) references public.zones(id, state_id) on delete restrict
);

create table if not exists public.sub_districts (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id) on delete restrict,
  code text not null,
  name_en text not null,
  name_hi text,
  unit_type text not null default 'tehsil'
    check(unit_type in ('district_hq','tehsil','block','ward','campus','local_unit','other')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(district_id, code),
  unique(id, district_id)
);

create index if not exists idx_zones_state_active on public.zones(state_id, is_active, sort_order);
create index if not exists idx_districts_zone_active on public.districts(zone_id, is_active, name_en);
create index if not exists idx_sub_districts_district_active on public.sub_districts(district_id, is_active, name_en);

-- Roles and user profiles -----------------------------------------------------
-- Credentials/passwords must live in Supabase Auth, never in this schema.
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  description text,
  is_system_role boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  designation_id uuid,
  district_id uuid references public.districts(id) on delete set null,
  sub_district_id uuid,
  allow_login boolean not null default false,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key(sub_district_id, district_id)
    references public.sub_districts(id, district_id) deferrable initially immediate
);

create unique index if not exists uq_user_profiles_phone
  on public.user_profiles(phone) where phone is not null and phone <> '';
create index if not exists idx_user_profiles_district on public.user_profiles(district_id);

create table if not exists public.user_roles (
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  assigned_by uuid references public.user_profiles(user_id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key(user_id, role_id)
);

-- Organization reference catalogs --------------------------------------------
create table if not exists public.org_wings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  color text not null default 'emerald',
  focus_en text not null default '',
  focus_hi text not null default '',
  description_en text not null default '',
  description_hi text not null default '',
  head_leader_name text,
  badge_label text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_designations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title_en text not null,
  title_hi text not null,
  level text not null check(level in ('state','zonal','district','block','ward')),
  wing_id uuid references public.org_wings(id) on delete set null,
  description_en text not null default '',
  description_hi text not null default '',
  term_years integer check(term_years is null or term_years > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles drop constraint if exists user_profiles_designation_id_fkey;
alter table public.user_profiles add constraint user_profiles_designation_id_fkey
  foreign key(designation_id) references public.post_designations(id) on delete set null;

create table if not exists public.organizational_districts (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null unique references public.districts(id) on delete restrict,
  headquarters text,
  in_charge_name text,
  in_charge_phone text,
  active_cadre_count integer not null default 0 check(active_cadre_count >= 0),
  status text not null default 'forming' check(status in ('active','growing','forming')),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id text primary key,
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  full_name_hi text,
  phone text not null,
  email text,
  avatar_url text,
  state_id uuid not null references public.states(id) on delete restrict,
  district_id uuid not null references public.districts(id) on delete restrict,
  sub_district_id uuid,
  wing_id uuid references public.org_wings(id) on delete set null,
  designation_id uuid references public.post_designations(id) on delete set null,
  designation_text text,
  designation_hi text,
  community_background text,
  blood_group text,
  education text,
  bio text,
  status text not null default 'pending' check(status in ('pending','approved','rejected')),
  verified boolean not null default false,
  approved_by uuid references public.user_profiles(user_id) on delete set null,
  approved_at timestamptz,
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key(sub_district_id, district_id)
    references public.sub_districts(id, district_id) deferrable initially immediate
);
create index if not exists idx_members_status_created on public.members(status, created_at desc);
create index if not exists idx_members_district on public.members(district_id);
create index if not exists idx_members_subdistrict on public.members(sub_district_id);

create table if not exists public.leadership_tenures (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id) on delete restrict,
  leader_user_id uuid references public.user_profiles(user_id) on delete set null,
  leader_name_en text not null,
  leader_name_hi text,
  designation_id uuid references public.post_designations(id) on delete set null,
  post_title_en text not null,
  post_title_hi text,
  tenure_start date not null,
  tenure_end date,
  status text not null default 'current' check(status in ('current','past','acting')),
  contact_phone text,
  email text,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(tenure_end is null or tenure_end >= tenure_start)
);
create unique index if not exists uq_current_leadership_per_district_post
  on public.leadership_tenures(district_id, designation_id)
  where status='current' and designation_id is not null;
create table if not exists public.leadership_achievements (
  id uuid primary key default gen_random_uuid(),
  tenure_id uuid not null references public.leadership_tenures(id) on delete cascade,
  sort_order integer not null default 0,
  achievement_en text not null,
  achievement_hi text
);

-- Events ---------------------------------------------------------------------
create table if not exists public.event_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title_en text not null,
  title_hi text,
  description_en text not null default '',
  description_hi text,
  category_id uuid not null references public.event_categories(id) on delete restrict,
  event_date date not null,
  event_time time,
  timezone text not null default 'Asia/Kolkata',
  location_en text not null,
  location_hi text,
  state_id uuid not null references public.states(id) on delete restrict,
  district_id uuid not null references public.districts(id) on delete restrict,
  sub_district_id uuid,
  coordinator_name text not null,
  coordinator_phone text,
  coordinator_designation text,
  highlight_tag_en text,
  highlight_tag_hi text,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key(sub_district_id, district_id)
    references public.sub_districts(id, district_id) deferrable initially immediate
);
create index if not exists idx_events_public_date on public.events(is_published, event_date);
create index if not exists idx_events_district_date on public.events(district_id, event_date);

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  member_id text references public.members(id) on delete cascade,
  status text not null check(status in ('going','maybe')),
  created_at timestamptz not null default now(),
  check(user_id is not null or member_id is not null)
);
create unique index if not exists uq_event_rsvp_user on public.event_rsvps(event_id,user_id) where user_id is not null;
create unique index if not exists uq_event_rsvp_member on public.event_rsvps(event_id,member_id) where member_id is not null;

-- Admin-managed editorial and reference content --------------------------------
create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title_en text not null,
  title_hi text,
  excerpt_en text not null default '',
  excerpt_hi text,
  content_en text not null default '',
  content_hi text,
  category_id uuid not null references public.news_categories(id) on delete restrict,
  published_at timestamptz not null default now(),
  read_time_minutes integer not null default 3 check(read_time_minutes > 0),
  author_name_en text not null,
  author_name_hi text,
  author_role_en text not null,
  author_role_hi text,
  share_count integer not null default 0 check(share_count >= 0),
  is_published boolean not null default false,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.news_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
create table if not exists public.news_post_tags (
  news_post_id uuid not null references public.news_posts(id) on delete cascade,
  tag_id uuid not null references public.news_tags(id) on delete cascade,
  primary key(news_post_id,tag_id)
);

create table if not exists public.social_platforms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
create table if not exists public.social_broadcasts (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_hi text,
  content_en text not null,
  content_hi text,
  url text,
  shares_count integer not null default 0,
  clicks_count integer not null default 0,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.social_broadcast_platforms (
  broadcast_id uuid not null references public.social_broadcasts(id) on delete cascade,
  platform_id uuid not null references public.social_platforms(id) on delete restrict,
  primary key(broadcast_id,platform_id)
);
create table if not exists public.social_broadcast_hashtags (
  broadcast_id uuid not null references public.social_broadcasts(id) on delete cascade,
  hashtag text not null,
  primary key(broadcast_id,hashtag)
);

create table if not exists public.faq_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
create table if not exists public.myth_faqs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  category_id uuid not null references public.faq_categories(id) on delete restrict,
  myth_en text not null,
  myth_hi text,
  fact_en text not null,
  fact_hi text,
  detailed_explanation_en text not null default '',
  detailed_explanation_hi text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.faq_talking_points (
  id uuid primary key default gen_random_uuid(),
  faq_id uuid not null references public.myth_faqs(id) on delete cascade,
  language_code text not null check(language_code in ('en','hi')),
  sort_order integer not null default 0,
  talking_point text not null
);

create table if not exists public.parliamentary_houses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
create table if not exists public.parliamentary_leaders (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  name_en text not null,
  name_hi text,
  house_id uuid not null references public.parliamentary_houses(id) on delete restrict,
  constituency_en text not null default '',
  constituency_hi text,
  tenure_years text not null default '',
  citation_record text not null default '',
  photo_url text,
  is_sitting boolean not null default false,
  badge_label_en text,
  badge_label_hi text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.parliamentary_leader_roles (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.parliamentary_leaders(id) on delete cascade,
  language_code text not null check(language_code in ('en','hi')),
  sort_order integer not null default 0,
  role_text text not null
);
create table if not exists public.parliamentary_leader_contributions (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.parliamentary_leaders(id) on delete cascade,
  language_code text not null check(language_code in ('en','hi')),
  sort_order integer not null default 0,
  contribution_text text not null
);
create table if not exists public.ideology_comparisons (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title_en text not null,
  title_hi text,
  topic_en text not null,
  topic_hi text,
  our_stance_en text not null,
  our_stance_hi text,
  other_parties_en text not null default '',
  other_parties_hi text,
  coalition_history_en text not null default '',
  coalition_history_hi text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated-at trigger helper ---------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'districts','sub_districts','user_profiles','org_wings','post_designations',
    'organizational_districts','members','leadership_tenures','events','news_posts',
    'myth_faqs','parliamentary_leaders','ideology_comparisons'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I',t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',t);
  end loop;
end;
$$;

-- Initial reference rows cover districts currently seeded in the UI, not all UP.
insert into public.states(code,name_en,name_hi)
values('UP','Uttar Pradesh','उत्तर प्रदेश')
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi;

insert into public.zones(state_id,code,name_en,name_hi,sort_order)
select s.id,v.code,v.name_en,v.name_hi,v.sort_order
from public.states s
cross join (values
 ('western_up','Western UP','पश्चिमी उत्तर प्रदेश',1),
 ('rohilkhand','Rohilkhand','रोहिलखंड',2),
 ('awadh','Awadh','अवध',3),
 ('purvanchal','Purvanchal','पूर्वांचल',4),
 ('bundelkhand','Bundelkhand','बुंदेलखंड',5)
) v(code,name_en,name_hi,sort_order)
where s.code='UP'
on conflict(state_id,code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

insert into public.districts(state_id,zone_id,code,name_en,name_hi)
select s.id,z.id,v.code,v.name_en,v.name_hi
from public.states s
join (values
 ('moradabad','Moradabad','मुरादाबाद','rohilkhand'),
 ('sambhal','Sambhal','संभल','rohilkhand'),
 ('rampur','Rampur','रामपुर','rohilkhand'),
 ('bareilly','Bareilly','बरेली','rohilkhand'),
 ('meerut','Meerut','मेरठ','western_up'),
 ('aligarh','Aligarh','अलीगढ़','western_up'),
 ('saharanpur','Saharanpur','सहारनपुर','western_up'),
 ('muzaffarnagar','Muzaffarnagar','मुज़फ़्फ़रनगर','western_up'),
 ('lucknow','Lucknow','लखनऊ','awadh'),
 ('kanpur_nagar','Kanpur Nagar','कानपुर नगर','awadh'),
 ('agra','Agra','आगरा','western_up'),
 ('varanasi','Varanasi','वाराणसी','purvanchal')
) v(code,name_en,name_hi,zone_code) on true
join public.zones z on z.state_id=s.id and z.code=v.zone_code
where s.code='UP'
on conflict(code) do update set state_id=excluded.state_id,zone_id=excluded.zone_id,name_en=excluded.name_en,name_hi=excluded.name_hi;

insert into public.roles(code,name_en,name_hi,description,is_system_role,sort_order)
values
 ('superadmin','Super Admin','सुपर एडमिन','Full platform administration',true,1),
 ('state_president','State President','प्रदेश अध्यक्ष','State-level organizational management',true,2),
 ('content_manager','Content Manager','कंटेंट मैनेजर','Editorial and reference content management',true,3),
 ('press_release','Press Release / Media In-Charge','प्रेस रिलीज़ / मीडिया प्रभारी','Events and news publishing',true,4),
 ('state_admin','State Committee Admin','राज्य समिति एडमिन','State operations and member approvals',true,5),
 ('district_incharge','District In-Charge','ज़िला प्रभारी','District-level operations',true,6),
 ('cadre_volunteer','Cadre Volunteer','कार्यकर्ता','Approved volunteer access',true,7),
 ('public','Public Visitor','सार्वजनिक आगंतुक','Public browsing role',true,8)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,description=excluded.description,sort_order=excluded.sort_order;

insert into public.org_wings(code,name_en,name_hi,color,focus_en,focus_hi,description_en,description_hi,sort_order)
values
 ('myl_cadre','Muslim Youth League (MYL)','मुस्लिम यूथ लीग (MYL)','emerald','Youth organization','युवा संगठन','Core youth organization','मुख्य युवा संगठन',1),
 ('msf','Muslim Students Federation (MSF)','मुस्लिम स्टूडेंट्स फेडरेशन (MSF)','blue','Student affairs','छात्र मामले','Student wing','छात्र विंग',2),
 ('white_guard','White Guard (Seva Brigade)','व्हाइट गार्ड (सेवा ब्रिगेड)','emerald','Relief and service','राहत और सेवा','Humanitarian support','मानवीय सहायता',3),
 ('life_lift','Life Lift (Career Cell)','लाइफ लिफ्ट (करियर सेल)','blue','Career and skills','करियर और कौशल','Career guidance','करियर मार्गदर्शन',4),
 ('legal_cell','Legal Aid & RTI Cell','विधिक सहायता एवं RTI सेल','blue','Legal aid','विधिक सहायता','Legal support and RTI','विधिक सहायता और RTI',5),
 ('it_media','IT & Social Media Cell','आईटी एवं सोशल मीडिया सेल','stone','Digital communications','डिजिटल संचार','Technology and media','प्रौद्योगिकी और मीडिया',6),
 ('general','General Cadre','सामान्य कैडर','stone','General volunteering','सामान्य स्वयंसेवा','General membership','सामान्य सदस्यता',7)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

insert into public.event_categories(code,name_en,name_hi,sort_order)
values
 ('rally','Rally','रैली',1),('conference','Conference','सम्मेलन',2),
 ('campus_drive','Campus Drive','कैंपस अभियान',3),('career_conclave','Career Conclave','करियर सम्मेलन',4),
 ('relief_seva','Relief & Seva','राहत एवं सेवा',5)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

insert into public.news_categories(code,name_en,name_hi,sort_order)
values
 ('press_release','Press Release','प्रेस विज्ञप्ति',1),('ground_action','Ground Action','मैदानी कार्रवाई',2),
 ('statement','Statement','बयान',3),('campaign','Campaign','अभियान',4)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

insert into public.faq_categories(code,name_en,name_hi,sort_order)
values
 ('history','History','इतिहास',1),('ideology','Ideology','विचारधारा',2),('up_focus','UP Focus','उत्तर प्रदेश फोकस',3),
 ('secularism','Secularism','धर्मनिरपेक्षता',4),('wings','Wings','विंग्स',5)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

insert into public.social_platforms(code,name,sort_order)
values('whatsapp','WhatsApp',1),('telegram','Telegram',2),('twitter','X / Twitter',3),('facebook','Facebook',4),('instagram','Instagram',5)
on conflict(code) do update set name=excluded.name,sort_order=excluded.sort_order;

insert into public.parliamentary_houses(code,name_en,name_hi,sort_order)
values
 ('constituent_assembly','Constituent Assembly','संविधान सभा',1),('lok_sabha','Lok Sabha','लोकसभा',2),
 ('rajya_sabha','Rajya Sabha','राज्यसभा',3),('union_ministry','Union Ministry','केंद्रीय मंत्रालय',4),
 ('state_assembly','State Assembly','विधानसभा',5),('myl_national','MYL National','MYL राष्ट्रीय',6),
 ('myl_state_up','MYL Uttar Pradesh','MYL उत्तर प्रदेश',7)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;

commit();
