import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake, Compass, Users, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
  onNavigateToMembership: () => void;
  onNavigateToBroadcast: () => void;
  onNavigateToWorkflow: () => void;
  onNavigateToFaq: () => void;
}

export const PartyIntroMission: React.FC<Props> = ({ 
  lang, 
  onNavigateToMembership, 
  onNavigateToBroadcast,
  onNavigateToWorkflow,
  onNavigateToFaq
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Intro Hero Block */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <span>{lang === 'hi' ? 'आधिकारिक वैचारिक परिचय' : 'Ideological Legacy & Foundation'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {lang === 'hi' 
            ? '10 मार्च 1948: आज़ाद भारत में संवैधानिक अधिकारों का शंखनाद' 
            : 'March 10, 1948: The Constitutional Awakening in Independent India'}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          {lang === 'hi'
            ? 'विभाजन के उपरांत 10 मार्च 1948 को मद्रास (चेन्नई) में संविधान सभा के सदस्य क़ायदे-मिल्लत मुहम्मद इस्माइल साहब के नेतृत्व में इंडियन यूनियन मुस्लिम लीग (IUML) की स्थापना हुई। पार्टी का पहला मूल सिद्धांत था: स्वतंत्र भारत के धर्मनिरपेक्ष संविधान के प्रति पूर्ण निष्ठा, सांप्रदायिक सौहार्द, और अल्पसंख्यकों व पिछड़े वर्गों का लोकतांत्रिक सशक्तिकरण।'
            : 'Founded on March 10, 1948 in Madras by Quaid-e-Millath Muhammad Ismail (a distinguished member of India\'s Constituent Assembly), the Indian Union Muslim League took an unconditional oath of allegiance to the sovereign, secular Constitution of India. It has represented citizens in the Indian Parliament continuously since 1952.'}
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div>
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            {lang === 'hi' ? 'उत्तर प्रदेश में हमारे 4 मार्गदर्शक सिद्धांत' : 'Our 4 Guiding Principles for Uttar Pradesh'}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
            {lang === 'hi' ? 'तालीम, तरक्की, इंसाफ़ और सामाजिक भाईचारा' : 'Education, Development, Justice & Fraternity'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3 hover:border-emerald-600 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {lang === 'hi' ? '01. तालीम एवं उच्च शिक्षा अधिकार (Education First)' : '01. Education First & Campus Welfare'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'मुस्लिम स्टूडेंट्स फेडरेशन (MSF) के माध्यम से पोस्ट-मैट्रिक छात्रवृत्तियों की बहाली, सरकारी कॉलेजों में आधुनिक डिजिटल पुस्तकालय और हर पिछड़े ब्लॉक में उच्च शिक्षा की सुलभता।'
                : 'Championing full scholarship disbursal for minority and backward class students, subsidized campus housing, and modern study centers in rural tehsils.'}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3 hover:border-blue-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {lang === 'hi' ? '02. लाइफ लिफ्ट: करियर व प्रतियोगी परीक्षा मार्गदर्शन' : '02. "Life Lift": Youth Career & Skill Mentorship'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'यूपी के युवाओं के लिए आगरा, लखनऊ, मुरादाबाद और अलीगढ़ में निःशुल्क करियर काउंसलिंग, यूपीएससी/यूपीपीएससी कोचिंग और डिजिटल तकनीकी प्रशिक्षण शिविर।'
                : 'A flagship MYL initiative conducting skill workshops, competitive examination guidance, and employment mentoring for rural and urban youth across UP.'}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3 hover:border-emerald-600 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {lang === 'hi' ? '03. संवैधानिक अधिकार व विधिक सहायता (Legal Aid)' : '03. Constitutional Rights & Free Legal Aid'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'अधिवक्ता सरफ़राज़ अहमद (राष्ट्रीय अध्यक्ष MYL) और विधिक प्रकोष्ठ द्वारा युवाओं को निःशुल्क कानूनी सलाह, आरटीआई मार्गदर्शन और पुलिस उत्पीड़न के विरुद्ध संवैधानिक सुरक्षा।'
                : 'Providing professional legal counseling, filing RTI inquiries for student welfare, and upholding civil liberties under Baba Saheb Ambedkar\'s Constitution.'}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3 hover:border-blue-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {lang === 'hi' ? '04. सामाजिक समरसता व व्हाइट गार्ड सेवा दल' : '04. Communal Amity & White Guard Seva Brigade'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'सर्वधर्म समभाव और शांति रक्षा। व्हाइट गार्ड स्वयंसेवकों द्वारा बाढ़, शीतकाल और चिकित्सा आपातकाल में सभी धर्मों व जातियों के निर्धन परिवारों की निःस्वार्थ सेवा।'
                : 'Promoting inter-community harmony and peaceful coexistence. White Guard emergency corps delivers humanitarian flood relief and medical blood donations.'}
            </p>
          </div>
        </div>
      </div>

      {/* Ground Cadre Action Callout */}
      <div className="p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl space-y-6 border border-emerald-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {lang === 'hi' ? 'कार्यकर्ता मार्गदर्शन' : 'For Active Cadres'}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold mt-1">
            {lang === 'hi' 
              ? 'फील्ड में जाएं तो तथ्यों और वैचारिक स्पष्टता के साथ जाएं' 
              : 'Enter the Field with Verified Facts & Ideological Confidence'}
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            {lang === 'hi'
              ? 'जब आप उत्तर प्रदेश के कॉलेजों या गांवों में युवाओं से मिलें, तो हमारा 4-चरणीय फील्ड वर्कफ़्लो खोलें या अक्सर पूछे जाने वाले सवालों (FAQ) से हर भ्रांति का शांत व दस्तावेजी जवाब दें।'
              : 'Use the Cadre Outreach Workflow and Myth-Busting FAQ to effectively communicate the 1948 legacy, secular stance, and tangible youth programs like Life Lift.'}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToWorkflow}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'कार्यकर्ता वर्कफ़्लो खोलें' : 'Open Cadre Workflow'}
          </button>
          <button
            onClick={onNavigateToFaq}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'भ्रांतियों का खंडन (FAQ)' : 'View Myth-Busters'}
          </button>
          <button
            onClick={onNavigateToMembership}
            className="px-4 py-2.5 bg-white text-stone-900 font-bold text-xs rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'सदस्यता व डिजिटल आईडी' : 'Join Cadre & Get ID'}
          </button>
        </div>
      </div>
    </div>
  );
};
