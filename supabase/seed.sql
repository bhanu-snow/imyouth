-- Idempotent seed for the expanded bilingual MYL / IUML FAQ content and ground activities.
-- Run in Supabase SQL Editor AFTER migrations 00100–00800.
-- Safe to rerun: FAQ rows upsert by legacy_id and talking points are replaced for seeded FAQs.
BEGIN;

INSERT INTO public.faq_categories (code, name_en, name_hi, is_active, sort_order) VALUES
  ('history', '1948 History & Founders', '1948 इतिहास व संस्थापक', true, 1),
  ('ideology', 'Ideology, Ambedkar & Alliances', 'विचारधारा, आंबेडकर व गठबंधन', true, 2),
  ('up_focus', 'UP Relevance & Institutional Rights', 'यूपी में भूमिका व संस्थागत अधिकार', true, 3),
  ('secularism', 'Secularism & Quotes of Leaders', 'धर्मनिरपेक्षता व राष्ट्रीय नेताओं के विचार', true, 4),
  ('culture_society', 'Culture, Art & Public Figures', 'कला, संस्कृति व बुद्धिजीवी मंच', true, 5),
  ('wings', 'MYL, MSF & Pan-India Works', 'MYL, MSF व देशव्यापी जनसेवा', true, 6)
ON CONFLICT (code) DO UPDATE SET 
  name_en = excluded.name_en,
  name_hi = excluded.name_hi,
  is_active = true,
  sort_order = excluded.sort_order;

-- -----------------------------------------------------------------------------
-- 1. HISTORY: Dissolution of Pre-Partition League vs 10 March 1948 Madras Founding
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-1', 
  (SELECT id FROM public.faq_categories WHERE code='history'),
  'Is the Indian Union Muslim League (IUML) the same political league from pre-partition 1947?',
  'क्या इंडियन यूनियन मुस्लिम लीग (IUML) वही पार्टी है जो 1947 के बंटवारे से पहले थी?',
  'FALSE. The pre-partition League was dissolved in December 1947. IUML was founded in sovereign independent India on 10 March 1948 in Madras (Chennai) by Quaid-e-Millath Muhammad Ismail Sahib, swearing unshakeable allegiance to the Indian Constitution.',
  'पूर्णतः असत्य व भ्रामक। 1947 के विभाजन के बाद पुरानी संस्था समाप्त हो गई थी। आज़ाद भारत में 10 मार्च 1948 को मद्रास (चेन्नई) में क़ायदे-मिल्लत एम. मुहम्मद इस्माइल साहब द्वारा "इंडियन यूनियन मुस्लिम लीग" (IUML) की नए सिरे से स्थापना की गई, जिसकी पहली शर्त भारतीय संविधान व तिरंगे के प्रति पूर्ण निष्ठा थी।',
  'Following the partition of India, the All-India Muslim League formally ceased operations in December 1947 at Karachi. Nationalist Muslim leaders who chose India as their sacred homeland assembled on 10 March 1948 at Rajaji Hall in Madras under the leadership of Quaid-e-Millath M. Muhammad Ismail Sahib, K.M. Seethi Sahib, and B. Pocker Sahib. They resolved that Indian Muslims must participate openly, democratically, and peacefully within the framework of the Republic of India. IUML registered as an Indian political entity, adopted the Indian tricolour background on its banners alongside its distinctive green ladder, and has functioned exclusively under the Representation of the People Act since 1951.',
  'अगस्त 1947 में आज़ादी और देश के विभाजन के बाद पुरानी ऑल इंडिया मुस्लिम लीग कराची में औपचारिक रूप से विसर्जित हो गई। जो देशभक्त मुस्लिम नेता अपनी मिट्टी और वतन भारत में रहे, वे 10 मार्च 1948 को मद्रास (चेन्नई) के राजाजी हॉल में कायदे-मिल्लत एम. मुहम्मद इस्माइल साहिब, के.एम. सीथी साहिब और बी. पोकर साहिब की अगुवाई में इकट्ठे हुए। उन्होंने संकल्प लिया कि आज़ाद भारत के मुसलमान किसी भूमिगत या उग्रवादी रास्ते पर नहीं चलेंगे, बल्कि भारत के संविधान, संसद और लोकतांत्रिक संस्थाओं के माध्यम से अपने अधिकारों और राष्ट्रीय एकता की रक्षा करेंगे। पार्टी का चुनाव आयोग में स्वतंत्र भारत की पंजीकृत पार्टी के रूप में विधिवत पंजीयन हुआ।',
  true, 
  1
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 2. HISTORY & CONSTITUTION: Founder Quaid-e-Millath & Dr. B.R. Ambedkar
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-6', 
  (SELECT id FROM public.faq_categories WHERE code='history'),
  'Did IUML founders play any role in drafting the Indian Constitution alongside Dr. B.R. Ambedkar?',
  'क्या IUML के संस्थापकों ने बाबासाहेब डॉ. भीमराव आंबेडकर के साथ मिलकर भारतीय संविधान निर्माण में भाग लिया था?',
  'YES. IUML founder Quaid-e-Millath M. Muhammad Ismail Sahib and leader B. Pocker Sahib were elected members of India’s Constituent Assembly who actively collaborated with Drafting Committee Chairman Dr. B.R. Ambedkar.',
  'हाँ, बिल्कुल सत्य। IUML के संस्थापक क़ायदे-मिल्लत एम. मुहम्मद इस्माइल साहिब और वरिष्ठ नेता बी. पोकर साहिब भारत की ऐतिहासिक संविधान सभा के निर्वाचित सदस्य थे, जिन्होंने मसौदा समिति के अध्यक्ष बाबासाहेब डॉ. बी.आर. आंबेडकर के साथ मिलकर संविधान निर्माण में सक्रिय भूमिका निभाई।',
  'During the Constituent Assembly debates (1946–1949), Quaid-e-Millath Muhammad Ismail and B. Pocker Sahib represented Madras. They stood firm on preserving personal laws, defending minority religious and cultural educational freedoms, which culminated in the immortal Articles 25 to 30 of our Constitution. When discussions took place regarding the national language and fundamental rights, Ismail Sahib advocated for regional linguistic heritage (including Tamil) and fundamental protections for backward classes. Dr. Ambedkar recognized their constitutional decorum and constructive dialogue in parliament.',
  'भारतीय संविधान सभा की बहसों (1946-1949) के आधिकारिक संसदीय अभिलेख इस बात के गवाह हैं कि कायदे-मिल्लत मुहम्मद इस्माइल और बी. पोकर साहिब ने मद्रास का प्रतिनिधित्व करते हुए अल्पसंख्यकों, भाषा-संस्कृति और पिछड़े वर्गों के संरक्षण हेतु ऐतिहासिक बहसें कीं। संविधान के अनुच्छेद 25 से 30 (धार्मिक और शैक्षणिक स्वतंत्रता) के निर्माण में उनकी सशक्त भूमिका रही। उन्होंने हिंदी के साथ-साथ तमिल और अन्य क्षेत्रीय भाषाओं की गरिमा की रक्षा की। बाबासाहेब डॉ. आंबेडकर ने हमेशा सदन में उनके कानूनी तर्क और संसदीय मर्यादा की सराहना की।',
  true, 
  2
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 3. COALITIONS & GOVERNANCE: Kerala Model & UDF Coalition Success
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-7', 
  (SELECT id FROM public.faq_categories WHERE code='ideology'),
  'Has IUML ever run governments, or is it merely an agitation party without administrative experience?',
  'क्या IUML ने कभी सरकारें चलाई हैं या यह केवल धरने-प्रदर्शन करने वाला दल है?',
  'IUML possesses extensive administrative experience. It has been a key pillar of the United Democratic Front (UDF) in Kerala and has governed departments like Education, Public Works, Industry, and Panchayati Raj for decades.',
  'IUML के पास दशकों का सफल प्रशासनिक अनुभव है। केरल में पार्टी यूनाइटेड डेमोक्रेटिक फ्रंट (UDF) की मुख्य घटक रही है और उसने शिक्षा, लोक निर्माण (PWD), उद्योग और पंचायती राज जैसे अहम मंत्रालयों को ईमानदारी व पारदर्शिता से चलाया है।',
  'IUML leader C.H. Mohammed Koya served as Education Minister of Kerala for multiple terms and even as Chief Minister of Kerala in 1979. Under his tenure as Education Minister, higher education was decentralized: the University of Calicut was established in the backward Malabar region, enabling millions of poor, Dalits, and Muslim boys and girls to attain university degrees. The party prioritized schools, polytechnics, hospitals, and rural bridges over hollow polemics. Today, Malappuram district—once among the poorest—has one of India’s highest literacy rates and lowest infant mortality rates.',
  'आईयूएमएल के वरिष्ठ नेता सी.एच. मुहम्मद कोया केरल के कई बार शिक्षा मंत्री और 1979 में केरल के मुख्यमंत्री रहे। शिक्षा मंत्री के रूप में उन्होंने ऐतिहासिक निर्णय लेते हुए पिछड़े मालाबार क्षेत्र में कालीकट विश्वविद्यालय (Calicut University) की स्थापना की। हज़ारों स्कूल, पॉलिटेक्निक कॉलेज और अस्पताल स्थापित किए गए, जिससे गरीब हिंदू, मुस्लिम और दलित परिवारों के बच्चे उच्च शिक्षा हासिल कर सके। आज मल्लपुरम जिला, जो कभी सबसे पिछड़ा था, देश के सर्वाधिक साक्षर और स्वस्थ जिलों में गिना जाता है।',
  true, 
  3
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 4. ALLIANCES: Tamil Nadu, DMK, TVK & Broader Anti-Fascist Secular Fronts
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-8', 
  (SELECT id FROM public.faq_categories WHERE code='ideology'),
  'How does IUML relate to Dravidian politics in Tamil Nadu and secular alliances nationally?',
  'तमिलनाडु में द्रविड़ राजनीति और राष्ट्रीय स्तर पर धर्मनिरपेक्ष दलों के साथ IUML का क्या संबंध है?',
  'IUML is a trusted, principled coalition ally of secular and social justice movements—including the DMK-led secular progressive alliance in Tamil Nadu and the national INDIA alliance with leaders like Rahul Gandhi.',
  'IUML सामाजिक न्याय और धर्मनिरपेक्ष आंदोलनों की सबसे भरोसेमंद सहयोगी रही है—चाहे तमिलनाडु में द्रविड़ मुनेत्र कड़गम (DMK) गठबंधन हो, या राष्ट्रीय स्तर पर राहुल गांधी व अन्य सेक्युलर दलों का मंच। पार्टी टीवीके (TVK) जैसे नए जनआंदोलनों के साथ भी लोकतांत्रिक संवाद बनाए रखती है।',
  'In Tamil Nadu, Quaid-e-Millath shared a warm, fraternal relationship with Periyar E.V. Ramasamy and Arignar Anna (C.N. Annadurai). Anna famously called Ismail Sahib "a jewel of humanity." Since the 1960s, IUML has remained a steadfast partner in preserving state autonomy, social justice, and OBC/minority reservations. At the national level, IUML has consistently fought against authoritarian policies alongside Rahul Gandhi and other progressive forces. When actor-politician Vijay launched Tamilaga Vettri Kazhagam (TVK) with an Ambedkarite-secular declaration, IUML welcomed the commitment to constitutional fraternity and federal rights.',
  'तमिलनाडु में क़ायदे-मिल्लत मुहम्मद इस्माइल के पेरियार ई.वी. रामासामी और द्रविड़ आंदोलन के जनक अन्नादुरै (अन्ना) के साथ आत्मीय संबंध थे। अन्नादुरै ने कायदे-मिल्लत को "इंसानियत का अनमोल नगीना" कहा था। पार्टी ने तमिलनाडु में सामाजिक न्याय, राज्य की स्वायत्तता और आरक्षण को सुरक्षित रखने में ऐतिहासिक भूमिका निभाई है। राष्ट्रीय स्तर पर भी राहुल गांधी के नेतृत्व वाले धर्मनिरपेक्ष गठबंधन में IUML एक सम्मानित शक्ति है। हाल ही में जब टीवीके (TVK) ने अम्बेडकरवादी और धर्मनिरपेक्ष घोषणापत्र जारी किया, तो लीग ने संवैधानिक मूल्यों के दायरे में नए युवा नेतृत्व का स्वागत किया।',
  true, 
  4
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 5. SECULARISM: What Have National Leaders Said About IUML?
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-9', 
  (SELECT id FROM public.faq_categories WHERE code='secularism'),
  'What have Indian Prime Ministers and national leaders across ideological lines said about IUML?',
  'भारत के प्रधानमंत्रियों और राष्ट्रीय नेताओं ने IUML के चरित्र और देशभक्ति के बारे में क्या कहा है?',
  'Leaders from Pandit Jawaharlal Nehru, Indira Gandhi, and C. Rajagopalachari to Atal Bihari Vajpayee and Rahul Gandhi have publicly acknowledged IUML as a patriotic, moderate, and constitutionally democratic party.',
  'पंडित जवाहरलाल नेहरू, चक्रवर्ती राजगोपालाचारी और इंदिरा गांधी से लेकर पूर्व प्रधानमंत्री अटल बिहारी वाजपेयी और राहुल गांधी तक ने सार्वजनिक रूप से IUML को एक देशभक्त, संयमित और संविधान-सम्मत लोकतांत्रिक पार्टी स्वीकार किया है।',
  '1. **Pandit Jawaharlal Nehru**: Welcomed Quaid-e-Millath’s patriotic stand during the 1962 Sino-Indian War when Ismail Sahib offered his own son to the Indian Armed Forces.
2. **C. Rajagopalachari (Rajaji)**: Described Quaid-e-Millath as a leader whose word was inviolable and whose commitment to civil harmony was exemplary.
3. **Atal Bihari Vajpayee**: When leading India’s parliamentary delegations abroad (including to Geneva UN Human Rights conventions), PM Vajpayee repeatedly selected IUML leader and MP E. Ahamed to represent the Republic of India on the international stage, praising his diplomatic statesmanship and patriotism.
4. **Rahul Gandhi**: Affirmed at the Washington National Press Club that "IUML is a completely secular party, there is nothing non-secular about them."
5. **K.R. Narayanan (Former President of India)**: Commended late Panakkad Syed Mohammadali Shihab Thangal as an apostle of communal amity who preserved inter-faith peace throughout his life.',
  '1. **पंडित जवाहरलाल नेहरू**: 1962 के भारत-चीन युद्ध के दौरान जब कायदे-मिल्लत ने देश रक्षा के लिए अपने बेटे को सेना में भेजने की पेशकश की और फंड जुटाया, तो नेहरू जी ने उनके देशभक्ति पूर्ण रुख का संसद में स्वागत किया।
2. **सी. राजगोपालाचारी (राजाजी)**: उन्होंने कायदे-मिल्लत को सच्चा देशभक्त और अपने वादे का पक्का राजनेता बताया।
3. **अटल बिहारी वाजपेयी**: वाजपेयी जी ने जिनेवा में संयुक्त राष्ट्र मानवाधिकार आयोग में भारत का प्रतिनिधित्व करने के लिए IUML नेता व सांसद ई. अहमद साहब को प्रतिनिधिमंडल का नेता बनाया और उनके कूटनीतिक कौशल की प्रशंसा की।
4. **राहुल गांधी**: वाशिंगटन प्रेस क्लब में बोलते हुए राहुल गांधी ने स्पष्ट कहा: "IUML पूरी तरह से धर्मनिरपेक्ष पार्टी है, उसमें कुछ भी गैर-धर्मनिरपेक्ष नहीं है।"
5. **के.आर. नारायणन (पूर्व राष्ट्रपति)**: उन्होंने पाणाक्काड सैयद मुहम्मदाली शिहाब तंगल को दक्षिण भारत में साम्प्रदायिक सद्भाव का सच्चा मसीहा बताया।',
  true, 
  5
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 6. CULTURE, ART & SCIENTIFIC FIGURES ON IUML PLATFORMS
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-10', 
  (SELECT id FROM public.faq_categories WHERE code='culture_society'),
  'Does the party connect with the broader intellectual, literary, scientific, and artistic world?',
  'क्या इस पार्टी का साहित्य, कला, सिनेमा और वैज्ञानिक जगत के बुद्धिजीवियों से कोई संबंध रहा है?',
  'ABSOLUTELY. IUML and MYL have always fostered deep engagement with iconic writers, scientists, jurists, film artists, and thinkers across religious communities.',
  'हाँ, बिल्कुल। IUML और MYL के मंचों पर देश के मूर्धन्य साहित्यकारों, वैज्ञानिकों, न्यायाधीशों, फ़िल्म कलाकारों और विचारकों ने हमेशा सम्मानपूर्वक शिरकत की है और आपसी संवाद को बढ़ावा दिया है।',
  'Historically, legendary Malayalam writers like Vaikom Muhammad Basheer, Jnanpith awardee M.T. Vasudevan Nair, and literary critic Dr. Sukumar Azhikode maintained deep relationships of mutual respect with IUML leadership. Supreme Court Justice V.R. Krishna Iyer frequently praised IUML’s secular legal governance and social reforms. Cultural festivals, book fairs, and academic symposia organized by the Muslim Youth League regularly host eminent non-Muslim scientists, progressive cinema actors, poets, and human rights defenders. The Panakkad Kodappanakkal family house in Malappuram has for decades been a pilgrimage of dialogue where temple committee heads, Christian bishops, and creative artists seek counsel and mutual blessing.',
  'मलयालम के महान लेखक वैकोम मुहम्मद बशीर, ज्ञानपीठ पुरस्कार विजेता एम.टी. वासुदेवन नायर, और प्रख्यात समालोचक डॉ. सुकुमार अझीकोड के मुस्लिम लीग नेतृत्व के साथ अत्यंत आत्मीय संबंध रहे हैं। सुप्रीम कोर्ट के ऐतिहासिक न्यायविद् जस्टिस वी.आर. कृष्णा अय्यर ने IUML के धर्मनिरपेक्ष दृष्टिकोण और प्रशासनिक सुधारों की बारंबार सराहना की। मुस्लिम यूथ लीग (MYL) के साहित्य सम्मेलनों और विमर्शों में जाने-माने वैज्ञानिक, कलाकार, फ़िल्म निर्देशक और सामाजिक कार्यकर्ता नियमित रूप से भाग लेते हैं। पाणाक्काड स्थित तंगल परिवार का निवास स्थान दशकों से ऐसा केंद्र रहा है जहाँ मंदिर कमेटियों के प्रमुख, चर्च के पादरी और लेखक सामाजिक सौहार्द के लिए एक साथ बैठते हैं।',
  true, 
  6
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 7. RELEVANCE IN UTTAR PRADESH & INSTITUTIONAL REMEDIES (RTI, POLICE, MINISTRIES)
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-2', 
  (SELECT id FROM public.faq_categories WHERE code='up_focus'),
  'Why is Muslim Youth League (MYL) & IUML needed in Uttar Pradesh? Is it not only a southern party?',
  'उत्तर प्रदेश में मुस्लिम यूथ लीग (MYL) और IUML की क्या आवश्यकता है? क्या यह केवल दक्षिण भारत का दल नहीं है?',
  'IUML is a national political party recognized by the Election Commission. Uttar Pradesh youth need institutional, educated leadership focused on education, jobs, legal literacy, RTI, and police accountability rather than emotional exploitation.',
  'IUML भारत निर्वाचन आयोग द्वारा मान्यता प्राप्त राष्ट्रीय स्तर का राजनीतिक दल है। उत्तर प्रदेश के युवाओं को भावनात्मक शोषण और डर की राजनीति से हटकर तालीम, रोज़गार, आरटीआई (RTI), पुलिस जवाबदेही और संवैधानिक हक़ दिलाने वाले पढ़े-लिखे नेतृत्व की सख्त आवश्यकता है।',
  'For decades, minorities, Dalits, and backward communities in Uttar Pradesh have been treated as passive vote-banks by regional parties, while districts like Moradabad, Sambhal, Rampur, Aligarh, Meerut, Lucknow, Varanasi, and Azamgarh suffer from high dropout rates, unreleased scholarships, police harassment, and economic stagnation. MYL UP, under National President Adv. Sarfaraz Ahmed, is building trained legal aid cells, running RTI clinics to audit minority welfare and waqf funds, establishing career counselling centers ("Life Lift"), and standing alongside citizens at police stations to ensure fair FIR registration without fear.',
  'उत्तर प्रदेश में दशकों से अल्पसंख्यकों, दलितों और पिछड़ों को केवल चुनाव जीतने का औज़ार बनाया गया। मुरादाबाद, संभल, रामपुर, अलीगढ़, मेरठ, लखनऊ, वाराणसी और आज़मगढ़ जैसे जिलों में ड्रॉपआउट की दर ऊंची है, वजीफे (छात्रवृत्ति) पोर्टल में अटक जाते हैं और थानों में गरीबों की सुनवाई नहीं होती। एडवोकेट सरफ़राज़ अहमद (राष्ट्रीय अध्यक्ष, MYL) के नेतृत्व में लीग यूपी में युवाओं को विधिक रूप से सशक्त कर रही है: आरटीआई क्लीनिक खोलकर वक्फ और सरकारी योजनाओं का ऑडिट कराना, थानों में एफआईआर और कानूनी मदद दिलाना, और "लाइफ लिफ्ट" के ज़रिए प्रतियोगी परीक्षाओं की तैयारी कराना।',
  true, 
  7
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 8. INSTITUTIONAL RIGHTS: RTI, Police Stations & Access to Ministries
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-11', 
  (SELECT id FROM public.faq_categories WHERE code='up_focus'),
  'What concrete institutional solutions does MYL offer to solve everyday police, administrative, and government welfare problems in UP?',
  'उत्तर प्रदेश में पुलिस उत्पीड़न, आरटीआई, और मंत्रालयों की योजनाओं का लाभ दिलाने के लिए MYL के पास क्या ठोस समाधान है?',
  'MYL deploys a 3-tier institutional shield: 1) RTI Desks to combat corruption; 2) Legal Cadres for police station and FIR assistance; 3) Direct Helpdesks for unblocking government welfare schemes and scholarships.',
  'MYL 3-स्तरीय संस्थागत समाधान देती है: 1) भ्रष्टाचार खत्म करने और फंड ट्रैक करने के लिए आरटीआई हेल्पडेस्क; 2) थानों में निष्पक्ष सुनवाई और एफआईआर हेतु प्रशिक्षित विधिक कार्यकर्ता; 3) बिचौलियों को हटाकर सरकारी योजनाओं व छात्रवृत्ति का सीधा लाभ दिलाने के लिए नागरिक केंद्र।',
  'Rather than reactionary protests that lead to false cases against innocent youth, MYL trains youth in administrative literacy:
1. **RTI Helplines**: Filing precise Right to Information applications to track allocated minority welfare grants, school funds, and municipal budgets in UP tehsils.
2. **Police Accountability**: Cadres accompany victims to ensure compliance with CrPC/BNSS arrest guidelines, video recordings of seizures, prompt registration of cross-FIRs, and prevention of arbitrary custodial detention.
3. **Ministry & Departmental Linkage**: Direct facilitation for central/state scholarships (NSP portal), MSME artisan loans for weavers and brass artisans, and legal aid before the Minorities Commission and Human Rights Commission.',
  'हंगामा और गैर-जिम्मेदाराना बयानबाज़ी के बजाय जिससे निर्दोष युवाओं पर मुकदमों का खतरा बनता है, MYL प्रशासनिक हथियारों का इस्तेमाल करती है:
1. **आरटीआई हेल्पडेस्क**: तहसीलों और ब्लॉक स्तर पर आरटीआई के ज़रिए यह हिसाब मांगना कि अल्पसंख्यक और छात्रवृत्ति का सरकारी पैसा कहाँ खर्च हुआ।
2. **पुलिस जवाबदेही**: थानों में हमारे कानूनी कार्यकर्ता नागरिकों के साथ खड़े होते हैं, ताकि बिना रिश्वत एफआईआर दर्ज हो, गिरफ्तारी और तलाशी के नियमों का पालन हो, और किसी निर्दोष का उत्पीड़न न किया जा सके।
3. **मंत्रालयों से सीधा संपर्क**: बुनकरों, पीतल कारीगरों और दस्तकारों के लिए सरकारी लोन, अल्पसंख्यक आयोग और मानवाधिकार आयोग में लंबित मामलों की पैरवी करना।',
  true, 
  8
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 9. BROADER SOLIDARITY: Muslims, Dalits, OBCs and Oppressed Societies
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-3', 
  (SELECT id FROM public.faq_categories WHERE code='ideology'),
  'Does Muslim Youth League (MYL) work only for Muslims, or does it fight for Dalits, OBCs, and all oppressed communities?',
  'क्या मुस्लिम यूथ लीग (MYL) केवल एक समुदाय की बात करती है या सभी वंचित व पिछड़े वर्गों के साथ है?',
  'MYL and IUML stand firmly for communal amity, backward classes (OBCs), Dalits, minorities, and every oppressed citizen under Dr. B.R. Ambedkar’s constitutional framework.',
  'MYL और IUML बाबासाहेब डॉ. आंबेडकर के संवैधानिक सिद्धांतों के अनुसार सामाजिक न्याय, पिछड़े वर्गों (OBC), दलितों, अल्पसंख्यकों और हर पीड़ित नागरिक के अधिकारों के लिए समान रूप से खड़ी है।',
  'In Kerala and Tamil Nadu, IUML has a stellar record of running ministries that served all communities equally. Schools, engineering colleges, universities, and hospitals built under IUML leadership educate millions of students regardless of religion or caste. Panakkad Syed Shihab Thangal was revered across southern India as a beacon of communal harmony, regularly visiting temples, churches, and mosques to mediate peace. In UP, MYL works shoulder-to-shoulder with Dalit and backward class youth groups on students'' and workers'' issues.',
  'केरल में मुस्लिम लीग के नेतृत्व में शिक्षा, स्वास्थ्य और उद्योग विभागों ने बिना किसी धार्मिक भेदभाव के पूरे समाज की सेवा की है। पाणाक्काड सैयद मुहम्मद अली शिहाब थंगल को केरल में सर्वधर्म सद्भाव का प्रतीक माना जाता है। उत्तर प्रदेश में भी MYL दलित, पिछड़े और सभी कमजोर तबकों के युवाओं के साथ मिलकर कैंपस व जनहित के मुद्दों पर संघर्ष कर रही है।',
  true, 
  9
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 10. SECULAR DEMOCRATIC CREDENTIALS & PEACE-BUILDING
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-5', 
  (SELECT id FROM public.faq_categories WHERE code='secularism'),
  'How does MYL practice Secularism when its name contains the word "Muslim"?',
  'जब नाम में "मुस्लिम" शब्द है, तो MYL धर्मनिरपेक्षता (Secularism) पर कैसे अमल करती है?',
  'Secularism in India guarantees the right of marginalized groups to organize democratically within the Constitution. The party has defended the Indian Constitution’s basic structure against all forms of extremism.',
  'भारत का संविधान प्रत्येक नागरिक और अल्पसंख्यक समुदाय को अपने अधिकारों के लिए लोकतांत्रिक व शांतिपूर्ण संगठन बनाने का मौलिक अधिकार देता है। IUML ने हमेशा संविधान की प्रस्तावना और धर्मनिरपेक्षता की रक्षा की है।',
  'Just as Akali Dal represents Sikh identity in Punjab or Christian Democratic parties operate across Europe''s mature democracies, IUML openly, transparently, and constitutionally represents minority aspirations without deception. Crucially, IUML has NEVER advocated separatism, hate speech, or extra-constitutional extremism. In the turbulent aftermath of December 1992, late Panakkad Thangal famously gave strict orders: "Not a single stone must be thrown in Kerala or elsewhere; peace and secular brotherhood are our absolute duty." This statesmanship saved countless lives and remains our guiding compass.',
  'जैसे पंजाब में अकाली दल सिख पहचान का लोकतांत्रिक प्रतिनिधित्व करता है या यूरोप में क्रिश्चियन डेमोक्रेटिक पार्टियां लोकतंत्र में भाग लेती हैं, वैसे ही IUML पारदर्शी, संवैधानिक और लोकतांत्रिक तरीके से अल्पसंख्यकों के अधिकारों की बात करती है। लीग ने हमेशा हर तरह के उग्रवाद और नफरत का डटकर विरोध किया है। 1992 में जब पूरे उत्तर भारत में तनाव था, तब पाणाक्काड थंगल साहब का सख्त निर्देश था कि "शांति और भाईचारा किसी भी कीमत पर टूटना नहीं चाहिए।"',
  true, 
  10
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 11. PAN-INDIA HUMANITARIAN WORK: White Guard & Disaster Relief Across India
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-12', 
  (SELECT id FROM public.faq_categories WHERE code='wings'),
  'Does the Muslim Youth League carry out humanitarian relief outside South India during national disasters?',
  'क्या मुस्लिम यूथ लीग (MYL) दक्षिण भारत के बाहर भी राष्ट्रीय आपदाओं और संकट के समय राहत कार्य करती है?',
  'YES. MYL’s disaster management wing, the White Guard, has rendered non-partisan humanitarian relief across India—including in Delhi, Assam, Bihar, Kashmir, and Wayanad.',
  'हाँ। MYL का स्वयंसेवक व आपदा प्रबंधन विंग "व्हाइट गार्ड" (White Guard) बिना किसी धार्मिक भेदभाव के दिल्ली, असम, बिहार, कश्मीर और वायनाड सहित पूरे देश में आपातकालीन राहत पहुंचाता रहा है।',
  'During the devastating landslides in Wayanad, White Guard volunteers were among the first on the ground rescuing trapped citizens regardless of community. During the 2020 Delhi riots and the COVID-19 pandemic, MYL volunteers distributed thousands of ration kits, medicines, oxygen concentrators, and financial rehabilitation packages across North India. In Assam and Bihar flood crises, MYL teams rebuilt homes and restored drinking water facilities. This humanitarian spirit embodies our guiding motto: Seva to humanity is worship.',
  'वायनाड के विनाशकारी भूस्खलन के दौरान व्हाइट गार्ड के स्वयंसेवकों ने अपनी जान जोखिम में डालकर सबसे पहले राहत पहुंचाई। 2020 के दिल्ली दंगों और कोरोना महामारी के दौरान MYL के कार्यकर्ताओं ने उत्तर भारत के पीड़ित परिवारों को राशन, दवाइयां, ऑक्सीजन कंसंट्रेटर और मकान बनाने हेतु आर्थिक सहायता दी। असम और बिहार में बाढ़ के समय MYL ने बेघर परिवारों के घर दोबारा बनवाए और हैंडपंप लगवाए। हमारी राजनीति का पहला उसूल इंसानियत की निःस्वार्थ सेवा है।',
  true, 
  11
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 12. INTERNAL STRUCTURE: IUML, MYL, MSF & Life Lift
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-4', 
  (SELECT id FROM public.faq_categories WHERE code='wings'),
  'What is the relationship between IUML, Muslim Youth League (MYL), MSF, and the White Guard?',
  'IUML, मुस्लिम यूथ लीग (MYL), MSF और व्हाइट गार्ड में क्या संबंध है?',
  'They represent a unified democratic family: IUML is the mother political party, MYL is the dynamic youth vanguard (formed 1973), MSF is the student federation, and White Guard is the humanitarian seva corps.',
  'यह एक सुव्यवस्थित लोकतांत्रिक संगठन है: IUML मातृ राजनीतिक दल है, मुस्लिम यूथ लीग (MYL) युवा शक्ति का संगठन है (स्थापना 1973), MSF छात्र मोर्चा है और व्हाइट गार्ड सेवा व आपदा प्रबंधन विंग है।',
  'Each wing plays a dedicated, non-overlapping role:
1. **IUML**: Parliamentary political party fighting for legislative representation and policy rights.
2. **MYL (Muslim Youth League)**: Mobilizes youth between 18-35 for civic leadership, employment, anti-drug awareness, and ground campaigns.
3. **MSF (Muslim Students Federation)**: Represents university and college students (AMU, Lucknow Univ, degree colleges) on scholarships, campus democracy, and fair exams.
4. **White Guard**: Uniformed, disciplined volunteer seva force deployed for flood relief, medical emergencies, food drives, and peaceful crowd management.
5. **Life Lift**: Dedicated youth wing program for skill training, career counseling, and UPSC/civil service mentorship in UP.',
  'हर विंग का अपना निश्चित और ज़िम्मेदार कार्यक्षेत्र है:
1. **IUML**: संसदीय व चुनावी राजनीति में जनता के संवैधानिक अधिकारों की पैरवी करने वाला मुख्य दल।
2. **मुस्लिम यूथ लीग (MYL)**: 18 से 35 वर्ष के युवाओं को सामाजिक, राजनीतिक और नेतृत्व के क्षेत्र में प्रशिक्षित करने वाला संगठन।
3. **MSF (मुस्लिम स्टूडेंट्स फेडरेशन)**: कॉलेज और विश्वविद्यालय स्तर पर छात्रों के अधिकारों, फीस, हॉस्टल और छात्रवृत्ति के लिए लड़ने वाला छात्र मोर्चा।
4. **व्हाइट गार्ड (White Guard)**: बाढ़, आपदा, रक्तदान और सामाजिक सेवा के लिए समर्पित अनुशासित स्वयंसेवक दस्ता।
5. **लाइफ लिफ्ट (Life Lift)**: उत्तर प्रदेश के युवाओं को प्रतियोगी परीक्षाओं, सिविल सेवा और रोजगार कौशल से जोड़ने वाला विशेष उपक्रम।',
  true, 
  12
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- 13. CADRE INVITATION & MEMBERSHIP: How to Join and Participate
-- -----------------------------------------------------------------------------
INSERT INTO public.myth_faqs (legacy_id, category_id, myth_en, myth_hi, fact_en, fact_hi, detailed_explanation_en, detailed_explanation_hi, is_published, sort_order)
VALUES (
  'myth-13', 
  (SELECT id FROM public.faq_categories WHERE code='wings'),
  'Who can become a member of the Muslim Youth League (MYL) in Uttar Pradesh, and how does one join?',
  'उत्तर प्रदेश में मुस्लिम यूथ लीग (MYL) का सदस्य कौन बन सकता है और सदस्यता कैसे ली जा सकती है?',
  'Any Indian youth aged 18 to 35 who pledges fidelity to the Constitution of India, secular harmony, and socio-educational uplift is welcome to register as an MYL member.',
  '18 से 35 वर्ष का कोई भी भारतीय युवा जो भारत के संविधान, सामाजिक सौहार्द और पिछड़े वर्गों की तालीमी-आर्थिक तरक्की में विश्वास रखता है, वह MYL की सदस्यता ले सकता है।',
  'Membership in MYL is voluntary and fully transparent. Prospective members register through verified door-to-door cadre enrolment or through our official UP unit digital portal. Once registered and verified by the district committee, members receive an official digital membership ID and are organized into ward/block units to work on local public issues, student scholarships, RTI desks, and community service programs. MYL does not tolerate criminal elements or sectarian hatred.',
  'MYL की सदस्यता पूरी तरह पारदर्शी और स्वैच्छिक है। युवा हमारे घर-घर संपर्क अभियान के दौरान कार्यकर्ताओं के माध्यम से या आधिकारिक डिजिटल पोर्टल पर आवेदन कर सकते हैं। जिला समिति द्वारा सत्यापन के बाद आधिकारिक सदस्यता कार्ड जारी किया जाता है। इसके बाद सदस्यों को उनके वार्ड या ब्लॉक स्तर पर जोड़ा जाता है जहाँ वे जनसमस्याओं के समाधान, छात्रवृत्ति सहायता और आरटीआई अभियानों में सक्रिय भूमिका निभाते हैं।',
  true, 
  13
)
ON CONFLICT (legacy_id) DO UPDATE SET 
  category_id=excluded.category_id, myth_en=excluded.myth_en, myth_hi=excluded.myth_hi, fact_en=excluded.fact_en, fact_hi=excluded.fact_hi, detailed_explanation_en=excluded.detailed_explanation_en, detailed_explanation_hi=excluded.detailed_explanation_hi, is_published=true, sort_order=excluded.sort_order, updated_at=now();

-- -----------------------------------------------------------------------------
-- Delete existing talking points for these seeded FAQs and repopulate cleanly
-- -----------------------------------------------------------------------------
DELETE FROM public.faq_talking_points p 
USING public.myth_faqs f 
WHERE p.faq_id = f.id 
  AND f.legacy_id IN (
    'myth-1', 'myth-2', 'myth-3', 'myth-4', 'myth-5', 
    'myth-6', 'myth-7', 'myth-8', 'myth-9', 'myth-10', 
    'myth-11', 'myth-12', 'myth-13'
  );

-- English Talking Points
INSERT INTO public.faq_talking_points (faq_id, language_code, sort_order, talking_point)
SELECT f.id, 'en', v.sort_order, v.talking_point
FROM (VALUES
  ('myth-1', 1, 'Pre-partition All-India Muslim League was formally liquidated in Karachi in December 1947.'),
  ('myth-1', 2, 'IUML was freshly formed on 10 March 1948 in Madras as a purely Indian, constitutional democratic party.'),
  ('myth-1', 3, 'Founders resolved never to pursue communal separatism and to work strictly within the Indian Republic.'),
  
  ('myth-6', 1, 'Founder Quaid-e-Millath Muhammad Ismail was an elected member of India’s Constituent Assembly.'),
  ('myth-6', 2, 'IUML leaders worked closely with Drafting Committee Chairman Dr. B.R. Ambedkar to enact Articles 25-30 safeguarding cultural and minority rights.'),
  ('myth-6', 3, 'They championed linguistic equality and statutory guarantees for socially backward classes.'),

  ('myth-7', 1, 'IUML leader C.H. Mohammed Koya served as Education Minister of Kerala and as Chief Minister in 1979.'),
  ('myth-7', 2, 'The party founded the University of Calicut, bringing higher education to Malabar’s impoverished backward sections.'),
  ('myth-7', 3, 'IUML-run ministries established thousands of schools, hospitals, and rural roads with zero financial corruption.'),

  ('myth-8', 1, 'Periyar and C.N. Annadurai maintained warm fraternal ties with Quaid-e-Millath; Anna called him "a jewel of humanity."'),
  ('myth-8', 2, 'IUML is an indispensable component of the secular DMK alliance in Tamil Nadu and the INDIA bloc with Rahul Gandhi.'),
  ('myth-8', 3, 'The party engages positively with emerging pro-constitution youth platforms like TVK to advance federalism.'),

  ('myth-9', 1, 'Pandit Jawaharlal Nehru lauded Quaid-e-Millath’s patriotism in parliament during the 1962 Sino-Indian War.'),
  ('myth-9', 2, 'PM Atal Bihari Vajpayee chose IUML leader E. Ahamed to represent the Republic of India at the UN Human Rights Commission in Geneva.'),
  ('myth-9', 3, 'Rahul Gandhi explicitly stated in Washington: "IUML is a completely secular party."'),

  ('myth-10', 1, 'Jnanpith laureate M.T. Vasudevan Nair and legendary writer Vaikom Muhammad Basheer shared deep amity with League leaders.'),
  ('myth-10', 2, 'Supreme Court Justice V.R. Krishna Iyer acclaimed IUML’s secular administration and progressive social reforms.'),
  ('myth-10', 3, 'Panakkad Kodappanakkal House has been a sanctuary for inter-faith harmony, hosting temple trustees, church bishops, and artists.'),

  ('myth-2', 1, 'MYL National President Adv. Sarfaraz Ahmed is an advocate from Uttar Pradesh leading educated grassroots mobilization.'),
  ('myth-2', 2, 'Our primary mission is "Taaleem aur Taraqqi" (Education and Progress): coaching, scholarships, and skill training.'),
  ('myth-2', 3, 'We offer a viable alternative to the empty rhetoric of opportunistic regional parties in UP.'),

  ('myth-11', 1, 'RTI Desks uncover corruption and ensure transparency in minority welfare, scholarships, and waqf funds.'),
  ('myth-11', 2, 'Trained legal cadres assist ordinary citizens at police stations for fair FIR registration and to halt harassment.'),
  ('myth-11', 3, 'Direct administrative desks connect local artisans, weavers, and students directly to ministries without middlemen.'),

  ('myth-3', 1, 'IUML’s foundational motto is "Unity, Harmony, and Progress."'),
  ('myth-3', 2, 'Schools and hospitals built by IUML serve citizens of all faiths without discrimination.'),
  ('myth-3', 3, 'MYL actively allies with Dalit and OBC student bodies for social justice and reservation safeguards.'),

  ('myth-5', 1, 'The party constitution expressly mandates commitment to Indian secularism, socialism, and democracy.'),
  ('myth-5', 2, 'In December 1992, Panakkad Thangal forbade any retaliation, saving Kerala from communal fires.'),
  ('myth-5', 3, 'We believe that strong, educated minorities build a strong, resilient India.'),

  ('myth-12', 1, 'White Guard rescue units were at the forefront of relief in Wayanad, Assam, and Bihar floods.'),
  ('myth-12', 2, 'During the 2020 Delhi riots and COVID lockdowns, MYL distributed food, medical aid, and rebuilt homes in North India.'),
  ('myth-12', 3, 'Our humanitarian seva operates strictly on the principle of human fraternity without regard to creed.'),

  ('myth-4', 1, 'MSF trains students in campuses; MYL molds youth into ethical civic leaders.'),
  ('myth-4', 2, 'The White Guard acts as a peaceful, disciplined disaster relief and community service corps.'),
  ('myth-4', 3, 'Life Lift provides free civil service coaching and career mentoring to rural UP students.'),

  ('myth-13', 1, 'Any Indian youth aged 18 to 35 believing in the Indian Constitution can join MYL.'),
  ('myth-13', 2, 'Members participate in village/ward level legal aid, RTI desks, and educational support.'),
  ('myth-13', 3, 'Enrolment is voluntary, verified, and strictly democratic.')
) AS v(legacy_id, sort_order, talking_point)
JOIN public.myth_faqs f ON f.legacy_id = v.legacy_id;

-- Hindi Talking Points
INSERT INTO public.faq_talking_points (faq_id, language_code, sort_order, talking_point)
SELECT f.id, 'hi', v.sort_order, v.talking_point
FROM (VALUES
  ('myth-1', 1, '1947 के विभाजन के बाद पुरानी ऑल इंडिया मुस्लिम लीग कराची में समाप्त हो गई।'),
  ('myth-1', 2, 'IUML की स्थापना 10 मार्च 1948 को मद्रास में पूरी तरह स्वतंत्र भारतीय राजनीतिक दल के रूप में हुई।'),
  ('myth-1', 3, 'पार्टी ने पहले दिन से ही भारतीय संविधान और तिरंगे के प्रति अटूट निष्ठा की शपथ ली।'),

  ('myth-6', 1, 'संस्थापक क़ायदे-मिल्लत मुहम्मद इस्माइल संविधान सभा के निर्वाचित सदस्य थे और उन्होंने संविधान निर्माण में सक्रिय भाग लिया।'),
  ('myth-6', 2, 'बाबासाहेब डॉ. भीमराव आंबेडकर के साथ मिलकर उन्होंने अनुच्छेद 25-30 में अल्पसंख्यक व सांस्कृतिक अधिकारों को सुनिश्चित कराया।'),
  ('myth-6', 3, 'उन्होंने तमिल व क्षेत्रीय भाषाओं के सम्मान और पिछड़े वर्गों के संवैधानिक संरक्षण की पुरजोर वकालत की।'),

  ('myth-7', 1, 'आईयूएमएल नेता सी.एच. मुहम्मद कोया केरल के शिक्षा मंत्री और 1979 में मुख्यमंत्री रहे।'),
  ('myth-7', 2, 'मुस्लिम लीग के प्रयासों से कालीकट विश्वविद्यालय बना जिसने पिछड़े व गरीब बच्चों के लिए उच्च शिक्षा के द्वार खोले।'),
  ('myth-7', 3, 'पार्टी द्वारा संचालित मंत्रालयों ने हज़ारों स्कूल, अस्पताल और सड़कें बनाकर सुशासन का कीर्तिमान स्थापित किया।'),

  ('myth-8', 1, 'पेरियार और अन्नादुरै के कायदे-मिल्लत के साथ गहरे आत्मीय संबंध थे; अन्ना ने उन्हें "इंसानियत का नगीना" कहा था।'),
  ('myth-8', 2, 'तमिलनाडु में DMK और राष्ट्रीय स्तर पर राहुल गांधी के धर्मनिरपेक्ष मोर्चे में IUML एक निष्ठावान सहयोगी है।'),
  ('myth-8', 3, 'पार्टी टीवीके (TVK) जैसे नए अम्बेडकरवादी व धर्मनिरपेक्ष युवा मंचों के साथ भी लोकतांत्रिक संवाद रखती है।'),

  ('myth-9', 1, '1962 युद्ध में जब कायदे-मिल्लत ने राष्ट्र रक्षा में सहयोग दिया, तो पंडित नेहरू ने संसद में उनकी देशभक्ति की सराहना की।'),
  ('myth-9', 2, 'प्रधानमंत्री अटल बिहारी वाजपेयी ने संयुक्त राष्ट्र में भारत का पक्ष रखने के लिए IUML सांसद ई. अहमद को चुना।'),
  ('myth-9', 3, 'राहुल गांधी ने अंतरराष्ट्रीय प्रेस के सामने स्पष्ट किया कि "IUML पूरी तरह से धर्मनिरपेक्ष पार्टी है।"'),

  ('myth-10', 1, 'ज्ञानपीठ सम्मानित एम.टी. वासुदेवन नायर और लेखक वैकोम मुहम्मद बशीर के मुस्लिम लीग नेतृत्व से गहरे संबंध रहे।'),
  ('myth-10', 2, 'सुप्रीम कोर्ट के न्यायमूर्ति वी.आर. कृष्णा अय्यर ने IUML के सामाजिक व कानूनी सुधारों की भूरि-भूरि प्रशंसा की।'),
  ('myth-10', 3, 'पाणाक्काड तंगल परिवार का निवास स्थान मंदिर समितियों, चर्च पादरियों और लेखकों के लिए आपसी सद्भाव का केंद्र है।'),

  ('myth-2', 1, 'MYL के राष्ट्रीय अध्यक्ष एडवोकेट सरफ़राज़ अहमद यूपी से हैं और युवाओं की क़ानूनी व तालीमी लड़ाई लड़ रहे हैं।'),
  ('myth-2', 2, 'हमारा मुख्य मंत्र "तालीम और तरक्की" है—युवाओं को कोचिंग, छात्रवृत्ति और स्वरोजगार से जोड़ना।'),
  ('myth-2', 3, 'हम क्षेत्रीय दलों के खोखले वादों और डर की सियासत के खिलाफ एक स्वच्छ और सकारात्मक विकल्प हैं।'),

  ('myth-11', 1, 'आरटीआई डेस्क के ज़रिए वक्फ संपत्तियों, छात्रवृत्ति और सरकारी फंड में होने वाले भ्रष्टाचार पर रोक लगाना।'),
  ('myth-11', 2, 'थानों में प्रशिक्षित विधिक कार्यकर्ता आम नागरिकों के साथ खड़े होकर निष्पक्ष एफआईआर सुनिश्चित कराते हैं।'),
  ('myth-11', 3, 'बिचौलियों को हटाकर कारीगरों, बुनकरों और छात्रों को सरकारी मंत्रालयों की योजनाओं से सीधे जोड़ना।'),

  ('myth-3', 1, 'मुस्लिम लीग का मूल मंत्र है: "एकता, सामाजिक सद्भाव और प्रगति"।'),
  ('myth-3', 2, 'लीग द्वारा स्थापित शैक्षणिक संस्थान और अस्पताल बिना किसी जाति या धर्म के सभी नागरिकों की सेवा करते हैं।'),
  ('myth-3', 3, 'MYL सामाजिक न्याय और आरक्षण की रक्षा के लिए दलित और पिछड़े छात्र संगठनों के साथ मिलकर काम करती है।'),

  ('myth-5', 1, 'पार्टी का संविधान स्पष्ट रूप से भारतीय धर्मनिरपेक्षता, समाजवाद और लोकतंत्र के प्रति समर्पित है।'),
  ('myth-5', 2, 'दिसंबर 1992 में पाणाक्काड तंगल ने शांति का कड़ा आदेश देकर केरल को साम्प्रदायिक आग से सुरक्षित रखा।'),
  ('myth-5', 3, 'हमारा विश्वास है कि जब अल्पसंख्यक और कमजोर वर्ग मजबूत होंगे, तभी भारत एक शक्तिशाली राष्ट्र बनेगा।'),

  ('myth-12', 1, 'वायनाड भूस्खलन, असम और बिहार बाढ़ में व्हाइट गार्ड के स्वयंसेवकों ने सबसे आगे रहकर जान-माल की रक्षा की।'),
  ('myth-12', 2, 'दिल्ली हिंसा और कोरोना लॉकडाउन में MYL ने उत्तर भारत में हज़ारों परिवारों को राहत सामग्री और मकान दिए।'),
  ('myth-12', 3, 'हमारी सेवा बिना किसी धर्म के भेदभाव के केवल इंसानियत के आधार पर की जाती है।'),

  ('myth-4', 1, 'MSF परिसरों में छात्र नेतृत्व सिखाती है और MYL युवाओं को जिम्मेदार लोकतांत्रिक नेतृत्व प्रदान करती है।'),
  ('myth-4', 2, 'व्हाइट गार्ड आपदा राहत, शांति व्यवस्था और अनुशासित जनसेवा के लिए समर्पित दस्ता है।'),
  ('myth-4', 3, 'लाइफ लिफ्ट यूपी के ग्रामीण युवाओं को निःशुल्क सिविल सेवा व करियर मार्गदर्शन देती है।'),

  ('myth-13', 1, '18 से 35 वर्ष का कोई भी भारतीय युवा जो संविधान और भाईचारे में विश्वास रखता है, MYL से जुड़ सकता है।'),
  ('myth-13', 2, 'सदस्य अपने इलाके में आरटीआई, कानूनी सहायता और छात्रवृत्ति कार्यों में भागीदारी करते हैं।'),
  ('myth-13', 3, 'सदस्यता पूरी तरह स्वैच्छिक, सत्यापित और पारदर्शी लोकतांत्रिक नियमों पर आधारित है।')
) AS v(legacy_id, sort_order, talking_point)
JOIN public.myth_faqs f ON f.legacy_id = v.legacy_id;

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
SELECT 'news-up-1','Muslim Youth League UP Ratifies 10-Point "Youth & Education Resolution" for Uttar Pradesh','मुस्लिम यूथ लीग उत्तर प्रदेश ने राज्य के युवाओं के लिए 10-सूत्रीय "तालीम एवं रोजगार प्रस्ताव" पारित किया','National President Adv. Sarfaraz Ahmed stated that MYL is building constructive grassroots leadership committed to Baba Saheb Ambedkar''s constitutional ideals.','राष्ट्रीय अध्यक्ष एडवोकेट सरफ़राज़ अहमद ने कहा कि MYL बाबासाहेब डॉ. आंबेडकर के संवैधानिक आदर्शों पर आधारित रचनात्मक व शिक्षित युवा नेतृत्व तैयार कर रही है।','Addressing the State Cadre Convention, the leadership ratified the historic 10-Point Resolution. Demands include restoring full post-matric scholarship allocations for OBC, Dalit, and minority students, establishing government degree colleges in educationally backward tehsils of Moradabad, Sambhal, Rampur, and Azamgarh, and launching district-level competitive examination coaching centres free of charge.','राज्य कार्यकर्ता सम्मेलन को संबोधित करते हुए नेतृत्व ने ऐतिहासिक 10-सूत्रीय प्रस्ताव पारित किया। इसमें ओबीसी, दलित और अल्पसंख्यक छात्रों की छात्रवृत्ति का शत-प्रतिशत वितरण, मुरादाबाद, संभल, रामपुर, और आज़मगढ़ की पिछड़ी तहसीलों में सरकारी डिग्री कॉलेज खोलने, और ज़िला स्तर पर निःशुल्क कोचिंग केंद्र स्थापित करने की मांग की गई है।',c.id,'2026-10-14'::date::timestamptz,3,'UP State Media Committee','उत्तर प्रदेश राज्य मीडिया समिति','Official Spokesperson','आधिकारिक प्रवक्ता',0,true
FROM public.news_categories c WHERE c.code='press_release'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,excerpt_en=excluded.excerpt_en,excerpt_hi=excluded.excerpt_hi,content_en=excluded.content_en,content_hi=excluded.content_hi,category_id=excluded.category_id,published_at=excluded.published_at,read_time_minutes=excluded.read_time_minutes,author_name_en=excluded.author_name_en,author_name_hi=excluded.author_name_hi,author_role_en=excluded.author_role_en,author_role_hi=excluded.author_role_hi,share_count=excluded.share_count,is_published=true,updated_at=now();

DELETE FROM public.news_post_tags WHERE news_post_id=(SELECT id FROM public.news_posts WHERE legacy_id='news-up-1');
INSERT INTO public.news_tags(name) VALUES ('MuslimYouthLeague'), ('UPYouth'), ('EducationRights'), ('LifeLift') ON CONFLICT(name) DO NOTHING;
INSERT INTO public.news_post_tags(news_post_id,tag_id)
SELECT p.id,t.id FROM public.news_posts p CROSS JOIN public.news_tags t
WHERE p.legacy_id='news-up-1' AND t.name IN ('MuslimYouthLeague', 'UPYouth', 'EducationRights', 'LifeLift');

INSERT INTO public.news_posts (legacy_id,title_en,title_hi,excerpt_en,excerpt_hi,content_en,content_hi,category_id,published_at,read_time_minutes,author_name_en,author_name_hi,author_role_en,author_role_hi,share_count,is_published)
SELECT 'news-up-2','MSF Launches Statewide "Campus Helpline" for Post-Matric Minority & Dalit Scholarships','MSF ने उत्तर प्रदेश के छात्रों हेतु "कैंपस छात्रवृत्ति सहायता हेल्पलाइन" का शुभारंभ किया','Dedicated student volunteer desks established across universities and degree colleges to assist students with online portal verification and documentation.','विश्वविद्यालयों व महाविद्यालयों में छात्रों के ऑनलाइन पोर्टल सत्यापन और दस्तावेजीकरण में सहायता हेतु समर्पित छात्र सहायता डेस्क स्थापित।','Muslim Students Federation (MSF) units in Aligarh, Lucknow, Varanasi, and Meerut have initiated direct student assistance desks. The initiative aims to prevent thousands of eligible students from losing vital educational aid due to portal technical errors and red tape.','मुस्लिम स्टूडेंट्स फेडरेशन (MSF) ने अलीगढ़, लखनऊ, वाराणसी और मेरठ के कॉलेजों में सीधी सहायता डेस्क शुरू की है, ताकि तकनीकी खामियों और प्रशासनिक लेटलतीफी के कारण किसी भी योग्य छात्र की छात्रवृत्ति न रुके।',c.id,'2026-10-11'::date::timestamptz,3,'MSF State Secretariat','MSF प्रदेश सचिवालय','Student Affairs Secretary','छात्र कल्याण सचिव',0,true
FROM public.news_categories c WHERE c.code='ground_action'
ON CONFLICT (legacy_id) DO UPDATE SET title_en=excluded.title_en,title_hi=excluded.title_hi,excerpt_en=excluded.excerpt_en,excerpt_hi=excluded.excerpt_hi,content_en=excluded.content_en,content_hi=excluded.content_hi,category_id=excluded.category_id,published_at=excluded.published_at,read_time_minutes=excluded.read_time_minutes,author_name_en=excluded.author_name_en,author_name_hi=excluded.author_name_hi,author_role_en=excluded.author_role_en,author_role_hi=excluded.author_role_hi,share_count=excluded.share_count,is_published=true,updated_at=now();

DELETE FROM public.news_post_tags WHERE news_post_id=(SELECT id FROM public.news_posts WHERE legacy_id='news-up-2');
INSERT INTO public.news_tags(name) VALUES ('MSF'), ('ScholarshipHelp'), ('StudentEmpowerment') ON CONFLICT(name) DO NOTHING;
INSERT INTO public.news_post_tags(news_post_id,tag_id)
SELECT p.id,t.id FROM public.news_posts p CROSS JOIN public.news_tags t
WHERE p.legacy_id='news-up-2' AND t.name IN ('MSF', 'ScholarshipHelp', 'StudentEmpowerment');

COMMIT;

-- Expose only aggregate RSVP counts publicly; never expose individual RSVP identities.
CREATE OR REPLACE VIEW public.event_rsvp_counts AS
SELECT event_id, COUNT(*)::integer AS rsvp_count
FROM public.event_rsvps
GROUP BY event_id;
GRANT SELECT ON public.event_rsvp_counts TO anon, authenticated;
