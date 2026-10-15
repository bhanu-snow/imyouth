import React, { useState, useEffect } from 'react';
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
  Info,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { Language, ParliamentaryHouse, ParliamentaryLeader, AuthUser } from '../types';
import { IDEOLOGY_COMPARISONS } from '../data/parliamentaryHistoryData';
import { storageService } from '../services/storageService';
import { LadderSymbolIcon, PartyFlagIcon, PartySymbolCard } from './PartySymbol';
import { TranslateButton } from './common/TranslateButton';
import { translateEnglishToHindi } from '../utils/translationService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
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

export const ParliamentaryHistoryView: React.FC<Props> = ({ lang, currentUser }) => {
  const [leaders, setLeaders] = useState<ParliamentaryLeader[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'ideology' | 'symbol' | 'coalitions'>('timeline');
  const [selectedHouse, setSelectedHouse] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Content Manager Modal
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState<ParliamentaryLeader | null>(null);

  // Form states
  const [formHouse, setFormHouse] = useState<ParliamentaryHouse>('lok_sabha');
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameHi, setFormNameHi] = useState('');
  const [formConstituencyEn, setFormConstituencyEn] = useState('');
  const [formConstituencyHi, setFormConstituencyHi] = useState('');
  const [formTenure, setFormTenure] = useState('');
  const [formIsSitting, setFormIsSitting] = useState(false);
  const [formRolesEn, setFormRolesEn] = useState('');
  const [formRolesHi, setFormRolesHi] = useState('');
  const [formContributionsEn, setFormContributionsEn] = useState('');
  const [formContributionsHi, setFormContributionsHi] = useState('');
  const [formCitation, setFormCitation] = useState('');
  const [photoMode, setPhotoMode] = useState<'wrapper' | 'url'>('wrapper');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');

  const canEditContent = currentUser.role === 'superadmin' || currentUser.role === 'content_manager';

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = () => {
    setLeaders(storageService.getParliamentaryLeaders());
  };

  const handleOpenAdd = () => {
    setEditingLeader(null);
    setFormHouse('lok_sabha');
    setFormNameEn('');
    setFormNameHi('');
    setFormConstituencyEn('');
    setFormConstituencyHi('');
    setFormTenure('2024 - Present');
    setFormIsSitting(true);
    setFormRolesEn('');
    setFormRolesHi('');
    setFormContributionsEn('');
    setFormContributionsHi('');
    setFormCitation('Lok Sabha / Rajya Sabha Records');
    setPhotoMode('wrapper');
    setFormPhotoUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (leader: ParliamentaryLeader) => {
    setEditingLeader(leader);
    setFormHouse(leader.house);
    setFormNameEn(leader.nameEn);
    setFormNameHi(leader.nameHi);
    setFormConstituencyEn(leader.constituencyEn);
    setFormConstituencyHi(leader.constituencyHi);
    setFormTenure(leader.tenureYears);
    setFormIsSitting(Boolean(leader.isSitting));
    setFormRolesEn(leader.rolesEn.join('\n'));
    setFormRolesHi(leader.rolesHi.join('\n'));
    setFormContributionsEn(leader.keyContributionsEn.join('\n'));
    setFormContributionsHi(leader.keyContributionsHi.join('\n'));
    setFormCitation(leader.citationRecord);
    if (leader.photoUrl) {
      setPhotoMode('url');
      setFormPhotoUrl(leader.photoUrl);
    } else {
      setPhotoMode('wrapper');
      setFormPhotoUrl('');
    }
    setShowModal(true);
  };

  const handleDeleteLeader = (id: string) => {
    if (confirm(lang === 'hi' ? 'क्या आप इस ऐतिहासिक रिकॉर्ड/नेता को हटाना चाहते हैं?' : 'Are you sure you want to delete this leader record?')) {
      const updated = storageService.deleteLeader(id);
      setLeaders(updated);
    }
  };

  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn || !formNameHi) return;

    const rolesEnArr = formRolesEn.split('\n').map((r) => r.trim()).filter(Boolean);
    const rolesHiArr = formRolesHi.split('\n').map((r) => r.trim()).filter(Boolean);
    const contEnArr = formContributionsEn.split('\n').map((r) => r.trim()).filter(Boolean);
    const contHiArr = formContributionsHi.split('\n').map((r) => r.trim()).filter(Boolean);

    const leaderData: ParliamentaryLeader = {
      id: editingLeader ? editingLeader.id : `leader-${Date.now()}`,
      house: formHouse,
      nameEn: formNameEn,
      nameHi: formNameHi,
      constituencyEn: formConstituencyEn,
      constituencyHi: formConstituencyHi,
      tenureYears: formTenure,
      isSitting: formIsSitting,
      rolesEn: rolesEnArr.length ? rolesEnArr : ['Party Leader'],
      rolesHi: rolesHiArr.length ? rolesHiArr : ['पार्टी नेता'],
      keyContributionsEn: contEnArr.length ? contEnArr : ['Public representation in constitutional house.'],
      keyContributionsHi: contHiArr.length ? contHiArr : ['संवैधानिक सदन में जनहित की बात उठाना।'],
      citationRecord: formCitation || 'Parliament of India / Assembly Archival Record',
      photoUrl: photoMode === 'url' && formPhotoUrl.trim() ? formPhotoUrl.trim() : undefined,
    };

    const updated = storageService.saveLeader(leaderData);
    setLeaders(updated);
    setShowModal(false);
  };

  const filteredLeaders = leaders.filter((leader) => {
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
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-black px-2 py-0.5 rounded">RAJYA SABHA (UPPER HOUSE)</span>;
      case 'union_ministry':
        return <span className="bg-rose-100 text-rose-950 border border-rose-300 text-[10px] font-black px-2 py-0.5 rounded">UNION MINISTRY CABINET</span>;
      case 'state_assembly':
        return <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded">KERALA / TAMIL NADU ASSEMBLY</span>;
      case 'myl_national':
        return <span className="bg-emerald-800 text-white text-[10px] font-black px-2 py-0.5 rounded">MYL NATIONAL COMMITTEE</span>;
      case 'myl_state_up':
        return <span className="bg-emerald-700 text-emerald-100 border border-emerald-500 text-[10px] font-black px-2 py-0.5 rounded">MYL UTTAR PRADESH STATE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'hi' ? 'संसदीय एवं विधायी दस्तावेज' : 'Parliamentary Archival Evidence'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? '1946 से आज तक का प्रामाणिक इतिहास' : 'Constitutional Hansard Evidence (1946–2026)'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'संसदीय इतिहास, संस्थापक एवं वैचारिक स्पष्टता' : 'Founders, Parliamentary History & Ideological Evidence'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-3xl mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'संविधान सभा, लोकसभा, राज्यसभा और राज्य विधानसभाओं में इंडियन यूनियन मुस्लिम लीग के ऐतिहासिक योगदान का दस्तावेजी प्रमाण। भारतीय धर्मनिरपेक्ष लोकतंत्र में हमारा अडिग विश्वास।'
              : 'Official hansard archives of IUML in India’s Constituent Assembly, Lok Sabha, Rajya Sabha, and State Assemblies. A transparent record of 75+ years of constitutional patriotism.'}
          </p>
        </div>

        {/* Action Button for Content Manager */}
        {canEditContent && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? '+ नया नेता/रिकॉर्ड जोड़ें' : '+ Add Leader Record'}</span>
          </button>
        )}
      </div>

      {/* Main Mode Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>{lang === 'hi' ? '1. सदनवार नेता व कार्यकाल (Tenures)' : '1. House-Wise Leaders & Tenures'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('symbol')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'symbol'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <LadderSymbolIcon size={18} />
          <span>{lang === 'hi' ? '2. पार्टी चिन्ह: सीढ़ी (The Ladder)' : '2. Party Symbol: The Ladder'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ideology')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ideology'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{lang === 'hi' ? '3. विचारधारा तुलना व अन्य दल' : '3. Ideology vs Other Parties'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coalitions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'coalitions'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'hi' ? '4. दलित + अल्पसंख्यक एकता' : '4. Dalit + Alpsankhyak Unity'}</span>
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

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg inline-block border border-stone-200">
                      {leader.tenureYears}
                    </span>

                    {canEditContent && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(leader)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Leader / Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLeader(leader.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Leader"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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
        <div className="space-y-6">
          <PartySymbolCard lang={lang} />
        </div>
      )}

      {/* TAB 3: IDEOLOGY COMPARISON */}
      {activeTab === 'ideology' && (
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-2xl text-white space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {lang === 'hi' ? 'संवैधानिक धर्मनिरपेक्षता बनाम अवसरवाद' : 'Constitutional Secularism vs Other Paradigms'}
            </span>
            <h2 className="text-2xl font-black text-white">
              {lang === 'hi'
                ? 'आईयूएमएल की विचारधारा अन्य प्रमुख दलों से कैसे भिन्न है?'
                : 'How IUML’s Ideology Differs from Other Political Streams'}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {lang === 'hi'
                ? 'हम न तो कट्टरपंथ का समर्थन करते हैं और न ही तथाकथित धर्मनिरपेक्ष दलों के छलावे का। हमारा दर्शन है: लोकतांत्रिक आत्मसम्मान, कानूनी लड़ाई, गुणवत्तापूर्ण शिक्षा और सर्वसमाज समरसता।'
                : 'Rejecting both extremism and opportunistic tokenism. Grounded in constructive democratic participation, rule of law, backward class literacy, and mutual respect.'}
            </p>
          </div>

          <div className="space-y-5">
            {IDEOLOGY_COMPARISONS.map((comp) => (
              <div
                key={comp.id}
                className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 hover:border-emerald-600 transition-colors shadow-xs"
              >
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {lang === 'hi' ? comp.topicHi : comp.topicEn}
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mt-1">
                    {lang === 'hi' ? comp.titleHi : comp.titleEn}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="font-extrabold text-emerald-950 flex items-center gap-2">
                      <LadderSymbolIcon size={18} />
                      <span>{lang === 'hi' ? 'आईयूएमएल व मुस्लिम यूथ लीग का रुख:' : 'IUML & MYL Principle / Stance:'}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      {lang === 'hi' ? comp.ourStanceHi : comp.ourStanceEn}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <div className="font-extrabold text-stone-800 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'hi' ? 'अन्य दलों व छद्म-धर्मनिरपेक्षता से अंतर:' : 'Contrast with Other Political Parties:'}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      {lang === 'hi' ? comp.otherPartiesHi : comp.otherPartiesEn}
                    </p>
                  </div>
                </div>

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

      {/* CONTENT MANAGER ADD / EDIT LEADER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-lg text-stone-900">
                  {editingLeader 
                    ? (lang === 'hi' ? 'संसदीय नेता / साक्ष्य रिकॉर्ड संपादित करें' : 'Edit Historical Leader / Archival Record')
                    : (lang === 'hi' ? 'नया संसदीय नेता / साक्ष्य जोड़ें' : 'Add Historical Leader / Record')}
                </h3>
                <span className="text-xs text-emerald-800 font-semibold">
                  Constitutional Hansard & Organizational Documentation
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">House / Category *</label>
                  <select
                    value={formHouse}
                    onChange={(e) => setFormHouse(e.target.value as ParliamentaryHouse)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="lok_sabha">Lok Sabha (Lower House)</option>
                    <option value="rajya_sabha">Rajya Sabha (Upper House)</option>
                    <option value="constituent_assembly">Constituent Assembly of India (1946–50)</option>
                    <option value="union_ministry">Union Ministry Cabinet</option>
                    <option value="state_assembly">State Assembly (Kerala / Tamil Nadu)</option>
                    <option value="myl_national">MYL National Committee</option>
                    <option value="myl_state_up">MYL Uttar Pradesh State Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tenure / Years *</label>
                  <input
                    type="text"
                    required
                    value={formTenure}
                    onChange={(e) => setFormTenure(e.target.value)}
                    placeholder="e.g. 2024 - Present or 1952 - 1972"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Leader Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    onBlur={async () => {
                      if (formNameEn.trim() && !formNameHi.trim()) {
                        const tr = await translateEnglishToHindi(formNameEn);
                        if (tr) setFormNameHi(tr);
                      }
                    }}
                    placeholder="e.g. Adv. Haris Beeran"
                    className="w-full p-2 border border-stone-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">नेता का नाम (हिंदी) *</label>
                    <TranslateButton
                      englishText={formNameEn}
                      onTranslated={(hi) => setFormNameHi(hi)}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={formNameHi}
                    onChange={(e) => setFormNameHi(e.target.value)}
                    placeholder="उदा. एड. हारिस बीरान"
                    className="w-full p-2 border border-stone-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              {/* Constituency / Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Constituency / House (English) *</label>
                  <input
                    type="text"
                    required
                    value={formConstituencyEn}
                    onChange={(e) => setFormConstituencyEn(e.target.value)}
                    onBlur={async () => {
                      if (formConstituencyEn.trim() && !formConstituencyHi.trim()) {
                        const tr = await translateEnglishToHindi(formConstituencyEn);
                        if (tr) setFormConstituencyHi(tr);
                      }
                    }}
                    placeholder="e.g. Rajya Sabha (Kerala) or Ponnani"
                    className="w-full p-2 border border-stone-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">सदन / निर्वाचन क्षेत्र (हिंदी) *</label>
                    <TranslateButton
                      englishText={formConstituencyEn}
                      onTranslated={(hi) => setFormConstituencyHi(hi)}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={formConstituencyHi}
                    onChange={(e) => setFormConstituencyHi(e.target.value)}
                    placeholder="उदा. राज्यसभा (केरल) या पोन्नानी"
                    className="w-full p-2 border border-stone-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              {/* Photo Choice: Existing Lightweight Wrapper vs Custom URL */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <label className="block font-bold text-stone-800">
                  Portrait Display Style (तस्वीर अथवा लाइटवेट क्लासिक रैपर):
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="photoMode"
                      checked={photoMode === 'wrapper'}
                      onChange={() => setPhotoMode('wrapper')}
                    />
                    <span className="font-semibold text-emerald-900">
                      Lightweight Typographic Wrapper (Default Monogram)
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="photoMode"
                      checked={photoMode === 'url'}
                      onChange={() => setPhotoMode('url')}
                    />
                    <span className="font-semibold text-blue-900">
                      Custom Archival Photo URL
                    </span>
                  </label>
                </div>

                {photoMode === 'url' && (
                  <div className="pt-2">
                    <input
                      type="url"
                      placeholder="https://example.com/archival-portrait.jpg"
                      value={formPhotoUrl}
                      onChange={(e) => setFormPhotoUrl(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Sitting Status Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formIsSitting}
                    onChange={(e) => setFormIsSitting(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Currently Active / Sitting Member (वर्तमान सक्रिय सांसद / नेता)</span>
                </label>
              </div>

              {/* Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Roles / Portfolios (English, 1 per line)</label>
                  <textarea
                    rows={2}
                    value={formRolesEn}
                    onChange={(e) => setFormRolesEn(e.target.value)}
                    placeholder="Member of Parliament&#10;Supreme Court Advocate"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">भूमिकाएं / दायित्व (हिंदी, प्रति पंक्ति एक)</label>
                  <textarea
                    rows={2}
                    value={formRolesHi}
                    onChange={(e) => setFormRolesHi(e.target.value)}
                    placeholder="संसद सदस्य (राज्यसभा)&#10;सर्वोच्च न्यायालय अधिवक्ता"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Contributions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Key Contributions (English, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={formContributionsEn}
                    onChange={(e) => setFormContributionsEn(e.target.value)}
                    placeholder="Raised national minority education rights...&#10;Championed democratic constitutional principles..."
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">मुख्य योगदान (हिंदी, प्रति पंक्ति एक)</label>
                  <textarea
                    rows={3}
                    value={formContributionsHi}
                    onChange={(e) => setFormContributionsHi(e.target.value)}
                    placeholder="सदन में अल्पसंख्यकों के अधिकारों को उठाया...&#10;संविधान की रक्षा में सक्रिय भूमिका..."
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Citation */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Official Hansard / Citation Reference</label>
                <input
                  type="text"
                  value={formCitation}
                  onChange={(e) => setFormCitation(e.target.value)}
                  placeholder="e.g. Rajya Sabha Official Debates, July 2024; Lok Sabha Archival Gazette"
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-bold hover:bg-stone-100"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingLeader ? (lang === 'hi' ? 'अपडेट सहेजें' : 'Save Updates') : (lang === 'hi' ? 'रिकॉर्ड जोड़ें' : 'Add Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
