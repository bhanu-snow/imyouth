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
    { step: 1, title: { en: 'Origins & purpose', hi: 'इतिहास व उद्देश्य' } },
    { step: 2, title: { en: 'Kerala & public record', hi: 'केरल व सार्वजनिक रिकॉर्ड' } },
    { step: 3, title: { en: 'UP & civic values', hi: 'यूपी व नागरिक मूल्य' } },
    { step: 4, title: { en: 'Questions & answers', hi: 'सवाल-जवाब' } },
    { step: 5, title: { en: 'Membership request', hi: 'सदस्यता अनुरोध' } },
  ];

  const selectedFaq = faqs.find((faq) => faq.id === selectedFaqId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-blue-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'hi' ? 'संगठन परिचय व सदस्यता मार्गदर्शिका' : 'Organization Overview & Membership Guide'}</span>
          <span aria-hidden="true">·</span>
          <span>उत्तर प्रदेश (UP Unit)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'परिचय से सदस्यता अनुरोध तक'
            : 'From an informed introduction to a membership request'}
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
          {lang === 'hi'
            ? 'इतिहास और सार्वजनिक रिकॉर्ड से शुरुआत करें, सवालों के लिए प्रकाशित स्रोत देखें, और रुचि होने पर ही व्यक्ति की सहमति से आवेदन दर्ज करें।'
            : 'Start with the history and public record, use published sources to answer questions, and record an application only when the person chooses to proceed.'}
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

      {/* STEP 1: HISTORY, FOUNDERS, AND STATED PURPOSE */}
      {activeStep === 1 && (
        <section className="space-y-5 animate-fade-in">
          <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Landmark className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {lang === 'hi' ? 'चरण 1: शुरुआत, संस्थापक और विचार' : 'Step 1: Origins, founders & stated purpose'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  {lang === 'hi' ? 'इतिहास से शुरुआत करें — किसी तैयार भाषण से नहीं' : 'Start with the history, not a scripted pitch'}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-700">
              {lang === 'hi'
                ? 'इंडियन यूनियन मुस्लिम लीग (IUML) का गठन 10 मार्च 1948 को मद्रास में हुआ। क़ायदे-मिल्लत मुहम्मद इस्माइल इसके संस्थापक अध्यक्ष थे। बी. पोकर साहब बहादुर सहित संविधान सभा और शुरुआती संसद से जुड़े नेताओं के रिकॉर्ड भी उपलब्ध हैं। इन प्रविष्टियों को उनके साथ दिए गए संदर्भों के साथ पढ़ें; असहमति हो तो मूल अभिलेख देखें।'
                : 'The Indian Union Muslim League (IUML) was formed in Madras on 10 March 1948, with Quaid-e-Millath Muhammad Ismail as its founding president. Records also cover leaders such as B. Pocker Sahib Bahadur, who served in the Constituent Assembly and early Parliament. Read each entry alongside its citation, and consult the original record when a detail is disputed.'}
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h3 className="font-bold text-emerald-950">{lang === 'hi' ? 'किस उद्देश्य से?' : 'Why was it formed?'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {lang === 'hi'
                  ? 'पार्टी का सार्वजनिक परिचय भारतीय संविधान, धर्मनिरपेक्ष लोकतंत्र, नागरिक अधिकारों और शिक्षा-सांस्कृतिक अधिकारों के दायरे में पढ़ें। इन्हें पार्टी के घोषित विचारों के रूप में प्रस्तुत करें; किसी ऐतिहासिक बहस या संस्थागत उपलब्धि का दावा करते समय स्रोत साथ रखें।'
                  : 'Read the party’s public position in the context of the Constitution, secular democracy, civil rights, and educational and cultural rights. Present these as the party’s stated commitments; cite a source for claims about historical debates or institutional achievements.'}
              </p>
            </article>
            <article className="rounded-xl border border-blue-200 bg-blue-50/70 p-5">
              <h3 className="font-bold text-blue-950">{lang === 'hi' ? 'दृष्टि व मिशन' : 'Stated vision & mission'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {lang === 'hi'
                  ? 'MYL, IUML का युवा संगठन है। उसका काम, कार्यक्रम और पद-संरचना स्थानीय रिकॉर्ड के अनुसार समझाएं। किसी सेवा, संस्था या उपलब्धि को MYL/IUML से जोड़ने से पहले उसका आधिकारिक दस्तावेज़ और तारीख जांचें।'
                  : 'MYL is IUML’s youth organization. Explain its work, programs, and organizational structure using current local records. Before attributing a service, institution, or achievement to MYL/IUML, verify its official documentation and date.'}
              </p>
            </article>
          </div>

          <aside className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-amber-950">
              {lang === 'hi'
                ? 'मूल स्रोत: संविधान सभा बहस, लोकसभा/राज्यसभा अभिलेख और संगठन के आधिकारिक प्रकाशन। अप्रमाणित संख्या, उद्धरण या “लगातार हर सदन में” जैसे व्यापक दावे न दोहराएं।'
                : 'Prefer primary sources: Constituent Assembly debates, Lok Sabha/Rajya Sabha records, and official organizational publications. Avoid unsourced figures, quotations, or broad claims such as uninterrupted presence in every House.'}
            </p>
            <button type="button" onClick={onNavigateToEvidence} className="shrink-0 rounded-lg bg-blue-950 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900">
              {lang === 'hi' ? 'नेता व संसदीय साक्ष्य देखें' : 'Open leaders & parliamentary records'}
            </button>
          </aside>

          <div className="flex justify-end">
            <button type="button" onClick={() => setActiveStep(2)} className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
              <span>{lang === 'hi' ? 'आगे: केरल का अनुभव' : 'Next: Kerala’s public record'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: KERALA PUBLIC RECORD AND COALITIONS */}
      {activeStep === 2 && (
        <section className="space-y-5 animate-fade-in">
          <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-blue-50 p-2 text-blue-900"><Landmark className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  {lang === 'hi' ? 'चरण 2: केरल — संस्थाएं, प्रतिनिधित्व और गठबंधन' : 'Step 2: Kerala — institutions, representation & coalitions'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  {lang === 'hi' ? 'उदाहरण को रिकॉर्ड और स्रोतों से समझें' : 'Understand the example through records and sources'}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-700">
              {lang === 'hi'
                ? 'केरल के IUML अनुभव को समझाते समय विधानसभा और संसद के कार्यकाल, सार्वजनिक संस्थाओं, शिक्षा व सामाजिक सेवा के काम और गठबंधन की भूमिका को अलग-अलग देखें। प्रत्येक संस्था या उपलब्धि के लिए उसका अपना आधिकारिक स्रोत, समयावधि और जिम्मेदार संगठन दिखाएं।'
                : 'When describing IUML’s Kerala experience, distinguish legislative terms, public institutions, education and social-service work, and coalition participation. For every institution or achievement, identify its own official source, time period, and responsible organization.'}
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <Landmark className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'विधानमंडल और संसद' : 'Legislatures & Parliament'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'सांसद/विधायक, कार्यकाल, सदन में योगदान और मतदान को संबंधित आधिकारिक सदन रिकॉर्ड से सत्यापित करें। पार्टी की प्रोफ़ाइल में उपलब्ध संदर्भ खोलें।'
                  : 'Verify representatives, terms, interventions, and votes against the relevant official House records. Open the citations attached to the party’s parliamentary profiles.'}
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <HeartHandshake className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'संस्थाएं और जनसेवा' : 'Institutions & public service'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'शिक्षा, स्वास्थ्य, सहकारी और सामाजिक सेवा संस्थाओं की सूची आधिकारिक वार्षिक रिपोर्ट या संस्था के अभिलेख से बनाएं। यहां अभी प्रमाणित संस्थागत सूची उपलब्ध न हो तो उसे उपलब्धि के रूप में दावा न करें।'
                  : 'Build any list of education, health, cooperative, or social-service institutions from official annual reports or institutional records. If a verified institutional list is not available here, do not present it as a proven achievement.'}
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-5 md:col-span-2">
              <Scale className="h-5 w-5 text-blue-900" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'UDF और गठबंधन संबंध' : 'UDF and coalition relationships'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'गठबंधन चुनाव और समय के साथ बदलते हैं। UDF, कांग्रेस या किसी अन्य दल के साथ संबंध बताते समय चुनाव-वर्ष, औपचारिक घोषणा और विश्वसनीय स्रोत दें। TVK सहित किसी वर्तमान सहयोग को ताज़ा प्राथमिक स्रोत से पुष्ट किए बिना न बताएं।'
                  : 'Coalitions change by election and over time. When describing relationships with the UDF, Congress, or another party, give the election year, formal announcement, and a reliable source. Do not assert a current arrangement—including one involving TVK—without a recent primary source.'}
              </p>
            </article>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-blue-950">
              {lang === 'hi'
                ? '“केरल मॉडल” को नारे की तरह नहीं, सत्यापित रिकॉर्ड और संस्थाओं के उदाहरणों के साथ समझाएं।'
                : 'Explain the “Kerala model” with verifiable records and institutional examples, not as an unsupported slogan.'}
            </p>
            <button type="button" onClick={onNavigateToEvidence} className="shrink-0 rounded-lg bg-blue-950 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900">
              {lang === 'hi' ? 'संसदीय व गठबंधन रिकॉर्ड खोलें' : 'Open parliamentary & coalition records'}
            </button>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setActiveStep(1)} className="rounded-lg bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200">{lang === 'hi' ? 'पीछे' : 'Back'}</button>
            <button type="button" onClick={() => setActiveStep(3)} className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
              <span>{lang === 'hi' ? 'आगे: उत्तर प्रदेश का संदर्भ' : 'Next: Uttar Pradesh context'}</span><ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: UTTAR PRADESH AND NON-PARTISAN CIVIC CONTEXT */}
      {activeStep === 3 && (
        <section className="space-y-5 animate-fade-in">
          <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Users className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {lang === 'hi' ? 'चरण 3: यूपी में नागरिक संदर्भ' : 'Step 3: Civic context in Uttar Pradesh'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  {lang === 'hi' ? 'समान सम्मान, संवैधानिक अधिकार और प्रतिनिधित्व' : 'Equal dignity, constitutional rights & representation'}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-700">
              {lang === 'hi'
                ? 'मोहल्ले या वार्ड में पहले लोगों की प्राथमिकताएं सुनें। शिक्षा, रोजगार, सुरक्षा, भेदभाव और सार्वजनिक सेवाओं पर उपलब्ध तथ्य रखें; मुस्लिम, दलित या किसी अन्य समुदाय की राय को एक जैसा न मानें। व्यक्तिगत अनुभव और आधिकारिक आंकड़े अलग-अलग बताएं।'
                : 'In a neighborhood or ward, begin by listening to people’s priorities. Bring documented information on education, employment, safety, discrimination, and public services; do not assume Muslims, Dalits, or any other community shares one view. Distinguish personal experience from official data.'}
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'धर्मनिरपेक्षता व बहुलता' : 'Secularism & pluralism'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'किसी धर्म या समुदाय के विरुद्ध नफरत को बढ़ावा न दें। संविधान और कानून के तहत सभी की बराबर गरिमा, स्वतंत्रता और सुरक्षा की बात करें; हिंसा या सामूहिक दोषारोपण का समर्थन न करें।'
                  : 'Do not amplify hostility toward any religion or community. Discuss equal dignity, liberty, and protection under the Constitution and law; do not endorse violence or collective blame.'}
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-5">
              <Scale className="h-5 w-5 text-blue-900" />
              <h3 className="mt-3 font-bold text-stone-900">{lang === 'hi' ? 'दल और विचारों की निष्पक्ष तुलना' : 'Compare parties and ideas fairly'}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {lang === 'hi'
                  ? 'BJP, शिवसेना, AIMIM, IUML या किसी भी दल पर बात हो तो समान आधार लें: आधिकारिक घोषणापत्र, सार्वजनिक नीतियां, कानून/मतदान रिकॉर्ड और दिनांकित गठबंधन घोषणाएं। आरोप, विशेषण या नीयत के दावे तभी रखें जब विश्वसनीय स्रोत हों; असहमति को सम्मान से रखें।'
                  : 'For BJP, Shiv Sena, AIMIM, IUML, or any other party, use the same measures: official manifestos, public policies, legislative/voting records, and dated coalition announcements. Include allegations or claims about intent only when backed by reliable sources, and present disagreement respectfully.'}
              </p>
            </article>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs leading-relaxed text-stone-700">
            {lang === 'hi'
              ? 'स्थानीय कार्यवाही: सुनें → मुद्दे और सहमति दर्ज करें → सार्वजनिक स्रोत साझा करें → सवाल अनुत्तरित हों तो सही पदाधिकारी तक पहुंचाएं। सदस्यता आमंत्रण वैकल्पिक है और व्यक्ति की स्पष्ट सहमति से ही आगे बढ़ना चाहिए।'
              : 'A useful local sequence: listen → note issues and areas of agreement → share public sources → route unanswered questions to the right officer. A membership invitation is optional and should proceed only with the person’s clear consent.'}
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setActiveStep(2)} className="rounded-lg bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200">{lang === 'hi' ? 'पीछे' : 'Back'}</button>
            <button type="button" onClick={() => setActiveStep(4)} className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
              <span>{lang === 'hi' ? 'आगे: सामान्य सवाल' : 'Next: common questions'}</span><ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: QUESTIONS AND SOURCE-LED ANSWERS */}
      {activeStep === 4 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              {lang === 'hi' ? 'चरण 4: सवाल, जवाब और संदर्भ' : 'Step 4: Questions, answers & references'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi'
                ? 'सवाल का जवाब प्रकाशित स्रोत से दें'
                : 'Answer questions with published sources'}
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
              <span>{lang === 'hi' ? 'आगे: सदस्यता अनुरोध' : 'Next: membership request'}</span>
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
              {lang === 'hi' ? 'चरण 5: व्यक्ति की सहमति से आवेदन' : 'Step 5: A request only with consent'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi' ? 'सदस्यता आवेदन दर्ज करें' : 'Record a membership request'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {lang === 'hi' ? '1. अनुरोध दर्ज करें' : '1. Submit a request'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'व्यक्ति की स्पष्ट अनुमति लेकर उसका नाम, फ़ोन और ज़िला दर्ज करें। आवेदन लंबित रहेगा; अधिकृत अधिकारी की स्वीकृति के बाद ही सदस्यता सक्रिय होगी और आईडी जारी होगी।'
                  : 'With the person’s clear permission, enter their name, phone, and district. The request remains pending; membership becomes active and an ID is issued only after authorized approval.'}
              </p>
              <button
                type="button"
                onClick={onNavigateToMembership}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'अनुरोध फॉर्म खोलें' : 'Open request form'}
              </button>
            </div>

            {isLoggedIn && (
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? '2. आधिकारिक सूचना साझा करें' : '2. Share an official update'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {lang === 'hi'
                    ? 'पार्टी का परिचय, रैलियां और आधिकारिक प्रेस विज्ञप्तियां व्हाट्सएप ग्रुप, टेलीग्राम और ट्विटर पर एक क्लिक में साझा करें।'
                    : 'Broadcast announcements to WhatsApp, Telegram, X, Facebook, and download high-res Instagram graphic cards in 1 click.'}
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
