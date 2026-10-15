import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  Award, 
  MapPin, 
  Users, 
  PlusCircle, 
  Share2, 
  CheckCircle, 
  TrendingUp, 
  Phone,
  Mail,
  Trash2,
  Lock
} from 'lucide-react';
import { DistrictUnit, LeadershipTenure, Language, AuthUser } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
}

export const DistrictLeadershipTracker: React.FC<Props> = ({ lang, currentUser }) => {
  const [districts, setDistricts] = useState<DistrictUnit[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist-moradabad');
  const [showAppointModal, setShowAppointModal] = useState(false);

  // New appointment form state
  const [leaderNameEn, setLeaderNameEn] = useState('');
  const [leaderNameHi, setLeaderNameHi] = useState('');
  const [postTitleEn, setPostTitleEn] = useState('District President (MYL)');
  const [postTitleHi, setPostTitleHi] = useState('ज़िला अध्यक्ष (मुस्लिम यूथ लीग)');
  const [tenureStart, setTenureStart] = useState('2026-01');
  const [tenureEnd, setTenureEnd] = useState('Present');
  const [contactPhone, setContactPhone] = useState('');
  const [achievement1, setAchievement1] = useState('');

  const isAuthorized = currentUser.role === 'state_admin' || currentUser.role === 'district_incharge';

  useEffect(() => {
    const list = storageService.getDistricts();
    setDistricts(list);
    if (list.length > 0) {
      setSelectedDistrictId(list[0].id);
    }
  }, []);

  const selectedDistrict = districts.find((d) => d.id === selectedDistrictId) || districts[0];

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
      status: tenureEnd === 'Present' ? 'current' : 'past',
      contact: contactPhone,
      achievements: [
        {
          en: achievement1 || 'Expanded MSF & MYL cadre units across rural tehsils',
          hi: achievement1 || 'ग्रामीण तहसीलों में MSF व MYL कैडर इकाइयों का विस्तार किया',
        },
      ],
    };

    const updated = storageService.saveLeadershipTenure(selectedDistrict.id, newTenure);
    setDistricts(updated);
    setShowAppointModal(false);

    // reset
    setLeaderNameEn('');
    setLeaderNameHi('');
    setContactPhone('');
    setAchievement1('');
  };

  const handleDeleteTenure = (tenureId: string) => {
    if (!selectedDistrict) return;
    if (window.confirm('Delete this historical leadership tenure record?')) {
      const updated = storageService.deleteLeadershipTenure(selectedDistrict.id, tenureId);
      setDistricts(updated);
    }
  };

  const handleShareDistrictStatus = () => {
    if (!selectedDistrict) return;
    const currentLeader = selectedDistrict.leadershipTimeline.find((t) => t.status === 'current');
    const msg = `🇮🇳 *${selectedDistrict.districtName.hi} ज़िला मुस्लिम यूथ लीग (MYL) अपडेट*\n\nज़िला अध्यक्ष: ${currentLeader?.leaderName.hi || 'पद रिक्त'}\nसक्रिय कैडर: ${selectedDistrict.activeMembers}+ कार्यकर्ता\nसंपन्न कार्यक्रम: ${selectedDistrict.completedEvents} सभाएं व शिविर\n\nसत्यापित कैडर रोस्टर: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <span>{lang === 'hi' ? 'संगठनात्मक संरचना' : 'Organizational Hierarchy'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'उत्तर प्रदेश ज़िला व तहसील समयरेखा' : 'UP District & Tehsil Leadership'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'ज़िला व तहसील नेतृत्व समयरेखा' : 'UP District & Sub-District Leadership Hierarchy'}
          </h1>
          <p className="text-stone-600 text-xs max-w-2xl mt-1">
            {lang === 'hi'
              ? 'संभल, मुरादाबाद, रामपुर, लखनऊ, अलीगढ़ आदि ज़िलों के पदाधिकारियों का समयबद्ध कार्यकाल और संगठनात्मक नेतृत्व परिवर्तन।'
              : 'Chronological timeline of district and sub-district office bearers across UP, tracking succession and key milestones achieved during each term.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAuthorized ? (
            <button
              onClick={() => setShowAppointModal(true)}
              className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'नया पदाधिकारी दर्ज करें' : 'Record Leadership Tenure'}</span>
            </button>
          ) : (
            <div className="p-2 bg-stone-100 border border-stone-200 rounded-lg text-[11px] text-stone-500 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-stone-400" />
              <span>Login as In-Charge to record tenure</span>
            </div>
          )}

          <button
            onClick={handleShareDistrictStatus}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'व्हाट्सएप पर साझा करें' : 'Share District Status'}</span>
          </button>
        </div>
      </div>

      {/* District Selector Carousel / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {districts.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDistrictId(d.id)}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              selectedDistrictId === d.id
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{lang === 'hi' ? d.districtName.hi : d.districtName.en}</span>
            <span className="ml-2 text-[10px] opacity-80">(UP)</span>
          </button>
        ))}
      </div>

      {selectedDistrict && (
        <div className="space-y-6">
          {/* District KPI Overview Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">
                {lang === 'hi' ? 'सक्रिय पंजीकृत कार्यकर्ता' : 'Active Cadres'}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                {selectedDistrict.activeMembers.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Verified in UP Roster</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">
                {lang === 'hi' ? 'संपन्न ज़मीनी कार्यक्रम' : 'Completed Events'}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                {selectedDistrict.completedEvents}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Life Lift, Rallies, Seva</div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">
                {lang === 'hi' ? 'संगठन सक्रियता स्कोर' : 'Activity Index'}
              </div>
              <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">
                {selectedDistrict.activityScore} / 100
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Grade A (Active District)</div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">
                {lang === 'hi' ? 'तहसील / मंडल इकाइयाँ' : 'Sub-Districts Active'}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                {selectedDistrict.subDistricts.length} Units
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Active Booth Teams</div>
            </div>
          </div>

          {/* 2-Column Split: Sub-District Units & Chronological Leadership Tenure */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Sub-District / Tehsil Units (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'hi' ? 'तहसील व मंडल इकाइयाँ' : 'Sub-District (Tehsil) Units'}</span>
                  </h3>
                  <span className="text-xs text-stone-500">
                    {selectedDistrict.subDistricts.length} units
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedDistrict.subDistricts.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2 hover:bg-stone-100/70 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">
                          {lang === 'hi' ? sub.name.hi : sub.name.en}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                            sub.status === 'high_activity'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">In-Charge:</span>
                          <strong className="text-stone-800">{sub.inCharge}</strong>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-stone-400">Phone:</span>
                          <span className="text-stone-600">{sub.inChargePhone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Cadre Strength:</span>
                          <strong className="text-stone-900 tabular-nums">
                            {sub.membersCount}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Chronological Leadership Tenure Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-stone-900 text-sm">
                      {lang === 'hi' 
                        ? 'नेतृत्व कार्यकाल समयरेखा (Tenure Timeline)' 
                        : 'Leadership Succession & Tenure Timeline'}
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500">
                    {lang === 'hi' ? 'कालानुक्रमिक संबंध' : 'Time-based Post Succession'}
                  </span>
                </div>

                {/* Timeline Stream */}
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {selectedDistrict.leadershipTimeline.map((item) => {
                    const isCurrent = item.status === 'current';
                    return (
                      <div key={item.id} className="relative group">
                        {/* Dot on Timeline */}
                        <div
                          className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                            isCurrent
                              ? 'bg-emerald-700 border-white ring-4 ring-emerald-100'
                              : 'bg-stone-300 border-white'
                          }`}
                        />

                        {/* Tenure Card */}
                        <div
                          className={`p-4 rounded-lg border transition-all ${
                            isCurrent
                              ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                              : 'bg-stone-50 border-stone-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-stone-900 text-sm">
                                  {lang === 'hi' ? item.leaderName.hi : item.leaderName.en}
                                </h4>
                                {isCurrent ? (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                                    {lang === 'hi' ? 'वर्तमान पदासीन' : 'Incumbent'}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded">
                                    {lang === 'hi' ? 'पूर्व अध्यक्ष' : 'Past Tenure'}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-blue-900 mt-0.5">
                                {lang === 'hi' ? item.postTitle.hi : item.postTitle.en}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold text-stone-700 bg-white px-2 py-1 rounded border border-stone-200 block">
                                {item.tenureStart} → {item.tenureEnd}
                              </span>
                              {currentUser.role === 'state_admin' && (
                                <button
                                  onClick={() => handleDeleteTenure(item.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                                  title="Delete Tenure Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Achievements logged during tenure */}
                          <div className="mt-3 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                              {lang === 'hi' ? 'कार्यकाल की मुख्य उपलब्धियां:' : 'Tenure Milestones:'}
                            </span>
                            <ul className="space-y-1">
                              {item.achievements.map((ach, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-stone-700 flex items-start gap-1.5 leading-relaxed"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                  <span>{lang === 'hi' ? ach.hi : ach.en}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Leadership Appointment Modal (Authorized Only) */}
      {showAppointModal && isAuthorized && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              {lang === 'hi' ? 'नवीन पदाधिकारी नियुक्ति दर्ज करें' : 'Record New Leadership Tenure'}
            </h3>

            <form onSubmit={handleAppointSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Leader Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adv. Alok Verma"
                  value={leaderNameEn}
                  onChange={(e) => setLeaderNameEn(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  नेता का नाम (हिंदी)
                </label>
                <input
                  type="text"
                  placeholder="उदा. एडवोकेट आलोक वर्मा"
                  value={leaderNameHi}
                  onChange={(e) => setLeaderNameHi(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Post Title (English)
                  </label>
                  <input
                    type="text"
                    value={postTitleEn}
                    onChange={(e) => setPostTitleEn(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    पद का नाम (हिंदी)
                  </label>
                  <input
                    type="text"
                    value={postTitleHi}
                    onChange={(e) => setPostTitleHi(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tenure Start (YYYY-MM)
                  </label>
                  <input
                    type="text"
                    value={tenureStart}
                    onChange={(e) => setTenureStart(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tenure End (or Present)
                  </label>
                  <input
                    type="text"
                    value={tenureEnd}
                    onChange={(e) => setTenureEnd(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Key Milestone / Achievement
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enrolled 1,500 new student cadres"
                  value={achievement1}
                  onChange={(e) => setAchievement1(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAppointModal(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Save Tenure Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
