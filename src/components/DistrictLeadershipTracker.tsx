import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  Award, 
  MapPin, 
  Users, 
  PlusCircle, 
  Share2, 
  TrendingUp, 
  Phone,
  Trash2,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { OrgDistrict, LeadershipTenure, Language, AuthUser } from '../types';
import { storageService } from '../services/storageService';
import { TranslateButton } from './common/TranslateButton';
import { translateEnglishToHindi } from '../utils/translationService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
}

export const DistrictLeadershipTracker: React.FC<Props> = ({ lang, currentUser }) => {
  const [districts, setDistricts] = useState<OrgDistrict[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAppointModal, setShowAppointModal] = useState(false);
  const [leadershipTimeline, setLeadershipTimeline] = useState<LeadershipTenure[]>([]);

  // New appointment form state
  const [leaderNameEn, setLeaderNameEn] = useState('');
  const [leaderNameHi, setLeaderNameHi] = useState('');
  const [postTitleEn, setPostTitleEn] = useState('District President (MYL)');
  const [postTitleHi, setPostTitleHi] = useState('ज़िला अध्यक्ष (मुस्लिम यूथ लीग)');
  const [tenureStart, setTenureStart] = useState('2024-01');
  const [tenureEnd, setTenureEnd] = useState('Present');
  const [contactPhone, setContactPhone] = useState('');
  const [achievement1En, setAchievement1En] = useState('');
  const [achievement1Hi, setAchievement1Hi] = useState('');

  const isAuthorized = ['superadmin', 'state_president', 'state_admin', 'district_incharge'].includes(currentUser.role);

  // Sync with database/storage
  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = () => {
    const list = storageService.getOrgDistricts();
    setDistricts(list);
    if (list.length > 0) {
      const currentSelected = selectedDistrictId && list.some((d) => d.id === selectedDistrictId)
        ? selectedDistrictId
        : list[0].id;
      setSelectedDistrictId(currentSelected);
      loadLeadership(currentSelected);
    }
  };

  const loadLeadership = (distId: string) => {
    const timeline = storageService.getDistrictLeadership(distId);
    setLeadershipTimeline(timeline);
  };

  const handleSelectDistrict = (distId: string) => {
    setSelectedDistrictId(distId);
    loadLeadership(distId);
  };

  const filteredDistricts = districts.filter((d) => {
    const matchesZone = zoneFilter === 'all' || d.zone === zoneFilter;
    const matchesSearch = 
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameHi.includes(searchQuery) ||
      (d.inChargeName && d.inChargeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const selectedDistrict = districts.find((d) => d.id === selectedDistrictId) || filteredDistricts[0] || districts[0];

  const handleAppointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderNameEn || !selectedDistrict) return;

    const newTenure: LeadershipTenure = {
      id: `lead-${Date.now()}`,
      leaderName: {
        en: leaderNameEn,
        hi: leaderNameHi || leaderNameEn,
      },
      postTitle: {
        en: postTitleEn,
        hi: postTitleHi || postTitleEn,
      },
      tenureStart,
      tenureEnd,
      status: tenureEnd.toLowerCase().includes('present') || tenureEnd.toLowerCase().includes('वर्तमान') ? 'current' : 'past',
      contact: contactPhone,
      achievements: [
        {
          en: achievement1En || 'Expanded cadre units & active community support outreach',
          hi: achievement1Hi || achievement1En || 'कैडर इकाइयों का विस्तार व सामुदायिक सेवा कार्य',
        },
      ],
    };

    const updatedTimeline = storageService.saveDistrictLeadership(selectedDistrict.id, newTenure);
    setLeadershipTimeline(updatedTimeline);
    setShowAppointModal(false);

    // Reset form
    setLeaderNameEn('');
    setLeaderNameHi('');
    setContactPhone('');
    setAchievement1En('');
    setAchievement1Hi('');
  };

  const handleDeleteTenure = (tenureId: string) => {
    if (!selectedDistrict) return;
    if (window.confirm(lang === 'hi' ? 'क्या आप इस कार्यकाल रिकॉर्ड को हटाना चाहते हैं?' : 'Delete this leadership tenure record?')) {
      const updated = storageService.deleteDistrictLeadership(selectedDistrict.id, tenureId);
      setLeadershipTimeline(updated);
    }
  };

  const handleShareDistrictStatus = () => {
    if (!selectedDistrict) return;
    const currentLeader = leadershipTimeline.find((t) => t.status === 'current');
    const msg = `🇮🇳 *${selectedDistrict.nameHi} (${selectedDistrict.nameEn}) ज़िला मुस्लिम यूथ लीग (MYL) संगठनात्मक स्थिति*\n\n` +
      `क्षेत्र (Zone): ${selectedDistrict.zone}\n` +
      `ज़िला मुख्यालय: ${selectedDistrict.headquarters || 'UP'}\n` +
      `प्रभारी / अध्यक्ष: ${currentLeader?.leaderName.hi || selectedDistrict.inChargeName || 'पद रिक्त'}\n` +
      `सक्रिय कैडर संख्या: ${selectedDistrict.activeCadreCount}+ कार्यकर्ता\n` +
      `संबद्ध तहसीलें: ${selectedDistrict.subDistricts.join(', ')}\n\n` +
      `सत्यापित संगठनात्मक रोस्टर: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Helper auto-translators for blur events
  const handleLeaderEnBlur = async () => {
    if (leaderNameEn.trim() && !leaderNameHi.trim()) {
      const trans = await translateEnglishToHindi(leaderNameEn);
      if (trans) setLeaderNameHi(trans);
    }
  };

  const handlePostEnBlur = async () => {
    if (postTitleEn.trim() && !postTitleHi.trim()) {
      const trans = await translateEnglishToHindi(postTitleEn);
      if (trans) setPostTitleHi(trans);
    }
  };

  const handleAchievementEnBlur = async () => {
    if (achievement1En.trim() && !achievement1Hi.trim()) {
      const trans = await translateEnglishToHindi(achievement1En);
      if (trans) setAchievement1Hi(trans);
    }
  };

  const zonesList = ['all', 'Rohilkhand', 'Western UP', 'Awadh / Central UP', 'Purvanchal', 'Braj'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'hi' ? 'उत्तर प्रदेश ज़िला संगठन नेटवर्क' : 'UP District Organizational Network'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-stone-500">
              {districts.length} {lang === 'hi' ? 'सक्रिय ज़िले' : 'Active Units'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'यूपी ज़िला नेतृत्व, तहसीलें व कार्यकाल' : 'UP District Units, Tehsils & Leadership Hierarchy'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-3xl mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'संगठनात्मक संरचना से पूरी तरह समन्वित व डेटाबेस-चालित। रोहिलखंड, पश्चिमी यूपी, अवध व पूर्वांचल ज़िलों के प्रभारियों, तहसीलों व पदाधिकारियों का विवरण।'
              : 'Synchronized live with organizational network structure. Complete zonal directory, sub-district tehsils, and chronological office-bearer succession.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAuthorized ? (
            <button
              onClick={() => setShowAppointModal(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? 'पदाधिकारी कार्यकाल दर्ज करें' : 'Record Leadership Tenure'}</span>
            </button>
          ) : (
            <div className="p-2 bg-stone-100 border border-stone-200 rounded-lg text-[11px] text-stone-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>{lang === 'hi' ? 'कार्यकाल जोड़ने हेतु इन-चार्ज लॉगिन करें' : 'Login as In-Charge to add tenure'}</span>
            </div>
          )}

          <button
            onClick={handleShareDistrictStatus}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'व्हाट्सएप साझा करें' : 'Share WhatsApp'}</span>
            <span className="sm:hidden">Share</span>
          </button>
        </div>
      </div>

      {/* Zone Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        {/* Zone Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1 mr-1" />
          {zonesList.map((zn) => (
            <button
              key={zn}
              onClick={() => setZoneFilter(zn)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                zoneFilter === zn
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {zn === 'all' ? (lang === 'hi' ? 'सभी ज़ोन' : 'All Zones') : zn}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'ज़िला या प्रभारी खोजें...' : 'Search district or leader...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Horizontal District Selector Carousel (Fully responsive) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filteredDistricts.map((d) => (
          <button
            key={d.id}
            onClick={() => handleSelectDistrict(d.id)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex flex-col text-left cursor-pointer shrink-0 ${
              selectedDistrict?.id === d.id
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-600/30'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>{lang === 'hi' ? d.nameHi : d.nameEn}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                selectedDistrict?.id === d.id ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-100 text-stone-600'
              }`}>
                {d.zone}
              </span>
            </div>
            <span className={`text-[10px] font-normal ${selectedDistrict?.id === d.id ? 'text-emerald-200' : 'text-stone-400'}`}>
              {d.activeCadreCount}+ {lang === 'hi' ? 'कैडर' : 'cadres'}
            </span>
          </button>
        ))}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-sm">
          {lang === 'hi' ? 'कोई ज़िला इस खोज से मेल नहीं खाता।' : 'No districts found matching your query.'}
        </div>
      )}

      {selectedDistrict && (
        <div className="space-y-6">
          {/* District KPI Overview Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {lang === 'hi' ? 'सक्रिय पंजीकृत कार्यकर्ता' : 'Active Cadres'}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                {selectedDistrict.activeCadreCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{lang === 'hi' ? 'यूपी रोस्टर में सत्यापित' : 'Verified in UP Roster'}</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {lang === 'hi' ? 'तहसील व मंडल इकाइयाँ' : 'Sub-Districts / Tehsils'}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                {selectedDistrict.subDistricts.length} {lang === 'hi' ? 'इकाइयां' : 'Units'}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                {selectedDistrict.subDistricts.slice(0, 2).join(', ')}...
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {lang === 'hi' ? 'ज़िला ज़ोन (Zone)' : 'Organizational Zone'}
              </div>
              <div className="text-lg sm:text-xl font-black text-blue-900 mt-1 truncate">
                {selectedDistrict.zone}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {selectedDistrict.status.toUpperCase()}
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {lang === 'hi' ? 'ज़िला मुख्यालय कार्यालय' : 'Headquarters'}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-stone-900 mt-1 line-clamp-2">
                {selectedDistrict.headquarters || `${selectedDistrict.nameEn}, Uttar Pradesh`}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
                {selectedDistrict.inChargePhone || '+91 UP-MYL'}
              </div>
            </div>
          </div>

          {/* 2-Column Split: Sub-District Units & Chronological Leadership Tenure */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Sub-District / Tehsil Units (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'hi' ? 'संबद्ध तहसील व मंडल इकाइयाँ' : 'Sub-District (Tehsil) Units'}</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedDistrict.subDistricts.length} {lang === 'hi' ? 'तहसीलें' : 'units'}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {selectedDistrict.subDistricts.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between hover:bg-stone-100/70 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-stone-900">{sub}</div>
                          <div className="text-[10px] text-stone-500">
                            {lang === 'hi' ? 'सक्रिय ब्लॉक इकाई' : 'Active Tehsil Block'}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>

                {/* District In-Charge Box */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                    {lang === 'hi' ? 'ज़िला प्रभारी / मुख्य संपर्क' : 'District In-Charge Details'}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900">{selectedDistrict.inChargeName}</span>
                    <a
                      href={`tel:${selectedDistrict.inChargePhone}`}
                      className="font-mono text-[11px] text-blue-900 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedDistrict.inChargePhone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Chronological Leadership Tenure Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-extrabold text-stone-900 text-sm">
                      {lang === 'hi' 
                        ? 'पदाधिकारी कार्यकाल समयरेखा (Leadership Timeline)' 
                        : 'Leadership Succession & Tenure Timeline'}
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500">
                    {leadershipTimeline.length} {lang === 'hi' ? 'कार्यकाल दर्ज' : 'records'}
                  </span>
                </div>

                {/* Timeline Stream */}
                {leadershipTimeline.length === 0 ? (
                  <div className="py-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs">
                    {lang === 'hi'
                      ? 'इस ज़िले हेतु अभी तक कोई पूर्व कार्यकाल दर्ज नहीं है। नया पदाधिकारी दर्ज करने के लिए ऊपर दिए बटन का उपयोग करें।'
                      : 'No historical tenures recorded for this district yet. Use "Record Leadership Tenure" above to add.'}
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                    {leadershipTimeline.map((item) => {
                      const isCurrent = item.status === 'current';
                      return (
                        <div key={item.id} className="relative group">
                          {/* Dot on Timeline */}
                          <div
                            className={`absolute -left-[23px] top-2 w-3.5 h-3.5 rounded-full border-2 ${
                              isCurrent
                                ? 'bg-emerald-700 border-white ring-4 ring-emerald-100'
                                : 'bg-stone-300 border-white'
                            }`}
                          />

                          {/* Tenure Card */}
                          <div
                            className={`p-4 rounded-xl border transition-all ${
                              isCurrent
                                ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                                : 'bg-stone-50 border-stone-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-extrabold text-stone-900 text-sm">
                                    {lang === 'hi' ? item.leaderName.hi : item.leaderName.en}
                                  </h4>
                                  {isCurrent ? (
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                                      {lang === 'hi' ? 'वर्तमान पदासीन' : 'Incumbent'}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
                                      {lang === 'hi' ? 'पूर्व पदाधिकारी' : 'Past Tenure'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-semibold text-blue-900 mt-0.5">
                                  {lang === 'hi' ? item.postTitle.hi : item.postTitle.en}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="text-[11px] font-mono font-bold text-stone-700 bg-white px-2 py-1 rounded-lg border border-stone-200 whitespace-nowrap">
                                  {item.tenureStart} → {item.tenureEnd}
                                </span>
                                {isAuthorized && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTenure(item.id)}
                                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                    title="Delete Tenure Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {item.contact && (
                              <div className="text-[11px] font-mono text-stone-500 mt-2 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-stone-400" />
                                <span>{item.contact}</span>
                              </div>
                            )}

                            {item.achievements && item.achievements.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-stone-200/60 space-y-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                  {lang === 'hi' ? 'कार्यकाल उपलब्धियां' : 'Tenure Milestones'}
                                </div>
                                {item.achievements.map((ach, aIdx) => (
                                  <div key={aIdx} className="text-xs text-stone-700 flex items-start gap-1.5">
                                    <span className="text-emerald-700 font-bold leading-none mt-1">✓</span>
                                    <span>{lang === 'hi' ? ach.hi : ach.en}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Leadership Appointment Modal with Auto-Translate controls */}
      {showAppointModal && selectedDistrict && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  {lang === 'hi' 
                    ? `${selectedDistrict.nameHi} ज़िला पदाधिकारी कार्यकाल दर्ज करें` 
                    : `Record Leadership Tenure for ${selectedDistrict.nameEn}`}
                </h3>
                <span className="text-[11px] text-stone-500 font-medium">
                  {selectedDistrict.zone} Zone · {selectedDistrict.subDistricts.length} Tehsils
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAppointModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAppointSubmit} className="space-y-4 text-xs">
              {/* Leader Name En + Hi with Auto-Translate */}
              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Leader Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderNameEn}
                    onChange={(e) => setLeaderNameEn(e.target.value)}
                    onBlur={handleLeaderEnBlur}
                    placeholder="e.g. Adv. Zeeshan Farooqui"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      पदाधिकारी का नाम (हिंदी) *
                    </label>
                    <TranslateButton
                      englishText={leaderNameEn}
                      onTranslated={(hi) => setLeaderNameHi(hi)}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={leaderNameHi}
                    onChange={(e) => setLeaderNameHi(e.target.value)}
                    placeholder="जैसे: एडवोकेट ज़ीशान फ़ारूक़ी"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>
              </div>

              {/* Post Title En + Hi */}
              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Designation / Post Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitleEn}
                    onChange={(e) => setPostTitleEn(e.target.value)}
                    onBlur={handlePostEnBlur}
                    placeholder="e.g. District President (MYL)"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      पद का शीर्षक (हिंदी) *
                    </label>
                    <TranslateButton
                      englishText={postTitleEn}
                      onTranslated={(hi) => setPostTitleHi(hi)}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={postTitleHi}
                    onChange={(e) => setPostTitleHi(e.target.value)}
                    placeholder="जैसे: ज़िला अध्यक्ष (मुस्लिम यूथ लीग)"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>
              </div>

              {/* Tenure Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tenure Start (वर्ष/माह)</label>
                  <input
                    type="text"
                    required
                    value={tenureStart}
                    onChange={(e) => setTenureStart(e.target.value)}
                    placeholder="YYYY-MM (e.g. 2024-01)"
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tenure End (Present / YYYY-MM)</label>
                  <input
                    type="text"
                    required
                    value={tenureEnd}
                    onChange={(e) => setTenureEnd(e.target.value)}
                    placeholder="Present or 2023-12"
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98370 XXXXX"
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                />
              </div>

              {/* Key Achievement */}
              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Key Achievement during tenure (English)</label>
                  <textarea
                    rows={2}
                    value={achievement1En}
                    onChange={(e) => setAchievement1En(e.target.value)}
                    onBlur={handleAchievementEnBlur}
                    placeholder="e.g. Formed White Guard disaster relief team across rural tehsils"
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">प्रमुख उपलब्धि (हिंदी)</label>
                    <TranslateButton
                      englishText={achievement1En}
                      onTranslated={(hi) => setAchievement1Hi(hi)}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={achievement1Hi}
                    onChange={(e) => setAchievement1Hi(e.target.value)}
                    placeholder="जैसे: ग्रामीण तहसीलों में व्हाइट गार्ड राहत दल का गठन"
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAppointModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl font-bold hover:bg-stone-50 cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {lang === 'hi' ? 'कार्यकाल सुरक्षित करें' : 'Save Leadership Tenure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
