import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Share2, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  Award,
  Landmark,
  Scale,
  HeartHandshake
} from 'lucide-react';
import { Language, MythFaqItem } from '../types';
import { faqService } from '../services/faqService';

interface Props {
  lang: Language;
  isLoggedIn: boolean;
  onNavigateToMembership: () => void;
  onNavigateToBroadcast: () => void;
  onNavigateToEvidence: () => void;
}

export const CadreWorkflowToolkit: React.FC<Props> = ({ 
  lang, 
  isLoggedIn,
  onNavigateToMembership, 
  onNavigateToBroadcast,
  onNavigateToEvidence,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [faqs, setFaqs] = useState<MythFaqItem[]>([]);
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);
  const [faqError, setFaqError] = useState('');
  const [faqStaleMessage, setFaqStaleMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    const refreshFaqs = async () => {
      try {
        const result = await faqService.loadPublished();
        if (!cancelled) {
          setFaqs(result.items);
          setFaqError('');
          setFaqStaleMessage(result.stale ? result.message ?? 'Showing saved FAQ content while the latest version is unavailable.' : '');
          setSelectedFaqId((current) => current && result.items.some((faq) => faq.id === current) ? current : (result.items[0]?.id ?? null));
        }
      } catch (error) {
        if (!cancelled) setFaqError(error instanceof Error ? error.message : 'Could not load FAQs.');
      }
    };
    const handleFocus = () => { void refreshFaqs(); };
    void refreshFaqs();
    window.addEventListener('focus', handleFocus);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const steps = [
    { step: 1, title: { en: 'History, Founders & Mission', hi: 'इतिहास, संस्थापक व मिशन' } },
    { step: 2, title: { en: 'Kerala, TN & Alliances', hi: 'केरल, तमिलनाडु व गठबंधन' } },
    { step: 3, title: { en: 'UP & Institutional Rights', hi: 'यूपी व संस्थागत अधिकार' } },
    { step: 4, title: { en: 'Questions & Answers', hi: 'सवाल-जवाब' } },
    { step: 5, title: { en: 'Membership Request', hi: 'सदस्यता अनुरोध' } },
  ];

  const selectedFaq = faqs.find((faq) => faq.id === selectedFaqId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-blue-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'hi' ? 'मुस्लिम यूथ लीग (MYL) — जनसंपर्क व सदस्यता मार्गदर्शिका' : 'Muslim Youth League (MYL) — Outreach & Membership Guide'}</span>
          <span aria-hidden="true">·</span>
          <span>उत्तर प्रदेश (UP Unit)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'संवैधानिक जागरूकता से सक्रिय सदस्यता तक'
            : 'From Constitutional Awareness to Active Membership'}
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
          {lang === 'hi'
            ? 'पार्टी के इतिहास, दक्षिण भारत में संस्थागत विकास और गठबंधन मॉडल को साझा करें, आरटीआई, पुलिस व मंत्रालयों के ज़रिए हक़ दिलाएं, और सहमति से MYL सदस्यता जोड़ें।'
            : 'Introduce our 1948 founding, Kerala & Tamil Nadu governance record, alliances realizing Babasaheb’s dream, and empower UP youth with institutional remedies.'}
        </p>

        {/* Workflow Steps Indicator Bar */}
        <div className="grid grid-cols-2 gap-2 pt-6 mt-6 border-t border-emerald-800/80 md:grid-cols-5">
          {steps.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              aria-current={activeStep === s.step ? 'step' : undefined}
              className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                activeStep === s.step
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
              }`}
            >
              <div className="mb-1 text-[10px] font-bold opacity-70">{s.step} / {steps.length}</div>
              <div className="text-[11px] font-medium">{s.title[lang]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: HISTORY, FOUNDERS, MOTTO, VISION AND MISSION */}
      {activeStep === 1 && (
        <section className="space-y-5 animate-fade-in">
          <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Landmark className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {lang === 'hi' ? 'चरण 1: इतिहास, संस्थापक, आदर्श वाक्य व मिशन' : 'Step 1: History, Founders, Motto, Vision & Mission'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  {lang === 'hi' ? 'बुनियाद और नेतृत्व की विरासत' : 'Foundational Heritage & Leadership'}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-700">
              {lang === 'hi'
                ? 'इंडियन यूनियन मुस्लिम लीग (IUML) की स्थापना आज़ाद भारत में 10 मार्च 1948 को मद्रास (चेन्नई) में कायदे-मिल्लत एम. मुहम्मद इस्माइल साहिब, के.एम. सीथी साहिब और बी. पोकर साहिब के नेतृत्व में हुई। बाद में बाफ़क़ी तंगल, सैय्यद मुहम्मदाली शिहाब तंगल और सी.एच. मुहम्मद कोया ने इसे शांति, सामाजिक सौहार्द और संस्थागत राजनीति का मज़बूत स्तम्भ बनाया। युवाओं, छात्रों और पेशेवरों को संगठित करने के लिए 1973 में मुस्लिम यूथ लीग (MYL) का गठन हुआ।'
                : 'The Indian Union Muslim League (IUML) was founded in sovereign independent India on 10 March 1948 in Madras (Chennai) by visionary leaders led by Quaid-e-Millath M. Muhammad Ismail Sahib, alongside stalwarts like K.M. Seethi Sahib and B. Pocker Sahib. Following them, leaders like Panakkad Syed Ummer Bafaqy Thangal, Panakkad Syed Mohammadali Shihab Thangal, and C.H. Mohammed Koya strengthened its foundation of communal amity and institutional politics. In 1973, the Muslim Youth League (MYL) was formed to mobilize students, professionals, and youth.'}
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h3 className="font-bold text-emerald-950">{lang === 'hi' ? 'आदर्श वाक्य व चुनाव चिन्ह' : 'Motto & Symbol'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {lang === 'hi'
                  ? 'हमारा आदर्श वाक्य है: "एकता, सामाजिक सद्भाव और प्रगति"। हमारा प्रतीक "सीढ़ी" (Ladder) समाज के सबसे वंचित और पिछड़े वर्गों को शिक्षा, आत्मसम्मान और आर्थिक स्वावलंबन की सीढ़ियों के ज़रिए ऊपर उठाने का प्रतिनिधित्व करता है।'
                  : '"Unity, Harmony, and Progress". Our symbol—the Ladder—represents the step-by-step socio-economic elevation, educational advancement, and empowerment of the most backward and marginalized sections.'}
              </p>
            </article>
            <article className="rounded-xl border border-blue-200 bg-blue-50/70 p-5">
              <h3 className="font-bold text-blue-950">{lang === 'hi' ? 'दृष्टिकोण व मिशन' : 'Stated Vision & Mission'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {lang === 'hi'
                  ? 'भारत के संविधान और लोकतांत्रिक संस्थाओं के दायरे में रहकर अल्पसंख्यकों, दलितों और शोषित वर्गों के अधिकारों की रक्षा करना; साम्प्रदायिक सद्भाव बनाना; और पिछड़े समुदायों को शिक्षित, संस्थागत रूप से प्रतिनिधित्व प्राप्त और आत्मनिर्भर नागरिक बनाना।'
                  : 'To safeguard democratic and constitutional rights through dialogue and rule of law; to build communal peace; to turn backward minorities and marginalized groups into educated, institutionally represented, self-reliant citizens.'}
              </p>
            </article>
          </div>

          <aside className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-amber-950">
              {lang === 'hi'
                ? 'संविधान सभा बहसों और 1948 से आज तक के संसदीय रिकॉर्ड हमारे उसूलों के गवाह हैं: हम खोखली बयानबाज़ी नहीं, बल्कि दस्तावेज़ी और संस्थागत राजनीति पर विश्वास करते हैं।'
                : 'Primary records from the Constituent Assembly debates to seven decades of parliamentary proceedings attest to our constructive, institutional, and democratic constitutional politics.'}
            </p>
            <button type="button" onClick={onNavigateToEvidence} className="shrink-0 rounded-lg bg-blue-950 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900">
              {lang === 'hi' ? 'नेता व संसदीय साक्ष्य देखें' : 'Open leaders & parliamentary records'}
            </button>
          </aside>

          <div className="flex justify-end">
            <button type="button" onClick={() => setActiveStep(2)} className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
              <span>{lang === 'hi' ? 'आगे: केरल, तमिलनाडु व गठबंधन' : 'Next: Kerala, TN & Alliances'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: OUR SUCCESS IN KERALA, TAMIL NADU AND COALITIONS */}
      {activeStep === 2 && (
        <section className="space-y-5 animate-fade-in">
          <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-blue-50 p-2 text-blue-900"><Landmark className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  {lang === 'hi' ? 'चरण 2: केरल, तमिलनाडु में सफलता व अम्बेडकरवादी-लोकतांत्रिक गठबंधन' : 'Step 2: Success in Kerala, Tamil Nadu & Democratic Alliances'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  {lang === 'hi' ? 'संस्थागत ताकत और सत्ता में हिस्सेदारी' : 'Institutional Strength and Power-Sharing'}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-700">
              {lang === 'hi'
                ? 'केरल और तमिलनाडु में IUML और MYL ने साबित किया है कि अल्पसंख्यक और दबे-कुचले वर्ग केवल किसी का वोट बैंक नहीं, बल्कि सरकार और संस्थाओं में हिस्सेदार बनकर नीति-निर्माण कर सकते हैं। बाबा साहेब डॉ. भीमराव अम्बेडकर के सपनों को साकार करने के लिए हम राष्ट्रीय और क्षेत्रीय स्तर पर धर्मनिरपेक्ष ताकतों के साथ सक्रिय भागीदारी निभाते हैं।'
                : 'In Kerala and Tamil Nadu, IUML and MYL have demonstrated that minorities and oppressed classes need not remain a neglected vote-bank. Instead, they can govern, build universities, and shape administrative policy. We align with democratic forces to realize Babasaheb Dr. B.R. Ambedkar’s vision of social democracy and equal representation.'}
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <Landmark className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'केरल मॉडल: शिक्षा व संस्थागत क्रांति' : 'The Kerala Model: Educational Revolution'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'जब सी.एच. मुहम्मद कोया शिक्षा मंत्री बने, तो पिछड़े मल्लपुरम में कालीकट यूनिवर्सिटी स्थापित हुई और हज़ारों स्कूल-कॉलेज खोले गए। आज केरल के अल्पसंख्यक शिक्षा, स्वास्थ्य और सामाजिक विकास में देश के अग्रणी पायदान पर हैं।'
                  : 'Under leadership like Education Minister C.H. Mohammed Koya, the party established the University of Calicut in Malappuram and built thousands of schools and colleges, converting backward pockets into educational powerhouses.'}
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <HeartHandshake className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'तमिलनाडु व सामाजिक न्याय का विस्तार' : 'Tamil Nadu & Social Justice Expansion'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'तमिलनाडु में IUML और MYL ने द्रविड़ियन, पिछड़े और धर्मनिरपेक्ष आंदोलनों के साथ मिलकर लगातार विधायी और संसदीय प्रतिनिधित्व बनाए रखा है, जिससे वंचित वर्गों के अधिकारों को संवैधानिक सुरक्षा मिली है।'
                  : 'In Tamil Nadu, IUML and MYL maintain strong legislative and parliamentary representation while building firm solidarity with Dravidian, backward-class, and secular formations to secure rights through the system.'}
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-5 md:col-span-2">
              <Scale className="h-5 w-5 text-blue-900" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'अम्बेडकर के सपने से राहुल गांधी व नए क्षेत्रीय नेतृत्व तक' : 'From Babasaheb Ambedkar to Rahul Gandhi & Regional Coalitions'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'बाबा साहेब अम्बेडकर के सामाजिक भाईचारे और प्रतिनिधित्व के सिद्धांत से लेकर राहुल गांधी और तमिलनाडु में टीवीके जैसे उभरते प्रगतिशील नेतृत्व तक, हमारी रणनीति खोखले नारों की नहीं, बल्कि नीति-मंचों पर बैठकर सत्ता में बराबरी की भागीदारी हासिल करने की है।'
                  : 'Rooted in Dr. B.R. Ambedkar’s constitutional doctrine of fraternity and equal representation, we collaborate nationally with secular leaders like Rahul Gandhi and emerging regional platforms (including Tamil Nadu’s TVK) to govern, legislate, and ensure minority voices directly steer policy.'}
              </p>
            </article>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-blue-950">
              {lang === 'hi'
                ? 'केरल और तमिलनाडु की सफलता यह सिखाती है कि केवल शिकायत करने से बदलाव नहीं आता; जब समुदाय संस्थाएं खड़ी करता है, तभी अधिकार सुरक्षित होते हैं।'
                : 'Southern success demonstrates that community empowerment comes from building institutions, legal desks, and educational infrastructure, not mere rhetorical protests.'}
            </p>
            <button type="button" onClick={onNavigateToEvidence} className="shrink-0 rounded-lg bg-blue-950 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900">
              {lang === 'hi' ? 'संसदीय व गठबंधन रिकॉर्ड खोलें' : 'Open parliamentary & coalition records'}
            </button>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setActiveStep(1)} className="rounded-lg bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200">{lang === 'hi' ? 'पीछे' : 'Back'}</button>
            <button type="button" onClick={() => setActiveStep(3)} className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
              <span>{lang === 'hi' ? 'आगे: उत्तर प्रदेश व संस्थागत अधिकार' : 'Next: UP & Institutional Rights'}</span><ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: UTTAR PRADESH AND INSTITUTIONAL RIGHTS */}
      {activeStep === 3 && (
        <section className="space-y-5 animate-fade-in">
          <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Users className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {lang === 'hi' ? 'चरण 3: उत्तर प्रदेश में सम्मान, अधिकार व संस्थागत समाधान' : 'Step 3: Equal Respect, Democratic Rights & Institutional Solutions in UP'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  {lang === 'hi' ? 'थानों, आरटीआई और मंत्रालयों से हक़ की लड़ाई' : 'Enforcing Rights Through RTI, Police Accountability & Ministries'}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-700">
              {lang === 'hi'
                ? 'उत्तर प्रदेश में दशकों से अल्पसंख्यकों और शोषित वर्गों को डर के साए में रखकर केवल वोट लिया गया, लेकिन उनकी संस्थागत शक्ति नहीं बनाई गई। मुस्लिम यूथ लीग (MYL) उत्तर प्रदेश के नौजवानों को ऐसा कानूनी व संस्थागत सुरक्षा घेरा देगी, जिससे वे डरने के बजाय संविधान की ताक़त से अपना हक़ हासिल कर सकें।'
                : 'In Uttar Pradesh, communities have faced persistent marginalization and fear, often treated merely as vote-banks without institutional leverage. The Muslim Youth League (MYL) equips UP youth with constitutional literacy and administrative access, transforming fear into organized civic power.'}
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'आरटीआई (RTI) और विधिक सहायता डेस्क' : 'RTI Clinics & Legal Aid Desks'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'वार्ड और ब्लॉक स्तर पर आरटीआई हेल्पडेस्क स्थापित कर वक्फ संपत्ति, अल्पसंख्यक कल्याण फंड, छात्रवृत्ति और सरकारी योजनाओं के क्रियान्वयन में पूर्ण पारदर्शिता और जवाबदेही तय करना।'
                  : 'Establishing grassroots RTI and legal aid clinics to monitor minority welfare funds, unblock scholarship disbursements, audit waqf properties, and demand departmental transparency.'}
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <Scale className="h-5 w-5 text-blue-900" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'पुलिस और प्रशासनिक जवाबदेही' : 'Police & Administrative Accountability'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'MYL कार्यकर्ताओं को कानूनी रूप से प्रशिक्षित किया जाएगा ताकि थानों में निष्पक्ष सुनवाई, समय पर एफआईआर दर्ज कराना और गैरकानूनी उत्पीड़न व हिरासत के खिलाफ त्वरित कानूनी मदद दी जा सके।'
                  : 'Training youth cadres as civic defenders who assist citizens at police stations, secure fair FIR registrations, insist on due statutory process, and halt arbitrary harassment.'}
              </p>
            </article>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs leading-relaxed text-stone-700">
            {lang === 'hi'
              ? 'मंत्रालयों व विभागों का सीधा लाभ: अल्पसंख्यक आयोग, कौशल विकास और स्वरोजगार योजनाओं को बिचौलियों से मुक्त कर सीधे ज़रूरतमंद परिवारों तक पहुंचाना ही MYL की प्राथमिक ज़मीनी रणनीति है।'
              : 'Direct ministerial access: Connecting marginalized youth directly with welfare boards, skill development councils, and educational schemes without predatory intermediaries.'}
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setActiveStep(2)} className="rounded-lg bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200">{lang === 'hi' ? 'पीछे' : 'Back'}</button>
            <button type="button" onClick={() => setActiveStep(4)} className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
              <span>{lang === 'hi' ? 'आगे: सामान्य सवाल' : 'Next: Common Questions'}</span><ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: QUESTIONS AND SOURCE-LED ANSWERS */}
      {activeStep === 4 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              {lang === 'hi' ? 'चरण 4: सवाल, जवाब और संदर्भ' : 'Step 4: Questions, Answers & References'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi'
                ? 'तथ्यों और आधिकारिक स्रोतों से जवाब दें'
                : 'Answer Questions with Published Facts & Sources'}
            </h2>
          </div>

          {faqError && (
            <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              {faqError}
            </div>
          )}
          {faqStaleMessage && (
            <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {faqStaleMessage}
            </div>
          )}

          {/* FAQ entries use the same revision-cached Supabase source as the public FAQ page. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {faqs.map((faq, index) => (
              <button
                key={faq.id}
                type="button"
                onClick={() => setSelectedFaqId(faq.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold text-left transition-all border ${
                  selectedFaqId === faq.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{`0${index + 1}. `}</span>
                <span>{lang === 'hi' ? faq.mythHi : faq.mythEn}</span>
              </button>
            ))}
          </div>

          {/* Active Myth Card */}
          {!selectedFaq && !faqError && (
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              {lang === 'hi' ? 'अभी कोई प्रकाशित FAQ उपलब्ध नहीं है।' : 'No published FAQs are available yet.'}
            </div>
          )}
          {selectedFaq && (
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
            <div className="p-3 bg-stone-100 border border-stone-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block">
                {lang === 'hi' ? 'सवाल:' : 'Question:'}
              </span>
              <h4 className="text-sm font-bold text-stone-950 mt-1">
                {lang === 'hi' ? selectedFaq.mythHi : selectedFaq.mythEn}
              </h4>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                {lang === 'hi' ? 'प्रकाशित जवाब:' : 'Published answer:'}
              </span>
              <p className="text-xs font-bold text-emerald-950 mt-1 leading-relaxed">
                {lang === 'hi' ? selectedFaq.factHi : selectedFaq.factEn}
              </p>
            </div>

            <div className="text-xs text-stone-700 leading-relaxed space-y-1.5 pt-2">
              <strong className="text-stone-900 block">
                {lang === 'hi' ? 'विस्तृत संदर्भ:' : 'Additional context:'}
              </strong>
              <p>{lang === 'hi' ? selectedFaq.detailedExplanationHi : selectedFaq.detailedExplanationEn}</p>
            </div>

            <div className="pt-3 border-t border-stone-200">
              <strong className="text-xs text-stone-900 block mb-2">
                {lang === 'hi' ? 'संदर्भ बिंदु:' : 'Reference notes:'}
              </strong>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {(lang === 'hi' ? selectedFaq.cadreTalkingPointsHi : selectedFaq.cadreTalkingPointsEn).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(5)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'आगे: सदस्यता आमंत्रण' : 'Next: Membership Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONSENT-BASED MEMBERSHIP REQUEST */}
      {activeStep === 5 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {lang === 'hi' ? 'चरण 5: बदलाव का हिस्सा बनें — सहमति से सदस्यता' : 'Step 5: Join the Journey — Membership with Consent'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi' ? 'मुस्लिम यूथ लीग (MYL) सदस्यता आवेदन' : 'Register for Muslim Youth League (MYL) Membership'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {lang === 'hi' ? '1. सदस्यता अनुरोध दर्ज करें' : '1. Submit Membership Request'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'नागरिक की पूर्ण सहमति से उनका नाम, मोबाइल नंबर और ज़िला दर्ज करें। पुष्टि के बाद डिजिटल सदस्यता कार्ड जारी होगा और उन्हें वार्ड/ज़िला MYL विंग से जोड़ा जाएगा।'
                  : 'With the citizen’s voluntary consent, enter their full name, contact number, and district. Upon verification, their official MYL membership card is issued and mapped to their local unit.'}
              </p>
              <button
                type="button"
                onClick={onNavigateToMembership}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'सदस्यता फॉर्म खोलें' : 'Open Membership Form'}
              </button>
            </div>

            {isLoggedIn && (
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? '2. आधिकारिक जागरूकता सामग्री साझा करें' : '2. Share Official Campaign Updates'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {lang === 'hi'
                    ? 'MYL के संवैधानिक विचार, आरटीआई सहायता मॉडल और सदस्यता अभियान को व्हाट्सएप, टेलीग्राम और सोशल मीडिया पर एक क्लिक में साझा करें।'
                    : 'Broadcast awareness materials, constitutional literature, and membership links across WhatsApp, Telegram, X, and Facebook in 1 click.'}
                </p>
                <button
                  type="button"
                  onClick={onNavigateToBroadcast}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'hi' ? 'सोशल मीडिया स्टूडियो खोलें' : 'Open Social Studio'}
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-start border-t border-stone-100 pt-4">
            <button type="button" onClick={() => setActiveStep(4)} className="rounded-lg bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200">
              {lang === 'hi' ? 'पीछे: सवाल-जवाब' : 'Back: questions & answers'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};