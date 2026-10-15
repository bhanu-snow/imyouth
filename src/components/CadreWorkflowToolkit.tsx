import React, { useState } from 'react';
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
  Copy,
  Check
} from 'lucide-react';
import { Language } from '../types';
import { MYTHS_AND_FAQS } from '../data/mythsFaqData';

interface Props {
  lang: Language;
  onNavigateToMembership: () => void;
  onNavigateToBroadcast: () => void;
}

export const CadreWorkflowToolkit: React.FC<Props> = ({ 
  lang, 
  onNavigateToMembership, 
  onNavigateToBroadcast 
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState<string>(MYTHS_AND_FAQS[0].id);

  const quickPitchEn = `🇮🇳 Assalamu Alaikum / Namaste! We represent the Muslim Youth League (MYL), the official youth movement of the Indian Union Muslim League (IUML) in Uttar Pradesh. 

Founded in independent India (10 March 1948 in Madras) by Quaid-e-Millath Muhammad Ismail (a member of India's Constituent Assembly alongside Dr. B.R. Ambedkar), our movement stands unconditionally for the Constitution of India, secular democracy, educational empowerment, and youth employment. 

Through MSF (Muslim Students Federation) in colleges and our "Life Lift" career mentorship initiative, we are working across UP districts to give young people educational scholarships, legal aid, and clean, dignified political leadership. Join us!`;

  const quickPitchHi = `🇮🇳 सलाम / नमस्ते! हम मुस्लिम यूथ लीग (MYL) उत्तर प्रदेश से हैं, जो आज़ाद भारत में 10 मार्च 1948 को संविधान सभा के सदस्य क़ायदे-मिल्लत मुहम्मद इस्माइल साहब द्वारा स्थापित "इंडियन यूनियन मुस्लिम लीग" (IUML) का आधिकारिक युवा संगठन है। 

हम बाबासाहेब डॉ. आंबेडकर के संविधान, धर्मनिरपेक्षता, सामाजिक न्याय और भाईचारे के प्रति पूरी तरह समर्पित हैं। कॉलेजों में MSF (मुस्लिम स्टूडेंट्स फेडरेशन) और हमारे "लाइफ लिफ्ट" करियर परामर्श अभियान के जरिए हम यूपी के युवाओं को तालीम, रोजगार, कानूनी अधिकार और एक साफ-सुथरा व संजीदा नेतृत्व प्रदान कर रहे हैं। हमारे साथ जुड़ें!`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(lang === 'hi' ? quickPitchHi : quickPitchEn);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleSharePitchWhatsApp = () => {
    const text = lang === 'hi' ? quickPitchHi : quickPitchEn;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n🔗 अधिक जानकारी व सदस्यता: ' + window.location.origin)}`;
    window.open(url, '_blank');
  };

  const selectedFaq = MYTHS_AND_FAQS.find((f) => f.id === selectedFaqId) || MYTHS_AND_FAQS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-blue-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'hi' ? 'कार्यकर्ता फील्ड वर्कफ़्लो व वैचारिक मार्गदर्शिका' : 'Field Cadre Briefing Workflow & Ideological Guide'}</span>
          <span aria-hidden="true">·</span>
          <span>उत्तर प्रदेश (UP Unit)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'पार्टी परिचय व वैचारिक प्रशिक्षण: 4-चरणीय फील्ड वर्कफ़्लो'
            : 'Party Introduction & Ideological Cadre Workflow (4 Steps)'}
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
          {lang === 'hi'
            ? 'जब हमारी टीमें उत्तर प्रदेश के ज़िलों, तहसीलों, कॉलेजों और मोहल्लों में पार्टी का परिचय दें, तो यह वर्कफ़्लो उन्हें सही ऐतिहासिक तथ्य, विंग्स की भूमिका और भ्रामक प्रचार का तुरंत व तार्किक जवाब देने में सक्षम बनाता है।'
            : 'A battle-tested field workflow for MYL and MSF cadres when introducing the party across UP districts, clarifying historical facts, explaining student/youth wings, and debunking disinformation.'}
        </p>

        {/* Workflow Steps Indicator Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6 mt-6 border-t border-emerald-800/80">
          {[
            { step: 1, title: { en: '1. 60-Sec Pitch', hi: '1. साठ-सेकंड परिचय' } },
            { step: 2, title: { en: '2. The 4 Wings', hi: '2. चारों प्रमुख विंग्स' } },
            { step: 3, title: { en: '3. Myth-Busters', hi: '3. भ्रांतियों का खंडन' } },
            { step: 4, title: { en: '4. Immediate Action', hi: '4. त्वरित एक्शन व आईडी' } },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                activeStep === s.step
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
              }`}
            >
              <div className="text-[11px] font-medium">{s.title[lang]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: 60-SECOND INTRODUCTORY PITCH */}
      {activeStep === 1 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {lang === 'hi' ? 'चरण 1: ज़मीनी संवाद' : 'Step 1: Ground Conversation'}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                {lang === 'hi' ? '60 सेकंड का प्रामाणिक पार्टी परिचय' : 'The 60-Second Master Field Pitch'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copied' : 'Copy Pitch'}</span>
              </button>

              <button
                type="button"
                onClick={handleSharePitchWhatsApp}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-4 text-stone-800 leading-relaxed text-sm">
            <div className="font-semibold text-emerald-950">
              {lang === 'hi' ? quickPitchHi : quickPitchEn}
            </div>

            <div className="pt-3 border-t border-emerald-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>10 मार्च 1948 को आज़ाद भारत में गठन</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>भारतीय संविधान व धर्मनिरपेक्षता पर अडिग</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>1952 से लगातार भारतीय संसद में उपस्थिति</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'अगला: चारों विंग्स का परिचय' : 'Next: Introducing the 4 Wings'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTRODUCING THE 4 WINGS */}
      {activeStep === 2 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {lang === 'hi' ? 'चरण 2: संगठनात्मक ढांचा' : 'Step 2: Organizational Wings'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi' 
                ? 'चारों प्रमुख विंग्स: IUML, MYL, MSF और व्हाइट गार्ड' 
                : 'The 4 Wings: IUML, MYL, MSF & White Guard'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* IUML */}
            <div className="p-5 bg-white border-2 border-emerald-600 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  MOTHER PARTY
                </span>
                <span className="text-xs text-stone-400 font-mono">Est. 10 March 1948</span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                IUML · इंडियन यूनियन मुस्लिम लीग
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'भारत निर्वाचन आयोग द्वारा मान्यता प्राप्त राजनीतिक दल। क़ायदे-मिल्लत मुहम्मद इस्माइल द्वारा स्थापित। संसदीय लोकतंत्र, धर्मनिरपेक्षता और संवैधानिक न्याय का प्रतीक।'
                  : 'National democratic political party founded by Constituent Assembly member Quaid-e-Millath Muhammad Ismail. Fighting for constitutional minority rights in Parliament.'}
              </p>
            </div>

            {/* MYL */}
            <div className="p-5 bg-white border-2 border-blue-700 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  YOUTH WING
                </span>
                <span className="text-xs text-stone-400 font-mono">Est. 3 August 1973</span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                MYL · मुस्लिम यूथ लीग
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? '18 से 35 वर्ष के युवाओं का गतिशील संगठन। उत्तर प्रदेश में अधिवक्ता सरफ़राज़ अहमद (राष्ट्रीय अध्यक्ष) के नेतृत्व में रोजगार, करियर मार्गदर्शन और जन-आंदोलन का वाहक।'
                  : 'Official youth wing empowering young citizens with civic leadership, employment advocacy, anti-drug awareness, and constitutional literacy.'}
              </p>
            </div>

            {/* MSF */}
            <div className="p-5 bg-white border-2 border-emerald-500 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  STUDENT WING
                </span>
                <span className="text-xs text-stone-400 font-mono">College & University</span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                MSF · मुस्लिम स्टूडेंट्स फेडरेशन
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'एएमयू, लखनऊ विवि, इलाहाबाद विवि, रुहेलखंड और डिग्री कॉलेजों में छात्र अधिकारों, किफायती हॉस्टल, छात्रवृत्ति और पारदर्शी परीक्षाओं के लिए संघर्षरत छात्र संगठन।'
                  : 'Student wing organizing university and college students for campus democracy, affordable hostels, scholarship disbursals, and exam integrity.'}
              </p>
            </div>

            {/* White Guard & Life Lift */}
            <div className="p-5 bg-white border-2 border-stone-800 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                  SERVICE & CAREERS
                </span>
                <span className="text-xs text-stone-400 font-mono">Social Corps</span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                White Guard & Life Lift (लाइफ लिफ्ट)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'व्हाइट गार्ड: अनुशासित आपदा राहत, रक्तदान और जनसेवा दस्ता। लाइफ लिफ्ट: यूपी के छात्रों के लिए निःशुल्क करियर काउंसलिंग, यूपीएससी/यूपीपीएससी कोचिंग सहायता व कौशल विकास।'
                  : 'White Guard provides emergency disaster relief and medical seva. Life Lift delivers career coaching, civil service guidance, and skill training for UP youth.'}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'अगला: मिथकों का तार्किक खंडन' : 'Next: Myth-Busting Sheet'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MYTH-BUSTERS & FIELD OBJECTION HANDLING */}
      {activeStep === 3 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              {lang === 'hi' ? 'चरण 3: सवालों व शंकाओं का समाधान' : 'Step 3: Handling Doubts & Myths'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi'
                ? 'फील्ड में पूछे जाने वाले प्रमुख सवाल व उनके सटीक जवाब'
                : 'Ground Myth-Busters & Talking Points Sheet'}
            </h2>
          </div>

          {/* Myth selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {MYTHS_AND_FAQS.map((faq, index) => (
              <button
                key={faq.id}
                type="button"
                onClick={() => setSelectedFaqId(faq.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedFaqId === faq.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{`0${index + 1}. `}</span>
                <span>{lang === 'hi' ? faq.mythHi.slice(0, 32) + '...' : faq.mythEn.slice(0, 32) + '...'}</span>
              </button>
            ))}
          </div>

          {/* Active Myth Card */}
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                {lang === 'hi' ? 'भ्रामक सवाल / शंका:' : 'The Common Myth / Objection:'}
              </span>
              <h4 className="text-sm font-bold text-rose-950 mt-1">
                {lang === 'hi' ? selectedFaq.mythHi : selectedFaq.mythEn}
              </h4>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                {lang === 'hi' ? 'सटीक ऐतिहासिक तथ्य / वास्तविकता:' : 'The Verified Historical Fact:'}
              </span>
              <p className="text-xs font-bold text-emerald-950 mt-1 leading-relaxed">
                {lang === 'hi' ? selectedFaq.factHi : selectedFaq.factEn}
              </p>
            </div>

            <div className="text-xs text-stone-700 leading-relaxed space-y-1.5 pt-2">
              <strong className="text-stone-900 block">
                {lang === 'hi' ? 'विस्तृत संदर्भ (Explanation):' : 'Detailed Background for Cadres:'}
              </strong>
              <p>{lang === 'hi' ? selectedFaq.detailedExplanationHi : selectedFaq.detailedExplanationEn}</p>
            </div>

            <div className="pt-3 border-t border-stone-200">
              <strong className="text-xs text-stone-900 block mb-2">
                {lang === 'hi' ? 'फील्ड में बोलने के मुख्य बिंदु (Cadre Talking Points):' : 'Key Talking Points to Speak on Ground:'}
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

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'अगला: ऑन-द-स्पॉट सदस्यता' : 'Next: Instant Onboarding'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: IMMEDIATE FIELD ACTION & ONBOARDING */}
      {activeStep === 4 && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs animate-fade-in">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {lang === 'hi' ? 'चरण 4: त्वरित सदस्यता व सोशल शेयरिंग' : 'Step 4: Immediate Action & ID Card'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">
              {lang === 'hi' ? 'मौके पर ही सदस्य बनाएं और डिजिटल आईडी कार्ड दें' : 'Instant Cadre Enrollment on the Spot'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {lang === 'hi' ? '1. सदस्य जोड़ें और तुरंत आईडी कार्ड दें' : '1. Register Cadre & Issue Digital ID'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'युवक का नाम, फ़ोन, ज़िला और विंग (MYL या MSF) दर्ज करें। 2 सेकंड में आधिकारिक डिजिटल पहचान पत्र क्यूआर कोड के साथ तैयार होकर डाउनलोड हो जाता है।'
                  : 'Enroll student or youth volunteer on the spot. System issues official membership number and printable/downloadable ID card immediately.'}
              </p>
              <button
                type="button"
                onClick={onNavigateToMembership}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'सदस्यता फॉर्म खोलें' : 'Open Registration Form'}
              </button>
            </div>

            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {lang === 'hi' ? '2. व्हाट्सएप व सोशल मीडिया पर एक-क्लिक शेयर' : '2. One-Shot Multi-Platform Broadcast'}
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
          </div>
        </div>
      )}
    </div>
  );
};
