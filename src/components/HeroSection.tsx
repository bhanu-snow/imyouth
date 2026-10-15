import React from 'react';
import { ArrowRight, Share2, ShieldCheck, Users, Compass, Sparkles, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { LadderSymbolIcon } from './PartySymbol';

interface Props {
  lang: Language;
  onNavigateToMembership: () => void;
  onNavigateToBroadcast: () => void;
  onNavigateToWorkflow: () => void;
  onNavigateToFaq: () => void;
}

export const HeroSection: React.FC<Props> = ({ 
  lang, 
  onNavigateToMembership, 
  onNavigateToBroadcast,
  onNavigateToWorkflow,
  onNavigateToFaq,
}) => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-stone-200">
      {/* Top Banner Accent: IUML Green + White + Royal Blue */}
      <div className="h-2 w-full flex">
        <div className="h-full w-2/4 bg-emerald-700" />
        <div className="h-full w-1/4 bg-white border-x border-stone-200" />
        <div className="h-full w-1/4 bg-blue-800" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition & Primary CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-xs font-bold text-emerald-900 tracking-wide">
                <LadderSymbolIcon size={18} />
                <span>
                  {lang === 'hi' 
                    ? 'मुस्लिम यूथ लीग (MYL) · उत्तर प्रदेश राज्य समिति' 
                    : 'Muslim Youth League (MYL) · Uttar Pradesh State Committee'}
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                चुनाव चिन्ह: सीढ़ी (The Ladder)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.18]" style={{ textWrap: 'balance' }}>
              {lang === 'hi' ? (
                <>
                  <span className="text-emerald-700">हक़, इंसाफ़, तालीम व भाईचारा:</span>{' '}
                  उत्तर प्रदेश के युवाओं की संवैधानिक और संगठित आवाज़
                </>
              ) : (
                <>
                  <span className="text-emerald-700">Justice, Education & Dignity:</span>{' '}
                  The Constitutional Youth Vanguard of Uttar Pradesh
                </>
              )}
            </h1>

            <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl">
              {lang === 'hi'
                ? 'इंडियन यूनियन मुस्लिम लीग (IUML) के आधिकारिक युवा मोर्चा (MYL) और छात्र संगठन (MSF) का गतिशील वैचारिक मंच। ज़मीनी कार्यकर्ताओं के लिए फील्ड वर्कफ़्लो, भ्रांतियों का तार्किक खंडन, डिजिटल पहचान पत्र, और सोशल मीडिया पर एक-क्लिक साझाकरण।'
                : 'The official ideological and operational platform of Muslim Youth League (MYL) and Muslim Students Federation (MSF) in Uttar Pradesh. Equipped with field briefing workflows, myth-busting resources, instant cadre ID issuance, and 1-shot social syndication.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNavigateToWorkflow}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-md hover:shadow-emerald-700/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-200" />
                <span>{lang === 'hi' ? 'कार्यकर्ता फील्ड वर्कफ़्लो' : 'Cadre Outreach Workflow'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToFaq}
                className="px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-200" />
                <span>{lang === 'hi' ? 'मिथक बनाम तथ्य (FAQ)' : 'Myths vs Facts (FAQ)'}</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToBroadcast}
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? 'सोशल स्टूडियो' : 'Social Studio'}</span>
              </button>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? '10 मार्च 1948 संवैधानिक विरासत' : 'Constituent Assembly Legacy 1948'}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'hi' ? 'द्वैभाषिक हिंदी + अंग्रेज़ी' : 'Bilingual Hindi + English'}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'hi' ? 'उत्तर प्रदेश केंद्रित' : 'UP Focused'}</span>
            </div>
          </div>

          {/* Right Column: Branded Visual Card in IUML Green & Blue (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl border border-emerald-800">
              {/* Card top banner */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    MYL UP Cadre Portal
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-300">
                  imyouth.vercel.app
                </span>
              </div>

              {/* Sample Broadcast Preview */}
              <div className="py-5 space-y-3">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  ★ UTTAR PRADESH STATE INITIATIVE
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {lang === 'hi'
                    ? 'लाइफ लिफ्ट (Life Lift): यूपी के युवाओं के लिए करियर, छात्रवृत्ति व कोचिंग मार्गदर्शन'
                    : '"Life Lift": Career Mentorship, UPSC Guidance & Scholarship Support for UP Students'}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {lang === 'hi'
                    ? 'संभल, मुरादाबाद, रामपुर, अलीगढ़, लखनऊ, मेरठ, वाराणसी आदि ज़िलों में युवाओं के अधिकारों और शिक्षा के लिए समर्पित संगठन।'
                    : 'Championing higher education, fair exam notifications, legal counseling, and communal peace across all UP districts.'}
                </p>

                {/* 5 Social Media Platforms indicator badges */}
                <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-stone-300">
                  <span className="bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">WhatsApp</span>
                  <span className="bg-blue-950 text-blue-200 px-2 py-0.5 rounded border border-blue-700">Telegram</span>
                  <span className="bg-stone-800 text-stone-200 px-2 py-0.5 rounded border border-stone-600">X (Twitter)</span>
                  <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Insta 1080p</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between">
                <span className="text-xs text-emerald-200">
                  {lang === 'hi' ? 'तुरंत सदस्य बनें व डिजिटल आईडी पाएं' : 'Get Verified Digital ID Card'}
                </span>
                <button
                  onClick={onNavigateToMembership}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  Join Cadre
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip below Hero Split */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 tabular-nums">
              35,000+
            </div>
            <div className="text-xs font-semibold text-stone-600 mt-0.5">
              {lang === 'hi' ? 'सत्यापित MYL व MSF कार्यकर्ता' : 'Verified MYL & MSF Cadres'}
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-900 tabular-nums">
              45+
            </div>
            <div className="text-xs font-semibold text-stone-600 mt-0.5">
              {lang === 'hi' ? 'उत्तर प्रदेश ज़िला व तहसील समितियां' : 'UP District & Tehsil Units'}
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
              180+
            </div>
            <div className="text-xs font-semibold text-stone-600 mt-0.5">
              {lang === 'hi' ? 'लाइफ लिफ्ट व छात्र सहायता शिविर' : 'Life Lift & Seva Camps'}
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
              1948
            </div>
            <div className="text-xs font-semibold text-stone-600 mt-0.5">
              {lang === 'hi' ? 'संवैधानिक स्वतंत्रता से उपस्थिति' : 'Constitutional Legacy Year'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
