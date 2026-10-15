import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Sparkles, Search, UserPlus, Clock, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Member, Language, YouthWing, AuthUser } from '../types';
import { storageService } from '../services/storageService';
import { DigitalIdCard } from './DigitalIdCard';
import confetti from 'canvas-confetti';

interface Props {
  lang: Language;
  currentUser: AuthUser;
  onMemberRegistered?: () => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
];

export const MemberRegistration: React.FC<Props> = ({ lang, currentUser, onMemberRegistered }) => {
  const [members, setMembers] = useState<Member[]>(storageService.getMembers());
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('all');
  const [submittedRequest, setSubmittedRequest] = useState<Member | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [fullNameHi, setFullNameHi] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Moradabad');
  const [subDistrict, setSubDistrict] = useState('City Unit');
  const [wing, setWing] = useState<YouthWing>('myl_cadre');
  const [designation, setDesignation] = useState('Active Youth Volunteer');
  const [communityBackground, setCommunityBackground] = useState('Dalit, Alpsankhyak & Serva Samaj Front');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [education, setEducation] = useState('Graduate');
  const [avatarUrl, setAvatarUrl] = useState(SAMPLE_AVATARS[0]);
  const [directApprove, setDirectApprove] = useState(false);

  const canDirectApprove = currentUser.role === 'state_admin' || currentUser.role === 'district_incharge';

  useEffect(() => {
    const list = storageService.getMembers();
    setMembers(list);
    const currId = storageService.getCurrentMemberId();
    if (currId) {
      const found = list.find((m) => m.id === currId);
      if (found) setCurrentMember(found);
    } else if (list.length > 0) {
      setCurrentMember(list[0]);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const shouldApproveNow = canDirectApprove && directApprove;

    const newMember = storageService.submitMemberApplication(
      {
        fullName,
        fullNameHi: fullNameHi || fullName,
        phone,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@mylup.org`,
        state: 'Uttar Pradesh',
        district,
        subDistrict,
        wing,
        designation: designation || 'Active Youth Cadre',
        designationHi: wing === 'msf' ? 'छात्र कार्यकर्ता (MSF)' : 'सक्रिय युवा कार्यकर्ता (MYL)',
        communityBackground,
        bloodGroup,
        education,
        avatarUrl,
      },
      shouldApproveNow,
      shouldApproveNow ? `${currentUser.name} (${currentUser.designation})` : ''
    );

    const updated = storageService.getMembers();
    setMembers(updated);
    setSubmittedRequest(newMember);
    setCurrentMember(newMember);
    setShowForm(false);
    onMemberRegistered?.();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrictFilter === 'all' || m.district === selectedDistrictFilter;
    return matchesSearch && matchesDistrict;
  });

  const uniqueDistricts = Array.from(new Set(members.map((m) => m.district)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <span>{lang === 'hi' ? 'सदस्यता एवं कैडर ऑनबोर्डिंग' : 'Cadre Enrollment & Verification Lifecycle'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'मुस्लिम यूथ लीग व MSF उत्तर प्रदेश' : 'MYL & MSF UP'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'कैडर सदस्यता आवेदन एवं आईडी कार्ड' : 'Cadre Membership Request & ID System'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'नए कार्यकर्ता का आवेदन पहले "Request Pending" रहता है। ज़िला या राज्य इन-चार्ज द्वारा अनुमोदन के बाद ही आधिकारिक "Verified Cadre" डिजिटल पहचान पत्र जारी होता है।'
              : 'Public applications enter the pending verification queue. Upon official review by an authorized in-charge, verified cadre ID credentials are unlocked.'}
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setSubmittedRequest(null);
          }}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showForm ? (lang === 'hi' ? 'आईडी कार्ड देखें' : 'View Cadre ID') : (lang === 'hi' ? 'नया सदस्यता आवेदन भरें' : 'Submit Membership Request')}</span>
        </button>
      </div>

      {/* Submitted Acknowledgment Banner */}
      {submittedRequest && (
        <div className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in ${
          submittedRequest.status === 'approved' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              {submittedRequest.status === 'approved' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Cadre Approved & Card Issued! / सदस्यता अनुमोदित व कार्ड जारी!</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span>Application Submitted — Pending District In-Charge Approval</span>
                </>
              )}
            </div>
            <p className="text-xs">
              {submittedRequest.status === 'approved' 
                ? `Official Cadre ID: ${submittedRequest.id} has been activated. Card is downloadable below.`
                : `Reference Application No: ${submittedRequest.id}. District In-Charge will review details. Once approved, verified cadre status is unlocked.`}
            </p>
          </div>

          <div className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded border border-stone-200">
            Status: {submittedRequest.status.toUpperCase()}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form or Active Card (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {showForm ? (
            <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'hi' ? 'MYL / MSF सदस्यता आवेदन प्रपत्र' : 'Cadre Membership Application (UP)'}</span>
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  APPROVAL WORKFLOW
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Full Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohd. Farhan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      पूरा नाम (हिंदी)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. मोहम्मद फ़रहान"
                      value={fullNameHi}
                      onChange={(e) => setFullNameHi(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98370 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="farhan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">State</label>
                    <input
                      type="text"
                      readOnly
                      value="Uttar Pradesh"
                      className="w-full px-2.5 py-2 border border-stone-200 rounded bg-stone-100 font-medium text-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">District (UP) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sambhal, Moradabad"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Tehsil / Ward *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sadar Tehsil"
                      value={subDistrict}
                      onChange={(e) => setSubDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Organization Wing *</label>
                    <select
                      value={wing}
                      onChange={(e) => setWing(e.target.value as YouthWing)}
                      className="w-full px-2.5 py-2 border border-stone-300 rounded bg-white font-medium text-emerald-900"
                    >
                      <option value="myl_cadre">Muslim Youth League (MYL)</option>
                      <option value="msf">Muslim Students Fed. (MSF)</option>
                      <option value="white_guard">White Guard (Seva Brigade)</option>
                      <option value="life_lift">Life Lift (Career Cell)</option>
                      <option value="legal_cell">Legal Aid & RTI Cell</option>
                      <option value="general">General Cadre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Community / Front (सर्वसमाज प्रतिनिधित्व)
                    </label>
                    <select
                      value={communityBackground}
                      onChange={(e) => setCommunityBackground(e.target.value)}
                      className="w-full px-2.5 py-2 border border-stone-300 rounded bg-white text-blue-900 font-semibold"
                    >
                      <option value="Muslim Minority / अल्पसंख्यक मोर्चा">Muslim Minority (अल्पसंख्यक मोर्चा)</option>
                      <option value="Dalit (SC/ST) / डॉ. आंबेडकर सामाजिक न्याय मोर्चा">Dalit / Ambedkarite Samaj (दलित मोर्चा)</option>
                      <option value="Sikh Minority / सिख अल्पसंख्यक मोर्चा">Sikh Minority (सिख मोर्चा)</option>
                      <option value="Christian Minority / ईसाई अल्पसंख्यक मोर्चा">Christian Minority (ईसाई मोर्चा)</option>
                      <option value="Buddhist Minority / बौद्ध समरसता मोर्चा">Buddhist Minority (बौद्ध मोर्चा)</option>
                      <option value="OBC / Backward Classes / पिछड़ा वर्ग">OBC / Backward Classes (पिछड़ा वर्ग)</option>
                      <option value="General Cadre / सर्वसमाज">General Cadre (सर्वसमाज)</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-2">
                    {lang === 'hi' ? 'पहचान पत्र फोटो चुनें या अपलोड करें' : 'Choose or Upload Cadre Photo'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {SAMPLE_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                            avatarUrl === url ? 'border-blue-900 scale-105 ring-2 ring-blue-200' : 'border-stone-200 opacity-60'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <span className="text-stone-400">or</span>
                    <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-semibold cursor-pointer">
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Direct approval checkbox for logged-in in-charges */}
                {canDirectApprove && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-950">
                    <input
                      type="checkbox"
                      id="direct-approve"
                      checked={directApprove}
                      onChange={(e) => setDirectApprove(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <label htmlFor="direct-approve" className="font-semibold cursor-pointer">
                      In-Charge Direct Approval: Issue Official Cadre ID immediately (Logged in as {currentUser.name})
                    </label>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3.5 py-2 bg-stone-100 text-stone-700 rounded font-medium hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow-sm cursor-pointer"
                  >
                    {canDirectApprove && directApprove ? 'Approve & Issue ID Now' : 'Submit Application (Request Pending)'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            currentMember && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-stone-900 text-sm">
                    {lang === 'hi' ? 'सत्यापित डिजिटल पहचान पत्र पूर्वावलोकन' : 'Cadre Membership Identity Card'}
                  </h3>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    currentMember.status === 'approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {currentMember.status.toUpperCase()}
                  </span>
                </div>
                <DigitalIdCard member={currentMember} lang={lang} />
              </div>
            )
          )}
        </div>

        {/* Right Column: Cadre Directory & Filter (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? 'उत्तर प्रदेश कैडर रोस्टर' : 'Cadre Directory & Applications'}</span>
              </h3>
              <span className="text-xs text-stone-500">
                {filteredMembers.length} {lang === 'hi' ? 'सदस्य/आवेदक' : 'records'}
              </span>
            </div>

            {/* Filter / Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'नाम या ज़िला खोजें...' : 'Search cadre or district...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <select
                value={selectedDistrictFilter}
                onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 border border-stone-300 rounded text-xs bg-white"
              >
                <option value="all">All Districts (सभी ज़िले)</option>
                {uniqueDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Cadres List with Status Badges */}
            <div className="divide-y divide-stone-100 max-h-[480px] overflow-y-auto">
              {filteredMembers.map((m) => {
                const isPending = m.status === 'pending';
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setCurrentMember(m);
                      setShowForm(false);
                      setSubmittedRequest(null);
                    }}
                    className={`py-3 px-2 flex items-center justify-between rounded hover:bg-stone-50 transition-colors cursor-pointer ${
                      currentMember?.id === m.id ? 'bg-blue-50/60 border-l-2 border-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-900/30 shrink-0 bg-stone-100">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center font-bold text-blue-900">
                            {m.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>{m.fullName}</span>
                          {m.verified ? (
                            <span title="Verified Cadre" className="inline-flex items-center">
                              <Shield className="w-3 h-3 text-emerald-700 fill-emerald-700" />
                            </span>
                          ) : (
                            <span title="Pending Approval" className="inline-flex items-center">
                              <Clock className="w-3 h-3 text-amber-600" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {m.designation} · {m.district} (UP)
                        </div>
                        {m.communityBackground && (
                          <span className="text-[10px] text-blue-900 font-semibold block">
                            {m.communityBackground.split('/')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded block ${
                        isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {m.id}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-0.5 block">
                        {isPending ? 'Pending Review' : 'Verified'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
