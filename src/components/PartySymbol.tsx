import React, { useState } from 'react';
import { ShieldCheck, Info, Sparkles, Check, Download } from 'lucide-react';
import { Language } from '../types';

export const LadderSymbolIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="Official Party Symbol: The Ladder (सीढ़ी)"
    >
      {/* Outer Glow / Base */}
      <rect width="64" height="64" rx="12" fill="#047857" fillOpacity="0.08" />
      
      {/* Left Stile / Rail */}
      <path 
        d="M20 8L16 56" 
        stroke="#047857" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
      {/* Right Stile / Rail */}
      <path 
        d="M44 8L48 56" 
        stroke="#047857" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
      
      {/* Rungs of the Ladder */}
      <line x1="19" y1="16" x2="45" y2="16" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <line x1="18.3" y1="25" x2="45.7" y2="25" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <line x1="17.6" y1="34" x2="46.4" y2="34" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <line x1="16.9" y1="43" x2="47.1" y2="43" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <line x1="16.2" y1="52" x2="47.8" y2="52" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      
      {/* Subtle Inner Highlight for metallic/wooden authentic look */}
      <line x1="19" y1="16" x2="45" y2="16" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <line x1="18.3" y1="25" x2="45.7" y2="25" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <line x1="17.6" y1="34" x2="46.4" y2="34" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  );
};

export const PartyFlagIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 72 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} border border-stone-300 rounded-xs shadow-xs`}
      aria-label="Official Party Flag of Indian Union Muslim League"
    >
      {/* Deep Emerald Green Field */}
      <rect width="72" height="48" fill="#047857" />
      
      {/* Top Hoist Canton White Crescent - Facing upper-right fly */}
      <path 
        d="M 12 21 C 8.2 17.2 8.4 11.2 12.4 7.4 C 15 4.9 18.6 4.2 21.8 5.3 C 18.2 7 16.2 10.4 16.6 14.2 C 16.9 17.6 19.4 20.4 22.8 21.2 C 19.2 23 14.8 22.8 12 21 Z" 
        fill="#ffffff" 
      />
      {/* Five-pointed White Star nestled in upper hoist opening */}
      <polygon 
        points="23.2,8.4 24.2,10.6 26.6,10.7 24.7,12.2 25.4,14.5 23.3,13.2 21.2,14.5 21.9,12.2 20,10.7 22.4,10.6" 
        fill="#ffffff" 
      />
    </svg>
  );
};

interface SymbolCardProps {
  lang: Language;
}

export const PartySymbolCard: React.FC<SymbolCardProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySymbolDesc = () => {
    const text = lang === 'hi' 
      ? 'इंडियन यूनियन मुस्लिम लीग (IUML) का अधिकृत चुनाव चिन्ह "सीढ़ी" (Ladder) है, जो शिक्षा, स्वाभिमान व लोकतांत्रिक भागीदारी के ज़रिए समाज के उत्थान का प्रतीक है।'
      : 'The official Election Commission recognized symbol of IUML is "The Ladder" (सीढ़ी), symbolizing the upward democratic ascent through education and constitutional rights.';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-emerald-700/30 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-700 p-2 shadow-xs flex items-center justify-center shrink-0">
            <LadderSymbolIcon className="w-full h-full" size={48} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                {lang === 'hi' ? 'भारत निर्वाचन आयोग द्वारा मान्यता प्राप्त' : 'Election Commission of India Sanctioned'}
              </span>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded uppercase">
                Official Electoral Symbol
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              {lang === 'hi' ? 'अधिकृत चुनाव चिन्ह: "सीढ़ी" (The Ladder)' : 'Official Party Symbol: "The Ladder" (सीढ़ी)'}
            </h3>
            <div className="text-xs text-stone-600 mt-0.5">
              {lang === 'hi' ? 'भारतीय लोकतंत्र में वंचितों, दलितों व अल्पसंख्यकों के उत्थान का ऐतिहासिक प्रतीक' : 'Symbol of upward mobility, education, and constitutional progress'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center p-2.5 bg-white border border-stone-200 rounded-xl">
            <PartyFlagIcon className="w-12 h-8" />
            <span className="text-[10px] font-bold text-emerald-900 mt-1">
              {lang === 'hi' ? 'पार्टी ध्वज' : 'Official Flag'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopySymbolDesc}
            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Info className="w-4 h-4 text-stone-500" />}
            <span>{copied ? (lang === 'hi' ? 'विवरण कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'चिन्ह का विवरण' : 'Copy Meaning')}</span>
          </button>
        </div>
      </div>

      {/* Meaning & Constitutional Rungs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white/80 rounded-xl border border-emerald-200 space-y-1.5">
          <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">1</span>
            <span>{lang === 'hi' ? 'तालीम (शिक्षा की सीढ़ी)' : 'Ascent Through Education'}</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {lang === 'hi'
              ? 'क़ायदे-मिल्लत और सी.एच. मोहम्मद कोया का सिद्धांत: समुदाय की असली शक्ति केवल तालीम में है। स्कूल, कॉलेज, यूनिवर्सिटी और प्रतियोगी परीक्षाओं में आगे बढ़ना।'
              : 'Quaid-e-Millath’s doctrine: Real power lies in mass literacy, engineering colleges, universities, and competitive exams for every backward youth.'}
          </p>
        </div>

        <div className="p-4 bg-white/80 rounded-xl border border-blue-200 space-y-1.5">
          <div className="font-extrabold text-blue-950 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px]">2</span>
            <span>{lang === 'hi' ? 'संविधान व लोकतांत्रिक अधिकार' : 'Constitutional Democratic Rights'}</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {lang === 'hi'
              ? 'संसद, विधानसभाओं और अदालतों में बाबासाहेब आंबेडकर के संविधान के तहत अपने हक़ की बात करना। किसी के सामने झुकना नहीं, बल्कि संविधान की सीढ़ी से बराबरी हासिल करना।'
              : 'Empowerment through Parliament, Legislative Assemblies, and Courts. Climbing step-by-step toward equal citizenship under Baba Saheb Ambedkar\'s Constitution.'}
          </p>
        </div>

        <div className="p-4 bg-white/80 rounded-xl border border-stone-200 space-y-1.5">
          <div className="font-extrabold text-stone-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-stone-800 text-white flex items-center justify-center text-[10px]">3</span>
            <span>{lang === 'hi' ? 'दलित+अल्पसंख्यक सर्वसमाज भाईचारा' : 'Dalit & Minority Fraternity'}</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {lang === 'hi'
              ? 'मुस्लिम, दलित, सिख, ईसाई और बौद्ध भाई-बहनों का साझा मंच। नफरत और विभाजनकारी ताकतों के खिलाफ अमन, इंसाफ और विकास की राजनीति।'
              : 'Uniting Dalits, Sikhs, Christians, Buddhists, and backward communities in an inclusive brotherhood rejecting extremist sloganeering.'}
          </p>
        </div>
      </div>
    </div>
  );
};
