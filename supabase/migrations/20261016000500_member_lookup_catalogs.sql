-- Additional normalized member registration lookup values.
begin;
create table if not exists public.member_communities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_hi text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);
alter table public.member_communities enable row level security;
drop policy if exists member_communities_read_active on public.member_communities;
create policy member_communities_read_active on public.member_communities
  for select to anon, authenticated using (is_active);

insert into public.member_communities(code,name_en,name_hi,sort_order)
values
 ('muslim_minority','Muslim Minority','मुस्लिम अल्पसंख्यक',1),
 ('dalit_ambedkarite','Dalit / Ambedkarite Samaj','दलित / आंबेडकरवादी समाज',2),
 ('sikh_minority','Sikh Minority','सिख अल्पसंख्यक',3),
 ('christian_minority','Christian Minority','ईसाई अल्पसंख्यक',4),
 ('buddhist_minority','Buddhist Minority','बौद्ध अल्पसंख्यक',5),
 ('obc_backward_classes','OBC / Backward Classes','अन्य पिछड़ा वर्ग',6),
 ('general_cadre','General Cadre / Sarvasamaj','सामान्य कैडर / सर्वसमाज',7)
on conflict(code) do update set name_en=excluded.name_en,name_hi=excluded.name_hi,sort_order=excluded.sort_order;
commit;
