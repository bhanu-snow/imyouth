-- Idempotent seed for the existing bilingual MYL / IUML FAQ content.
-- Run in Supabase SQL Editor AFTER migrations 00100–00800.
-- Safe to rerun: FAQ rows upsert by legacy_id and talking points are replaced for seeded FAQs.
BEGIN;

INSERT INTO public.faq_categories (code,name_en,name_hi,is_active,sort_order) VALUES
  ('history', '1948 History', '1948 का इतिहास', true, 1),
  ('ideology', 'Ideology & Social Justice', 'विचारधारा व सामाजिक न्याय', true, 2),
  ('up_focus', 'UP Relevance', 'उत्तर प्रदेश में भूमिका', true, 3),
  ('secularism', 'Secularism & Constitution', 'धर्मनिरपेक्षता व संविधान', true, 4),
  ('wings', 'MYL / MSF Wings', 'MYL / MSF संगठन', true, 5)
ON CONFLICT (code) DO UPDATE SET name_en=excluded.name_en,name_hi=excluded.name_hi,is_active=true,sort_order=excluded.sort_order;

INSERT INTO public.myth_faqs (legacy_id,category_id,myth_en,myth_hi,fact_en,fact_hi,detailed_explanation_en,detailed_explanation_hi,is_published,sort_order)
VALUES ('myth-1', (SELECT id FROM public.faq_categories WHERE code='history'), 'Is the Indian Union Muslim League (IUML) the same political league from pre-partition 1947?', 'क्या इंडियन यूनियन मुस्लिम लीग (IUML) वही पार्टी है जो 1947 के बंटवारे से पहले थी?', 'FALSE. IUML was founded in sovereign independent India on 10 March 1948 in Madras (Chennai) by Quaid-e-Millath Muhammad Ismail Sahib, with complete devotion to India’s Constitution and secular unity.', 'पूर्णतः असत्य व भ्रामक। IUML का गठन आज़ाद भारत में 10 मार्च 1948 को मद्रास (चेन्नई) में क़ायदे-मिल्लत मुहम्मद इस्माइल साहब द्वारा किया गया था, जिन्होंने स्वतंत्र भारत के संविधान और धर्मनिरपेक्ष एकता की शपथ ली थी।', 'The pre-partition All-India Muslim League ceased to exist after August 1947. Indian nationalist Muslim leaders, led by Quaid-e-Millath Muhammad Ismail (a distinguished member of India''s Constituent Assembly that drafted our Constitution), convened on 10 March 1948 in Madras to form the Indian Union Muslim League. Its core constitutional oath was to preserve the unity, integrity, secular ethos, and democratic fabric of the Republic of India while safeguarding the constitutional rights of minorities and backward classes.', '1947 में विभाजन के पश्चात पुरानी संस्था समाप्त हो गई थी। भारत के राष्ट्रवादी मुस्लिम नेताओं, विशेषकर क़ायदे-मिल्लत मुहम्मद इस्माइल (जो भारत के संविधान का निर्माण करने वाली संविधान सभा के निर्वाचित सदस्य थे), ने 10 मार्च 1948 को मद्रास में बैठक कर शुद्ध रूप से भारतीय राजनीतिक दल के रूप में "इंडियन यूनियन मुस्लिम लीग" की स्थापना की। इसका पहला संकल्प भारत के संविधान, संप्रभुता और धर्मनिरपेक्ष लोकतंत्र के प्रति पूर्ण निष्ठा था।', true, 1)
ON CONFLICT (legacy_id) DO UPDATE SET category_id=excluded.category_id,myth_en=excluded.myth_en,myth_hi=excluded.myth_hi,fact_en=excluded.fact_en,fact_hi=excluded.fact_hi,detailed_explanation_en=excluded.detailed_explanation_en,detailed_explanation_hi=excluded.detailed_explanation_hi,is_published=true,sort_order=excluded.sort_order,updated_at=now();

INSERT INTO public.myth_faqs (legacy_id,category_id,myth_en,myth_hi,fact_en,fact_hi,detailed_explanation_en,detailed_explanation_hi,is_published,sort_order)
VALUES ('myth-2', (SELECT id FROM public.faq_categories WHERE code='up_focus'), 'Why is Muslim Youth League (MYL) & IUML needed in Uttar Pradesh? Is it not only a southern party?', 'उत्तर प्रदेश में मुस्लिम यूथ लीग (MYL) और IUML की क्या आवश्यकता है? क्या यह केवल दक्षिण भारत का दल नहीं है?', 'IUML is an Election Commission recognized national political party. Uttar Pradesh’s youth urgently need constructive, educated, and non-opportunistic democratic leadership focused on education, jobs, and legal rights.', 'IUML भारत निर्वाचन आयोग द्वारा पंजीकृत राष्ट्रीय स्तर का राजनीतिक दल है। उत्तर प्रदेश के युवाओं को अवसरवादी राजनीति से हटकर तालीम, रोजगार, विधिक अधिकारों और संवैधानिक संरक्षण पर केंद्रित संजीदा नेतृत्व की आवश्यकता है।', 'For decades, minority and marginalized youth in Uttar Pradesh have been treated as mere voting banks by regional parties, while UP districts (Moradabad, Sambhal, Rampur, Aligarh, Meerut, Lucknow, Varanasi, Azamgarh) continue to suffer from educational dropouts, lack of coaching facilities, unemployment, and police harassment. MYL in UP, led by leaders like advocate Sarfaraz Ahmed (National President), is building clean, educated cadre networks that run career counseling ("Life Lift"), competitive exam guidance, legal aid helplines, and inter-community peace building.', 'उत्तर प्रदेश में दशकों से अल्पसंख्यकों, दलितों और पिछड़े वर्ग के युवाओं को केवल चुनावी मोहरे के रूप में इस्तेमाल किया गया, जबकि शिक्षा, रोजगार और बुनियादी अधिकारों पर कोई ठोस काम नहीं हुआ। मुस्लिम यूथ लीग (MYL) यूपी में युवाओं के लिए "लाइफ लिफ्ट" (Life Lift) करियर मार्गदर्शन, प्रतियोगी परीक्षाओं की तैयारी, कानूनी सहायता और ज़मीनी विकास के माध्यम से एक नया, सकारात्मक व शिक्षित राजनीतिक विकल्प दे रही है।', true, 2)
ON CONFLICT (legacy_id) DO UPDATE SET category_id=excluded.category_id,myth_en=excluded.myth_en,myth_hi=excluded.myth_hi,fact_en=excluded.fact_en,fact_hi=excluded.fact_hi,detailed_explanation_en=excluded.detailed_explanation_en,detailed_explanation_hi=excluded.detailed_explanation_hi,is_published=true,sort_order=excluded.sort_order,updated_at=now();

INSERT INTO public.myth_faqs (legacy_id,category_id,myth_en,myth_hi,fact_en,fact_hi,detailed_explanation_en,detailed_explanation_hi,is_published,sort_order)
VALUES ('myth-3', (SELECT id FROM public.faq_categories WHERE code='ideology'), 'Does Muslim Youth League (MYL) stand only for Muslims, or for all marginalized communities?', 'क्या मुस्लिम यूथ लीग (MYL) केवल एक समुदाय की बात करती है या सभी वंचित वर्गों के साथ है?', 'MYL and IUML stand firmly for communal amity, backward classes (OBCs), Dalits, minorities, and every oppressed citizen under Dr. Ambedkar’s constitutional framework.', 'MYL और IUML बाबासाहेब डॉ. आंबेडकर के संवैधानिक सिद्धांतों के अनुसार सामाजिक न्याय, पिछड़े वर्गों (OBC), दलितों, अल्पसंख्यकों और हर पीड़ित नागरिक के अधिकारों के लिए खड़ी है।', 'In Kerala and Tamil Nadu, IUML has a stellar record of running ministries that served all communities equally. Schools, engineering colleges, universities, and hospitals built under IUML leadership educate millions of students regardless of religion or caste. Panakkad Syed Shihab Thangal was revered across southern India as a beacon of communal harmony, regularly visiting temples, churches, and mosques to mediate peace. In UP, MYL works shoulder-to-shoulder with Dalit and backward class youth groups on students'' and workers'' issues.', 'केरल में मुस्लिम लीग के नेतृत्व में शिक्षा, स्वास्थ्य और उद्योग विभागों ने बिना किसी धार्मिक भेदभाव के पूरे समाज की सेवा की है। पाणाक्काड सैयद मुहम्मद अली शिहाब थंगल को केरल में सर्वधर्म सद्भाव का प्रतीक माना जाता है। उत्तर प्रदेश में भी MYL दलित, पिछड़े और सभी कमजोर तबकों के युवाओं के साथ मिलकर कैंपस व जनहित के मुद्दों पर संघर्ष कर रही है।', true, 3)
ON CONFLICT (legacy_id) DO UPDATE SET category_id=excluded.category_id,myth_en=excluded.myth_en,myth_hi=excluded.myth_hi,fact_en=excluded.fact_en,fact_hi=excluded.fact_hi,detailed_explanation_en=excluded.detailed_explanation_en,detailed_explanation_hi=excluded.detailed_explanation_hi,is_published=true,sort_order=excluded.sort_order,updated_at=now();

INSERT INTO public.myth_faqs (legacy_id,category_id,myth_en,myth_hi,fact_en,fact_hi,detailed_explanation_en,detailed_explanation_hi,is_published,sort_order)
VALUES ('myth-4', (SELECT id FROM public.faq_categories WHERE code='wings'), 'What is the relationship between IUML, Muslim Youth League (MYL), MSF, and the White Guard?', 'IUML, मुस्लिम यूथ लीग (MYL), MSF और व्हाइट गार्ड में क्या संबंध है?', 'They represent a unified democratic family: IUML is the mother political party, MYL is the dynamic youth vanguard (formed 1973), MSF is the student federation, and White Guard is the humanitarian seva corps.', 'यह एक सुव्यवस्थित लोकतांत्रिक संगठन है: IUML मातृ राजनीतिक दल है, मुस्लिम यूथ लीग (MYL) युवा शक्ति का संगठन है (स्थापना 1973), MSF छात्र मोर्चा है और व्हाइट गार्ड सेवा व आपदा प्रबंधन विंग है।', 'Each wing plays a dedicated, non-overlapping role: 
1. **IUML**: Parliamentary political party fighting for legislative representation and policy rights.
2. **MYL (Muslim Youth League)**: Mobilizes youth between 18-35 for civic leadership, employment, anti-drug awareness, and ground campaigns.
3. **MSF (Muslim Students Federation)**: Represents university and college students (AMU, Lucknow Univ, degree colleges) on scholarships, campus democracy, and fair exams.
4. **White Guard**: Uniformed, disciplined volunteer seva force deployed for flood relief, medical emergencies, food drives, and peaceful crowd management.
5. **Life Lift**: Dedicated youth wing program for skill training, career counseling, and UPSC/civil service mentorship in UP.', 'हर विंग का अपना निश्चित और ज़िम्मेदार कार्यक्षेत्र है: 
1. **IUML**: संसदीय व चुनावी राजनीति में जनता के संवैधानिक अधिकारों की पैरवी करने वाला मुख्य दल।
2. **मुस्लिम यूथ लीग (MYL)**: 18 से 35 वर्ष के युवाओं को सामाजिक, राजनीतिक और नेतृत्व के क्षेत्र में प्रशिक्षित करने वाला संगठन।
3. **MSF (मुस्लिम स्टूडेंट्स फेडरेशन)**: कॉलेज और विश्वविद्यालय स्तर पर छात्रों के अधिकारों, फीस, हॉस्टल और छात्रवृत्ति के लिए लड़ने वाला छात्र मोर्चा।
4. **व्हाइट गार्ड (White Guard)**: बाढ़, आपदा, रक्तदान और सामाजिक सेवा के लिए समर्पित अनुशासित स्वयंसेवक दस्ता।
5. **लाइफ लिफ्ट (Life Lift)**: उत्तर प्रदेश के युवाओं को प्रतियोगी परीक्षाओं, सिविल सेवा और रोजगार कौशल से जोड़ने वाला विशेष उपक्रम।', true, 4)
ON CONFLICT (legacy_id) DO UPDATE SET category_id=excluded.category_id,myth_en=excluded.myth_en,myth_hi=excluded.myth_hi,fact_en=excluded.fact_en,fact_hi=excluded.fact_hi,detailed_explanation_en=excluded.detailed_explanation_en,detailed_explanation_hi=excluded.detailed_explanation_hi,is_published=true,sort_order=excluded.sort_order,updated_at=now();

INSERT INTO public.myth_faqs (legacy_id,category_id,myth_en,myth_hi,fact_en,fact_hi,detailed_explanation_en,detailed_explanation_hi,is_published,sort_order)
VALUES ('myth-5', (SELECT id FROM public.faq_categories WHERE code='secularism'), 'How does MYL practice Secularism when its name contains the word "Muslim"?', 'जब नाम में "मुस्लिम" शब्द है, तो MYL धर्मनिरपेक्षता (Secularism) पर कैसे अमल करती है?', 'Secularism in India guarantees the right of marginalized groups to organize democratically within the Constitution. The party has defended the Indian Constitution’s basic structure against all forms of extremism.', 'भारत का संविधान प्रत्येक नागरिक और अल्पसंख्यक समुदाय को अपने अधिकारों के लिए लोकतांत्रिक व शांतिपूर्ण संगठन बनाने का मौलिक अधिकार देता है। IUML ने हमेशा संविधान की प्रस्तावना और धर्मनिरपेक्षता की रक्षा की है।', 'Just as Akali Dal represents Sikh identity in Punjab or Christian Democratic parties operate across Europe''s mature democracies, IUML openly, transparently, and constitutionally represents minority aspirations without deception. Crucially, IUML has NEVER advocated separatism, hate speech, or extra-constitutional extremism. In the turbulent aftermath of December 1992, late Panakkad Thangal famously gave strict orders: "Not a single stone must be thrown in Kerala or elsewhere; peace and secular brotherhood are our absolute duty." This statesmanship saved countless lives and remains our guiding compass.', 'जैसे पंजाब में अकाली दल सिख पहचान का लोकतांत्रिक प्रतिनिधित्व करता है या यूरोप में क्रिश्चियन डेमोक्रेटिक पार्टियां लोकतंत्र में भाग लेती हैं, वैसे ही IUML पारदर्शी, संवैधानिक और लोकतांत्रिक तरीके से अल्पसंख्यकों के अधिकारों की बात करती है। लीग ने हमेशा हर तरह के उग्रवाद और नफरत का डटकर विरोध किया है। 1992 में जब पूरे उत्तर भारत में तनाव था, तब पाणाक्काड थंगल साहब का सख्त निर्देश था कि "शांति और भाईचारा किसी भी कीमत पर टूटना नहीं चाहिए।"', true, 5)
ON CONFLICT (legacy_id) DO UPDATE SET category_id=excluded.category_id,myth_en=excluded.myth_en,myth_hi=excluded.myth_hi,fact_en=excluded.fact_en,fact_hi=excluded.fact_hi,detailed_explanation_en=excluded.detailed_explanation_en,detailed_explanation_hi=excluded.detailed_explanation_hi,is_published=true,sort_order=excluded.sort_order,updated_at=now();

DELETE FROM public.faq_talking_points p USING public.myth_faqs f WHERE p.faq_id=f.id AND f.legacy_id IN ('myth-1', 'myth-2', 'myth-3', 'myth-4', 'myth-5');

INSERT INTO public.faq_talking_points (faq_id,language_code,sort_order,talking_point)
SELECT f.id, 'en', v.sort_order, v.talking_point
FROM (VALUES
  ('myth-1', 1, 'Founder Quaid-e-Millath Muhammad Ismail was a member of the Constituent Assembly of India and worked alongside Dr. B.R. Ambedkar and Jawaharlal Nehru.'),
  ('myth-1', 2, 'IUML members took oaths on the Constitution of India from Day 1 and have represented Indian citizens in the Lok Sabha continuously since 1952.'),
  ('myth-1', 3, 'The party has served in progressive democratic coalitions and contributed to national governance with exemplary integrity.'),
  ('myth-2', 1, 'MYL National President Sarfaraz Ahmed is an advocate from Uttar Pradesh, actively championing UP youth rights at the national level.'),
  ('myth-2', 2, 'MYL focuses on education-first: career counseling, scholarship assistance, and computer training.'),
  ('myth-2', 3, 'We stand for clean, constitutional, non-violent politics without hollow rhetoric.'),
  ('myth-3', 1, 'IUML’s motto is "Brotherhood, Justice, and National Integration".'),
  ('myth-3', 2, 'We run disaster relief and social welfare for people of all faiths through our White Guard volunteer brigade.'),
  ('myth-3', 3, 'Educational institutions established under League leadership welcome students of all faiths.'),
  ('myth-4', 1, 'MYL bridges students from MSF into mature, ethical political leaders.'),
  ('myth-4', 2, 'The White Guard maintains discipline, peace, and humanitarian rescue during crises.'),
  ('myth-4', 3, 'Life Lift gives practical careers and employment direction to rural UP students.'),
  ('myth-5', 1, 'Our constitution explicitly mandates commitment to socialism, secularism, and democracy.'),
  ('myth-5', 2, 'We reject all underground and extremist fringe groups; democratic parliamentary action is our only path.'),
  ('myth-5', 3, 'We believe strong minorities make a stronger, more united, and resilient India.')
) AS v(legacy_id, sort_order, talking_point)
JOIN public.myth_faqs f ON f.legacy_id=v.legacy_id;

INSERT INTO public.faq_talking_points (faq_id,language_code,sort_order,talking_point)
SELECT f.id, 'hi', v.sort_order, v.talking_point
FROM (VALUES
  ('myth-1', 1, 'संस्थापक क़ायदे-मिल्लत मुहम्मद इस्माइल भारतीय संविधान सभा के सम्मानित सदस्य थे और उन्होंने बाबासाहेब डॉ. भीमराव आंबेडकर के साथ संविधान निर्माण में भाग लिया।'),
  ('myth-1', 2, '1952 के पहले आम चुनाव से लेकर आज तक IUML लगातार भारतीय संसद (लोकसभा व राज्यसभा) में संवैधानिक लोकतांत्रिक आवाज़ रही है।'),
  ('myth-1', 3, 'IUML ने कभी विभाजनकारी राजनीति का समर्थन नहीं किया; केरल और अन्य राज्यों में हिंदू, मुस्लिम, ईसाई समरसता का आदर्श उदाहरण प्रस्तुत किया।'),
  ('myth-2', 1, 'MYL के राष्ट्रीय अध्यक्ष सरफ़राज़ अहमद स्वयं उत्तर प्रदेश के एक प्रतिष्ठित अधिवक्ता व युवा नेता हैं, जो यूपी के युवाओं की आवाज़ राष्ट्रीय स्तर पर उठा रहे हैं।'),
  ('myth-2', 2, 'हमारा मुख्य फोकस "तालीम और तरक्की" है—युवाओं को कोचिंग, छात्रवृत्ति और कौशल विकास से जोड़ना।'),
  ('myth-2', 3, 'हम नफरत की राजनीति के बजाय संविधान के दायरे में रहकर न्याय और शांति की राजनीति करते हैं।'),
  ('myth-3', 1, 'मुस्लिम लीग का मूल मंत्र है: "भाईचारा, न्याय और राष्ट्रीय एकता"।'),
  ('myth-3', 2, 'व्हाइट गार्ड (White Guard) आपदा राहत और सेवा दल बिना धर्म देखे हर ज़रूरतमंद की मदद करता है।'),
  ('myth-3', 3, 'हमारे शिक्षण संस्थानों में हिंदू, मुस्लिम, सिख, ईसाई सभी वर्गों के छात्र एक साथ पढ़ते हैं।'),
  ('myth-4', 1, 'MSF छात्रों को कैंपस में नेतृत्व सिखाती है और MYL उन्हें परिपक्व सामाजिक-राजनीतिक नेतृत्व में बदलती है।'),
  ('myth-4', 2, 'व्हाइट गार्ड सेवा, शांति और अनुशासन की प्रतीक है।'),
  ('myth-4', 3, 'लाइफ लिफ्ट कार्यक्रम के माध्यम से UP के छोटे शहरों व गांवों के युवाओं को मुफ्त करियर गाइडेंस मिलती है।'),
  ('myth-5', 1, 'पार्टी का संविधान स्पष्ट रूप से धर्मनिरपेक्षता, समाजवाद और लोकतंत्र के प्रति प्रतिबद्ध है।'),
  ('myth-5', 2, 'लीग ने हमेशा किसी भी भड़काऊ या असंवैधानिक विचार का मुखर विरोध किया है; संसद और न्यायपालिका ही हमारा रास्ता है।'),
  ('myth-5', 3, 'हमारा मानना है कि जब अल्पसंख्यक और कमजोर वर्ग शिक्षित और सशक्त होंगे, तभी भारत एक महान शक्ति बनेगा।')
) AS v(legacy_id, sort_order, talking_point)
JOIN public.myth_faqs f ON f.legacy_id=v.legacy_id;

COMMIT;


-- Events and news seed. Run after the FAQ seed above; safe to rerun.
BEGIN;

INSERT INTO public.events (legacy_id,title_en,title_hi,description_en,description_hi,category_id,event_date,event_time,location_en,location_hi,state_id,district_id,coordinator_name,coordinator_phone,coordinator_designation,highlight_tag_en,highlight_tag_hi,is_published)
SELECT 'ev-up-1','State Youth Conference & "Life Lift" Career Conclave 2026','राज्य युवा सम्मेलन एवं "लाइफ लिफ्ट" करियर महासम्मेलन 2026','A statewide gathering organized by Muslim Youth League UP bringing together 5,000+ students and youth. Free guidance on UPSC, UPPSC, judicial services, digital skills, and central minority scholarships.','मुस्लिम यूथ लीग उत्तर प्रदेश द्वारा आयोजित भव्य राज्य युवा सम्मेलन। 5,000+ युवाओं को यूपीएससी, यूपीपीएससी, न्यायिक सेवा, डिजिटल कौशल और छात्रवृत्ति पर विशेषज्ञ मार्गदर्शन।',c.id,'2026-11-08'::date,'10:30:00'::time,'Rifa-e-Aam Club Grounds, Lucknow','रिफ़ा-ए-आम क्लब मैदान, लखनऊ',s.id,d.id,'Adv. Sarfaraz Ahmed & Team','+91 98370 00112','National President (MYL)','Life Lift Conclave','लाइफ लिफ्ट करियर सम्मलेन',true
FROM public.event_categories c
JOIN public.states s ON lower(s.name_en)='uttar pradesh'
JOIN public.districts d ON d.state_id=s.id AND d.code='lucknow'
WHERE c.code='career_conclave'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,description_en=excluded.description_en,description_hi=excluded.description_hi,category_id=excluded.category_id,event_date=excluded.event_date,event_time=excluded.event_time,location_en=excluded.location_en,location_hi=excluded.location_hi,state_id=excluded.state_id,district_id=excluded.district_id,coordinator_name=excluded.coordinator_name,coordinator_phone=excluded.coordinator_phone,coordinator_designation=excluded.coordinator_designation,highlight_tag_en=excluded.highlight_tag_en,highlight_tag_hi=excluded.highlight_tag_hi,is_published=true,updated_at=now();

INSERT INTO public.events (legacy_id,title_en,title_hi,description_en,description_hi,category_id,event_date,event_time,location_en,location_hi,state_id,district_id,coordinator_name,coordinator_phone,coordinator_designation,highlight_tag_en,highlight_tag_hi,is_published)
SELECT 'ev-up-2','MSF State Students Charter & Campus Scholarship March','MSF राज्य छात्र अधिकार सभा एवं छात्रवृत्ति पदयात्रा','Muslim Students Federation (MSF) mobilization demanding timely disbursal of post-matric educational scholarships, subsidized hostel accommodations, and transparent university examinations.','मुस्लिम स्टूडेंट्स फेडरेशन (MSF) द्वारा पोस्ट-मैट्रिक छात्रवृत्ति के समयबद्ध भुगतान, किफायती हॉस्टल और पारदर्शी विश्वविद्यालय परीक्षाओं की मांग को लेकर छात्र सभा।',c.id,'2026-11-18'::date,'11:00:00'::time,'Town Hall Grounds, Sambhal','टाउन हॉल मैदान, संभल',s.id,d.id,'Tariq Anwar','+91 94123 44556','District MSF In-Charge','Student Rights','छात्र अधिकार',true
FROM public.event_categories c
JOIN public.states s ON lower(s.name_en)='uttar pradesh'
JOIN public.districts d ON d.state_id=s.id AND d.code='sambhal'
WHERE c.code='campus_drive'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,description_en=excluded.description_en,description_hi=excluded.description_hi,category_id=excluded.category_id,event_date=excluded.event_date,event_time=excluded.event_time,location_en=excluded.location_en,location_hi=excluded.location_hi,state_id=excluded.state_id,district_id=excluded.district_id,coordinator_name=excluded.coordinator_name,coordinator_phone=excluded.coordinator_phone,coordinator_designation=excluded.coordinator_designation,highlight_tag_en=excluded.highlight_tag_en,highlight_tag_hi=excluded.highlight_tag_hi,is_published=true,updated_at=now();

INSERT INTO public.events (legacy_id,title_en,title_hi,description_en,description_hi,category_id,event_date,event_time,location_en,location_hi,state_id,district_id,coordinator_name,coordinator_phone,coordinator_designation,highlight_tag_en,highlight_tag_hi,is_published)
SELECT 'ev-up-3','White Guard Winter Blanket & Medical Seva Camp','व्हाइट गार्ड शीतकालीन कंबल वितरण एवं स्वास्थ्य सेवा शिविर','Humanitarian community relief drive by White Guard volunteers providing free doctor consultations, essential medicines, and blankets to destitute families of all communities.','व्हाइट गार्ड स्वयंसेवकों द्वारा सभी समुदायों के जरूरतमंद परिवारों हेतु निःशुल्क स्वास्थ्य जांच, दवाएं और शीतकालीन कंबल वितरण शिविर।',c.id,'2026-11-25'::date,'09:30:00'::time,'Community Health Centre Compound, Moradabad','सामुदायिक केंद्र परिसर, मुरादाबाद',s.id,d.id,'Dr. Imran Qureshi','+91 98399 22334','White Guard Seva In-Charge','Seva & Relief','सेवा एवं राहत',true
FROM public.event_categories c
JOIN public.states s ON lower(s.name_en)='uttar pradesh'
JOIN public.districts d ON d.state_id=s.id AND d.code='moradabad'
WHERE c.code='relief_seva'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,description_en=excluded.description_en,description_hi=excluded.description_hi,category_id=excluded.category_id,event_date=excluded.event_date,event_time=excluded.event_time,location_en=excluded.location_en,location_hi=excluded.location_hi,state_id=excluded.state_id,district_id=excluded.district_id,coordinator_name=excluded.coordinator_name,coordinator_phone=excluded.coordinator_phone,coordinator_designation=excluded.coordinator_designation,highlight_tag_en=excluded.highlight_tag_en,highlight_tag_hi=excluded.highlight_tag_hi,is_published=true,updated_at=now();

INSERT INTO public.news_posts (legacy_id,title_en,title_hi,excerpt_en,excerpt_hi,content_en,content_hi,category_id,published_at,read_time_minutes,author_name_en,author_name_hi,author_role_en,author_role_hi,share_count,is_published)
SELECT 'news-up-1','Muslim Youth League UP Ratifies 10-Point "Youth & Education Resolution" for Uttar Pradesh','मुस्लिम यूथ लीग उत्तर प्रदेश ने राज्य के युवाओं के लिए 10-सूत्रीय "तालीम एवं रोजगार प्रस्ताव" पारित किया','National President Adv. Sarfaraz Ahmed stated that MYL is building constructive grassroots leadership committed to Baba Saheb Ambedkar''s constitutional ideals.','राष्ट्रीय अध्यक्ष एडवोकेट सरफ़राज़ अहमद ने कहा कि MYL बाबासाहेब डॉ. आंबेडकर के संवैधानिक आदर्शों पर आधारित रचनात्मक व शिक्षित युवा नेतृत्व तैयार कर रही है।','Addressing the State Cadre Convention, the leadership ratified the historic 10-Point Resolution. Demands include restoring full post-matric scholarship allocations for OBC, Dalit, and minority students, establishing government degree colleges in educationally backward tehsils of Moradabad, Sambhal, Rampur, and Azamgarh, and launching district-level competitive examination coaching centres free of charge.','राज्य कार्यकर्ता सम्मेलन को संबोधित करते हुए नेतृत्व ने ऐतिहासिक 10-सूत्रीय प्रस्ताव पारित किया। इसमें ओबीसी, दलित और अल्पसंख्यक छात्रों की छात्रवृत्ति का शत-प्रतिशत वितरण, मुरादाबाद, संभल, रामपुर, और आज़मगढ़ की पिछड़ी तहसीलों में सरकारी डिग्री कॉलेज खोलने, और ज़िला स्तर पर निःशुल्क कोचिंग केंद्र स्थापित करने की मांग की गई है।',c.id,'2026-10-14'::date::timestamptz,3,'UP State Media Committee','उत्तर प्रदेश राज्य मीडिया समिति','Official Spokesperson','आधिकारिक प्रवक्ता',2840,true
FROM public.news_categories c WHERE c.code='press_release'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,excerpt_en=excluded.excerpt_en,excerpt_hi=excluded.excerpt_hi,content_en=excluded.content_en,content_hi=excluded.content_hi,category_id=excluded.category_id,published_at=excluded.published_at,read_time_minutes=excluded.read_time_minutes,author_name_en=excluded.author_name_en,author_name_hi=excluded.author_name_hi,author_role_en=excluded.author_role_en,author_role_hi=excluded.author_role_hi,share_count=excluded.share_count,is_published=true,updated_at=now();

DELETE FROM public.news_post_tags WHERE news_post_id=(SELECT id FROM public.news_posts WHERE legacy_id='news-up-1');
INSERT INTO public.news_tags(name) VALUES ('MuslimYouthLeague'), ('UPYouth'), ('EducationRights'), ('LifeLift') ON CONFLICT(name) DO NOTHING;
INSERT INTO public.news_post_tags(news_post_id,tag_id)
SELECT p.id,t.id FROM public.news_posts p CROSS JOIN public.news_tags t
WHERE p.legacy_id='news-up-1' AND t.name IN ('MuslimYouthLeague', 'UPYouth', 'EducationRights', 'LifeLift');

INSERT INTO public.news_posts (legacy_id,title_en,title_hi,excerpt_en,excerpt_hi,content_en,content_hi,category_id,published_at,read_time_minutes,author_name_en,author_name_hi,author_role_en,author_role_hi,share_count,is_published)
SELECT 'news-up-2','MSF Launches Statewide "Campus Helpline" for Post-Matric Minority & Dalit Scholarships','MSF ने उत्तर प्रदेश के छात्रों हेतु "कैंपस छात्रवृत्ति सहायता हेल्पलाइन" का शुभारंभ किया','Dedicated student volunteer desks established across universities and degree colleges to assist students with online portal verification and documentation.','विश्वविद्यालयों व महाविद्यालयों में छात्रों के ऑनलाइन पोर्टल सत्यापन और दस्तावेजीकरण में सहायता हेतु समर्पित छात्र सहायता डेस्क स्थापित।','Muslim Students Federation (MSF) units in Aligarh, Lucknow, Varanasi, and Meerut have initiated direct student assistance desks. The initiative aims to prevent thousands of eligible students from losing vital educational aid due to portal technical errors and red tape.','मुस्लिम स्टूडेंट्स फेडरेशन (MSF) ने अलीगढ़, लखनऊ, वाराणसी और मेरठ के कॉलेजों में सीधी सहायता डेस्क शुरू की है, ताकि तकनीकी खामियों और प्रशासनिक लेटलतीफी के कारण किसी भी योग्य छात्र की छात्रवृत्ति न रुके।',c.id,'2026-10-11'::date::timestamptz,3,'MSF State Secretariat','MSF प्रदेश सचिवालय','Student Affairs Secretary','छात्र कल्याण सचिव',3950,true
FROM public.news_categories c WHERE c.code='ground_action'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,excerpt_en=excluded.excerpt_en,excerpt_hi=excluded.excerpt_hi,content_en=excluded.content_en,content_hi=excluded.content_hi,category_id=excluded.category_id,published_at=excluded.published_at,read_time_minutes=excluded.read_time_minutes,author_name_en=excluded.author_name_en,author_name_hi=excluded.author_name_hi,author_role_en=excluded.author_role_en,author_role_hi=excluded.author_role_hi,share_count=excluded.share_count,is_published=true,updated_at=now();

DELETE FROM public.news_post_tags WHERE news_post_id=(SELECT id FROM public.news_posts WHERE legacy_id='news-up-2');
INSERT INTO public.news_tags(name) VALUES ('MSF'), ('ScholarshipHelp'), ('StudentEmpowerment') ON CONFLICT(name) DO NOTHING;
INSERT INTO public.news_post_tags(news_post_id,tag_id)
SELECT p.id,t.id FROM public.news_posts p CROSS JOIN public.news_tags t
WHERE p.legacy_id='news-up-2' AND t.name IN ('MSF', 'ScholarshipHelp', 'StudentEmpowerment');

COMMIT;
