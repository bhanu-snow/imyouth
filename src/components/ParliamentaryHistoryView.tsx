import React, { useState } from 'react';
import { 
  Building2, 
  Award, 
  BookOpen, 
  Scale, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Users2,
  Landmark,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { Language, ParliamentaryHouse, ParliamentaryLeader } from '../types';
import { PARLIAMENTARY_LEADERS, IDEOLOGY_COMPARISONS } from '../data/parliamentaryHistoryData';
import { LadderSymbolIcon, PartyFlagIcon, PartySymbolCard } from './PartySymbol';

interface Props {
  lang: Language;
}

// Lightweight portrait fallback wrapper
const LeaderPortrait: React.FC<{ leader: ParliamentaryLeader; size?: 'normal' | 'large' }> = ({ 
  leader, 
  size = 'normal' 
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .replace(/^(Adv\.|Dr\.|Er\.|Maulana|Sayyid|Quaid-e-Millath)\s+/i, '')
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const isMYL = leader.house === 'myl_national' || leader.house === 'myl_state_up';
  const isAssembly = leader.house === 'state_assembly';

  const dimClass = size === 'large' ? 'w-24 h-28 sm:w-28 sm:h-32' : 'w-20 h-24 sm:w-24 sm:h-28';

  if (leader.photoUrl && !imageError) {
    return (
      <div className={`relative ${dimClass} rounded-xl overflow-hidden border-2 ${
        isMYL ? 'border-emerald-700' : 'border-blue-900'
      } bg-stone-100 shrink-0 shadow-sm group`}>
        <img
          src={leader.photoUrl}
          alt={leader.nameEn}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        {leader.isSitting && (
          <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs">
            SITTING
          </span>
        )}
      </div>
    );
  }

  // Lightweight distinguished wrapper when no photo is provided or on load failure
  return (
    <div className={`relative ${dimClass} rounded-xl overflow-hidden border-2 ${
      isMYL ? 'border-emerald-700 bg-emerald-950' : isAssembly ? 'border-amber-700 bg-slate-900' : 'border-blue-900 bg-blue-950'
    } text-white shrink-0 shadow-sm flex flex-col items-center justify-center p-2 text-center`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className={`font-black tracking-wider text-sm sm:text-base ${
          isMYL ? 'text-emerald-300' : 'text-blue-200'
        }`}>
          {getInitials(leader.nameEn)}
        </div>
        
        <span className="text-[9px] uppercase tracking-widest text-stone-300 font-semibold mt-1">
          {leader.house === 'constituent_assembly' ? 'Founder' : leader.house.replace('myl_', '').replace('_', ' ')}
        </span>

        <div className="mt-1 w-4 h-0.5 bg-stone-400/50 rounded-full" />
      </div>

      {leader.isSitting && (
        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[8px] font-black px-1 py-0.2 rounded shadow-xs">
          ACTIVE
        </span>
      )}
    </div>
  );
};

export const ParliamentaryHistoryView: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'ideology' | 'symbol' | 'coalitions'>('timeline');
  const [selectedHouse, setSelectedHouse] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredLeaders = PARLIAMENTARY_LEADERS.filter((leader) => {
    const matchesHouse = selectedHouse === 'all' || leader.house === selectedHouse;
    const matchesSearch = 
      leader.nameEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      leader.nameHi.includes(searchFilter) ||
      leader.constituencyEn.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesHouse && matchesSearch;
  });

  const getHouseBadge = (house: ParliamentaryHouse) => {
    switch (house) {
      case 'constituent_assembly':
        return <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded">CONSTITUENT ASSEMBLY FOUNDER</span>;
      case 'lok_sabha':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-black px-2 py-0.5 rounded">LOK SABHA (LOWER HOUSE)</span>;
      case 'rajya_sabha':
        return <span className="bg-purple-100 text-purple-950 border border-purple-300 text-[10px] font-black px-2 py-0.5 rounded">RAJYA SABHA (UPPER HOUSE)</span>;
      case 'union_ministry':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded">UNION CABINET MINISTER</span>;
      case 'state_assembly':
        return <span className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">STATE ASSEMBLY (KERALA / TN)</span>;
      case 'myl_national':
        return <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">MYL NATIONAL COMMITTEE</span>;
      case 'myl_state_up':
        return <span className="bg-blue-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">MYL UP STATE COMMITTEE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <LadderSymbolIcon size={140} />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-xs rounded-lg text-[11px] font-bold text-emerald-300 border border-white/10">
              <LadderSymbolIcon size={16} />
              <span>{lang === 'hi' ? 'संसदीय एवं संगठनात्मक अभिलेखागार' : 'Parliamentary & Cadre Archival Records'}</span>
            </span>
            <span className="px-2.5 py-1 bg-blue-500/20 rounded-lg text-[11px] font-bold text-blue-200 border border-blue-400/20">
              {lang === 'hi' ? 'दस्तावेजी प्रमाण व साक्ष्य' : 'Official Documentary Evidence'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {lang === 'hi'
              ? 'संविधान सभा, संसद से लेकर उत्तर प्रदेश यूथ विंग तक: ऐतिहासिक नेतृत्व एवं साक्ष्य'
              : 'From Constituent Assembly & Parliament to UP Youth Wing: Leaders, Tenures & Evidence'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            {lang === 'hi'
              ? 'संविधान सभा (1946-50), लोकसभा व राज्यसभा के सभी वर्तमान व ऐतिहासिक सांसदों (एड. हारिस बीरान, पी.वी. अब्दुल वहाब, ई.टी. मोहम्मद बशीर, डॉ. समदानी, क़ायदे-मिल्लत) सहित मुस्लिम यूथ लीग (MYL) राष्ट्रीय व उत्तर प्रदेश नेतृत्व की प्रामाणिक सूची।'
              : 'Comprehensive chronological evidence spanning the Constituent Assembly, Lok Sabha, Rajya Sabha (sitting MPs Adv. Haris Beeran, P.V. Abdul Wahab, Basheer, Samadani, Navas Kani), State Assemblies, and Muslim Youth League (MYL) National and UP State Committees.'}
          </p>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 font-extrabold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '1. सभी सदनों व युवा नेतृत्व की सूची (Leaders & Tenures)' : '1. Leaders, MPs & MYL Committees'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('symbol')}
          className={`px-4 py-2.5 font-extrabold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'symbol'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <LadderSymbolIcon size={16} />
          <span>{lang === 'hi' ? '2. पार्टी चुनाव चिन्ह: "सीढ़ी" (Ladder Symbol)' : '2. Party Symbol: "The Ladder"'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ideology')}
          className={`px-4 py-2.5 font-extrabold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
            activeTab === 'ideology'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '3. अन्य विचारधाराओं व दलों से अंतर (Ideology Comparison)' : '3. How Our Ideology Differs'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coalitions')}
          className={`px-4 py-2.5 font-extrabold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
            activeTab === 'coalitions'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '4. दलित + अल्पसंख्यक सर्वसमाज मोर्चा (Coalitions)' : '4. Dalit + Alpsankhyak Alliances'}
        </button>
      </div>

      {/* TAB 1: LEADERS, MPS & ORGANISATIONAL HIERARCHY */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* House Filter Tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { key: 'all', label: { en: 'All Categories (सभी)', hi: 'सभी' } },
                { key: 'lok_sabha', label: { en: 'Lok Sabha (Lower House)', hi: 'लोकसभा' } },
                { key: 'rajya_sabha', label: { en: 'Rajya Sabha (Upper House)', hi: 'राज्यसभा' } },
                { key: 'constituent_assembly', label: { en: 'Constituent Assembly (1946–50)', hi: 'संविधान सभा' } },
                { key: 'state_assembly', label: { en: 'Kerala & Tamil Nadu Houses', hi: 'केरल व तमिलनाडु विधानसभा' } },
                { key: 'myl_national', label: { en: 'MYL National Committee', hi: 'MYL राष्ट्रीय समिति' } },
                { key: 'myl_state_up', label: { en: 'MYL UP State Committee', hi: 'MYL उत्तर प्रदेश समिति' } },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedHouse(cat.key)}
                  className={`px-3 py-1.5 font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    selectedHouse === cat.key
                      ? 'bg-blue-950 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {cat.label[lang]}
                </button>
              ))}
            </div>

            <div className="shrink-0">
              <input
                type="text"
                placeholder="Search leaders (e.g. Haris Beeran, Basheer, Sarfaraz)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 bg-white"
              />
            </div>
          </div>

          {/* Leaders List with Authentic Portraits & Lightweight Fallback Wrappers */}
          <div className="space-y-5">
            {filteredLeaders.map((leader) => (
              <div
                key={leader.id}
                className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 hover:border-emerald-600 transition-colors shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-4">
                    {/* Portrait Photo or Lightweight Typographic Wrapper */}
                    <LeaderPortrait leader={leader} size="normal" />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-stone-900">
                          {lang === 'hi' ? leader.nameHi : leader.nameEn}
                        </h3>
                        {leader.isSitting && (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                            CURRENT SITTING MP / LEADER
                          </span>
                        )}
                        {getHouseBadge(leader.house)}
                      </div>

                      <div className="text-xs font-semibold text-emerald-800">
                        {lang === 'hi' ? leader.constituencyHi : leader.constituencyEn}
                      </div>

                      {leader.badgeLabel && (
                        <div className="text-[11px] font-bold text-blue-900">
                          ★ {leader.badgeLabel[lang]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right self-start sm:self-center shrink-0">
                    <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg inline-block border border-stone-200">
                      {leader.tenureYears}
                    </span>
                  </div>
                </div>

                {/* Roles */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    {lang === 'hi' ? 'संवैधानिक व संगठनात्मक जिम्मेदारियां:' : 'Constitutional & Organizational Portfolios:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(lang === 'hi' ? leader.rolesHi : leader.rolesEn).map((role, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-md"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Contributions & Evidence */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    {lang === 'hi' ? 'सदन व संगठन में विधायी योगदान एवं साक्ष्य:' : 'Legislative Interventions & Field Record:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700 leading-relaxed">
                    {(lang === 'hi' ? leader.keyContributionsHi : leader.keyContributionsEn).map((cont, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{cont}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Citation Record */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2 text-[11px] text-stone-600 font-mono">
                  <FileText className="w-4 h-4 text-blue-900 shrink-0" />
                  <span>
                    <strong>Official Archival Record:</strong> {leader.citationRecord}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PARTY SYMBOL: THE LADDER */}
      {activeTab === 'symbol' && (
        <PartySymbolCard lang={lang} />
      )}

      {/* TAB 3: IDEOLOGY COMPARISON */}
      {activeTab === 'ideology' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {IDEOLOGY_COMPARISONS.map((comp) => (
              <div
                key={comp.id}
                className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                    {lang === 'hi' ? comp.topicHi : comp.topicEn}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                    {lang === 'hi' ? comp.titleHi : comp.titleEn}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Our Stance */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'hi' ? 'IUML / मुस्लिम यूथ लीग का संवैधानिक रुख' : 'Our Principled Constitutional Stance'}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      {lang === 'hi' ? comp.ourStanceHi : comp.ourStanceEn}
                    </p>
                  </div>

                  {/* Other Parties */}
                  <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-950">
                      <Scale className="w-4 h-4 text-rose-700" />
                      <span>{lang === 'hi' ? 'अन्य दलों व उग्रवादी तत्वों का अवसरवादी रुख' : 'Other Ideologies / Opportunistic Stance'}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      {lang === 'hi' ? comp.otherPartiesHi : comp.otherPartiesEn}
                    </p>
                  </div>
                </div>

                {/* Coalition & Action Context */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <strong className="text-stone-900 block mb-0.5">
                    {lang === 'hi' ? 'ऐतिहासिक गठबंधन व ज़मीनी समन्वय अनुभव:' : 'Historical Collaboration & Coalition Precedents:'}
                  </strong>
                  <p>{lang === 'hi' ? comp.coalitionHistoryHi : comp.coalitionHistoryEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COALITIONS & SERVA SAMAJ BROTHERHOOD */}
      {activeTab === 'coalitions' && (
        <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-6 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              {lang === 'hi' ? 'सामाजिक समरसता का व्यापक मोर्चा' : 'Broad Social Justice & Minority Coalition'}
            </span>
            <h2 className="text-2xl font-black text-stone-900">
              {lang === 'hi'
                ? 'दलित + अल्पसंख्यक एकता: मुस्लिम, सिख, ईसाई, बौद्ध व सर्वसमाज'
                : 'Dalit + Alpsankhyak Unity: Muslim, Sikh, Christian, Buddhist & Inclusive Front'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {lang === 'hi'
                ? 'मुस्लिम यूथ लीग (MYL) केवल एक समुदाय तक सीमित नहीं है। हम बाबासाहेब डॉ. आंबेडकर के नीले झंडे के सामाजिक न्याय के दर्शन का सम्मान करते हुए दलित, सिख, ईसाई, बौद्ध और सभी पिछड़े वर्गों के हकों के लिए साझा संघर्ष करते हैं।'
                : 'Muslim Youth League strictly adheres to Baba Saheb Ambedkar\'s constitutional vision of fraternity. Our movement brings together Dalits, Sikhs, Christians, Buddhists, and backward communities under the banner of education, legal rights, and equal dignity.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-blue-950 text-sm">
                {lang === 'hi' ? 'दलित-बहुजन अधिकार समन्वय' : 'Dalit & Bahujan Front'}
              </h4>
              <p className="text-stone-700 leading-relaxed">
                {lang === 'hi'
                  ? 'आरक्षण की सुरक्षा, जातिगत भेदभाव के विरुद्ध विधिक सहायता और बाबासाहेब के संविधान के मूल ढांचे की रक्षा हेतु संयुक्त आंदोलन।'
                  : 'Joint agitations defending affirmative action reservations, offering free legal aid against atrocities, and upholding the basic structure of the Constitution.'}
              </p>
            </div>

            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-emerald-950 text-sm">
                {lang === 'hi' ? 'सिख व ईसाई अल्पसंख्यक साझा मंच' : 'Sikh & Christian Minority Front'}
              </h4>
              <p className="text-stone-700 leading-relaxed">
                {lang === 'hi'
                  ? 'अल्पसंख्यक शिक्षण संस्थानों की स्वायत्तता (अनुच्छेद 30), पूजा स्थलों की सुरक्षा और सांप्रदायिक नफरत के विरुद्ध साझा मोर्चा।'
                  : 'Protecting the constitutional autonomy of minority schools/colleges under Article 30 and standing in solidarity against hate speech.'}
              </p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-stone-950 text-sm">
                {lang === 'hi' ? 'बौद्ध व शांति आंदोलन' : 'Buddhist & Peace Dialog'}
              </h4>
              <p className="text-stone-700 leading-relaxed">
                {lang === 'hi'
                  ? 'अहिंसा, करुणा और अंतर-धार्मिक संवाद के माध्यम से उत्तर प्रदेश के हर ज़िले में भाईचारे की स्थापना।'
                  : 'Advancing inter-faith harmony, compassionate community relief, and non-violent civic action across Uttar Pradesh.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
