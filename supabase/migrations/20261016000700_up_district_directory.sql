-- Seed the complete 75-district UP directory from the Government of UP district portal.
-- District-to-zone assignment is intentionally left as-is; the portal's districts are authoritative,
-- while the application's five zones are an organizational grouping rather than official divisions.
begin;

insert into public.districts(state_id,code,name_en,name_hi,zone_id,is_active,sort_order)
select s.id,v.code,v.name_en,v.name_hi,null,true,v.sort_order
from public.states s
cross join (values
 ('agra','Agra','आगरा',1),
 ('aligarh','Aligarh','अलीगढ़',2),
 ('ambedkar_nagar','Ambedkar Nagar','अम्बेडकरनगर',3),
 ('amethi','Amethi','अमेठी',4),
 ('amroha','Amroha','अमरोहा',5),
 ('auraiya','Auraiya','औरैया',6),
 ('ayodhya','Ayodhya','अयोध्या',7),
 ('azamgarh','Azamgarh','आजमगढ़',8),
 ('baghpat','Baghpat','बागपत',9),
 ('bahraich','Bahraich','बहराइच',10),
 ('ballia','Ballia','बलिया',11),
 ('balrampur','Balrampur','बलरामपुर',12),
 ('banda','Banda','बाँदा',13),
 ('barabanki','Barabanki','बाराबंकी',14),
 ('bareilly','Bareilly','बरेली',15),
 ('basti','Basti','बस्ती',16),
 ('bhadohi','Bhadohi','भदोही',17),
 ('bijnor','Bijnor','बिजनौर',18),
 ('budaun','Budaun','बदायूँ',19),
 ('bulandshahr','Bulandshahr','बुलन्दशहर',20),
 ('chandauli','Chandauli','चन्दौली',21),
 ('chitrakoot','Chitrakoot','चित्रकूट',22),
 ('deoria','Deoria','देवरिया',23),
 ('etah','Etah','एटा',24),
 ('etawah','Etawah','इटावा',25),
 ('farrukhabad','Farrukhabad','फर्रुखाबाद',26),
 ('fatehpur','Fatehpur','फतेहपुर',27),
 ('firozabad','Firozabad','फिरोजाबाद',28),
 ('gautam_buddha_nagar','Gautam Buddha Nagar','गौतमबुद्ध नगर',29),
 ('ghaziabad','Ghaziabad','गाजियाबाद',30),
 ('ghazipur','Ghazipur','गाज़ीपुर',31),
 ('gonda','Gonda','गोण्डा',32),
 ('gorakhpur','Gorakhpur','गोरखपुर',33),
 ('hamirpur','Hamirpur','हमीरपुर',34),
 ('hapur','Hapur','हापुड़',35),
 ('hardoi','Hardoi','हरदोई',36),
 ('hathras','Hathras','हाथरस',37),
 ('jalaun','Jalaun','जालौन',38),
 ('jaunpur','Jaunpur','जौनपुर',39),
 ('jhansi','Jhansi','झाँसी',40),
 ('kannauj','Kannauj','कन्नौज',41),
 ('kanpur_dehat','Kanpur Dehat','कानपुर देहात',42),
 ('kanpur_nagar','Kanpur Nagar','कानपुर नगर',43),
 ('kasganj','Kasganj','कासगंज',44),
 ('kaushambi','Kaushambi','कौशाम्बी',45),
 ('kushinagar','Kushinagar','कुशीनगर',46),
 ('lakhimpur_kheri','Lakhimpur Kheri','लखीमपुर खीरी',47),
 ('lalitpur','Lalitpur','ललितपुर',48),
 ('lucknow','Lucknow','लखनऊ',49),
 ('maharajganj','Maharajganj','महराजगंज',50),
 ('mahoba','Mahoba','महोबा',51),
 ('mainpuri','Mainpuri','मैनपुरी',52),
 ('mathura','Mathura','मथुरा',53),
 ('mau','Mau','मऊ',54),
 ('meerut','Meerut','मेरठ',55),
 ('mirzapur','Mirzapur','मीरजापुर',56),
 ('moradabad','Moradabad','मुरादाबाद',57),
 ('muzaffarnagar','Muzaffarnagar','मुज़फ़्फ़रनगर',58),
 ('pilibhit','Pilibhit','पीलीभीत',59),
 ('pratapgarh','Pratapgarh','प्रतापगढ़',60),
 ('prayagraj','Prayagraj','प्रयागराज',61),
 ('raebareli','Raebareli','रायबरेली',62),
 ('rampur','Rampur','रामपुर',63),
 ('saharanpur','Saharanpur','सहारनपुर',64),
 ('sambhal','Sambhal','सम्भल',65),
 ('sant_kabir_nagar','Sant Kabir Nagar','संत कबीर नगर',66),
 ('sitapur','Sitapur','सीतापुर',67),
 ('shahjahanpur','Shahjahanpur','शाहजहाँपुर',68),
 ('shamli','Shamli','शामली',69),
 ('shravasti','Shravasti','श्रावस्ती',70),
 ('siddharthnagar','Siddharthnagar','सिद्धार्थनगर',71),
 ('sonbhadra','Sonbhadra','सोनभद्र',72),
 ('sultanpur','Sultanpur','सुलतानपुर',73),
 ('unnao','Unnao','उन्नाव',74),
 ('varanasi','Varanasi','वाराणसी',75)
) as v(code,name_en,name_hi,sort_order)
where s.code='UP'
on conflict(code) do update
set state_id=excluded.state_id,
    name_en=excluded.name_en,
    name_hi=excluded.name_hi,
    is_active=true,
    sort_order=excluded.sort_order;

-- Ensure a selectable, explicitly generic local unit exists for each district.
-- These are not official tehsil/block names; replace them with verified records.
insert into public.sub_districts(district_id,code,name_en,name_hi,unit_type,is_active,sort_order)
select d.id,'district_hq','District HQ / Local Unit','ज़िला मुख्यालय / स्थानीय इकाई','local_unit',true,0
from public.districts d
join public.states s on s.id=d.state_id
where s.code='UP'
on conflict(district_id,code) do update
set name_en=excluded.name_en,name_hi=excluded.name_hi,unit_type=excluded.unit_type,is_active=true;

commit;
