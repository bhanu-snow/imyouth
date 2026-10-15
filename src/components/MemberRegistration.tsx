import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Sparkles, Search, UserPlus, Clock, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Member, Language, YouthWing, AuthUser } from '../types';
import { memberService } from '../services/memberService';
import { DigitalIdCard } from './DigitalIdCard';
import confetti from 'canvas-confetti';
import { TranslateButton } from './common/TranslateButton';
import { translateEnglishToHindi } from '../utils/translationService';
import { referenceDataService, type DistrictOption, type SubDistrictOption, type WingOption, type LookupOption } from '../services/referenceDataService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
  onMemberRegistered?: () => void;
}

export const MemberRegistration: React.FC<Props> = ({ lang, currentUser, onMemberRegistered }) => {
  const [members, setMembers] = useState<Member[]>([]);
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
  const [stateId, setStateId] = useState('');
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [subDistrictOptions, setSubDistrictOptions] = useState<SubDistrictOption[]>([]);
  const [wingOptions, setWingOptions] = useState<WingOption[]>([]);
  const [communityOptions, setCommunityOptions] = useState<LookupOption[]>([]);
  const [districtId, setDistrictId] = useState('');
  const [subDistrictId, setSubDistrictId] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [wing, setWing] = useState<YouthWing>('myl_cadre');
  const [designation, setDesignation] = useState('Active Youth Volunteer');
  const [communityBackground, setCommunityBackground] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [education, setEducation] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canViewDirectory = ['superadmin', 'state_president', 'state_admin', 'district_incharge'].includes(currentUser.role);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([referenceDataService.states(), referenceDataService.districts(), referenceDataService.wings(), referenceDataService.memberCommunities()])
      .then(async ([stateRows, districtRows, wingRows, communityRows]) => {
        if (cancelled) return;
        const up = stateRows.find((item) => item.code.toUpperCase() === 'UP');
        const upDistricts = up ? districtRows.filter((item) => item.state_id === up.id) : [];
        setDistrictOptions(upDistricts);
        setWingOptions(wingRows);
        setCommunityOptions(communityRows);
        if (up) setStateId(up.id);
        const initialDistrict = upDistricts.find((item) => item.code.toLowerCase() === 'moradabad') || upDistricts[0];
        if (initialDistrict) {
          setDistrictId(initialDistrict.id);
        }
        if (wingRows.some((item) => item.code === 'myl_cadre')) setWing('myl_cadre');
        if (canViewDirectory) {
          const rows = await memberService.listForAuthorizedUser();
          if (!cancelled) {
            setMembers(rows);
            const approvedOrPending = rows[0] ?? null;
            setCurrentMember(approvedOrPending);
          }
        }
        setLookupError('');
      })
      .catch((error: unknown) => {
        if (!cancelled) setLookupError(error instanceof Error ? error.message : 'Could not load reference data from Supabase.');
      });
    return () => { cancelled = true; };
  }, [canViewDirectory]);

  useEffect(() => {
    if (!districtId) {
      setSubDistrictOptions([]);
      setSubDistrictId('');
      return;
    }
    let cancelled = false;
    void referenceDataService.subDistricts(districtId).then(
      (rows) => {
        if (cancelled) return;
        setSubDistrictOptions(rows);
        const first = rows[0];
        setSubDistrictId(first?.id || '');
      },
      (error: unknown) => {
        if (!cancelled) setLookupError(error instanceof Error ? error.message : 'Could not load sub-districts.');
      },
    );
    return () => { cancelled = true; };
  }, [districtId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!fullName.trim() || !phone.trim() || !stateId || !districtId || !wing) {
      setSubmitError('Complete the required name, phone, state, district, and wing fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const newMember = await memberService.submitApplication({
        fullName, fullNameHi, phone, email, stateId, districtId, subDistrictId,
        wingCode: wing, designation: designation || 'Active Youth Volunteer',
        designationHi: wing === 'msf' ? 'छात्र कार्यकर्ता (MSF)' : 'सक्रिय युवा कार्यकर्ता (MYL)',
        communityBackground, bloodGroup, education,
      });
      setSubmittedRequest(newMember);
      setCurrentMember(newMember);
      setShowForm(false);
      if (canViewDirectory) setMembers(await memberService.listForAuthorizedUser());
      onMemberRegistered?.();
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Application could not be submitted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrictFilter === 'all' || m.district === selectedDistrictFilter;
    return matchesSearch && matchesDistrict;
  });


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
                      onBlur={async () => {
                        if (fullName.trim() && !fullNameHi.trim()) {
                          const tr = await translateEnglishToHindi(fullName);
                          if (tr) setFullNameHi(tr);
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-stone-700">
                        पूरा नाम (हिंदी)
                      </label>
                      <TranslateButton
                        englishText={fullName}
                        onTranslated={(hi) => setFullNameHi(hi)}
                      />
                    </div>
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
                    <select
                      required
                      value={districtId}
                      onChange={(e) => {
                        const selected = districtOptions.find((item) => item.id === e.target.value);
                        setDistrictId(e.target.value);
                        setSubDistrictId('');
                      }}
                      disabled={districtOptions.length === 0}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-emerald-600 focus:outline-none bg-white disabled:bg-stone-100"
                    >
                      <option value="">{lang === 'hi' ? 'ज़िला चुनें' : 'Select district'}</option>
                      {districtOptions.map((item) => <option key={item.id} value={item.id}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Tehsil / Ward *</label>
                    <select
                      required
                      value={subDistrictId}
                      onChange={(e) => {
                        const selected = subDistrictOptions.find((item) => item.id === e.target.value);
                        setSubDistrictId(e.target.value);
                      }}
                      disabled={!districtId || subDistrictOptions.length === 0}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-emerald-600 focus:outline-none bg-white disabled:bg-stone-100"
                    >
                      <option value="">{lang === 'hi' ? 'तहसील / इकाई चुनें' : 'Select tehsil / local unit'}</option>
                      {subDistrictOptions.map((item) => <option key={item.id} value={item.id}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Organization Wing *</label>
                    <select
                      required
                      value={wing}
                      onChange={(e) => setWing(e.target.value as YouthWing)}
                      disabled={wingOptions.length === 0}
                      className="w-full px-2.5 py-2 border border-stone-300 rounded bg-white font-medium text-emerald-900 disabled:bg-stone-100"
                    >
                      <option value="">{lang === 'hi' ? 'विंग चुनें' : 'Select organization wing'}</option>
                      {wingOptions.map((item) => <option key={item.id} value={item.code}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                    </select>
                    {lookupError && <p role="alert" className="mt-1 text-rose-700 text-[11px]">{lookupError}</p>}
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
                      <option value="">{lang === 'hi' ? 'वैकल्पिक — चयन न करें' : 'Optional — prefer not to say'}</option>
                      {communityOptions.map((item) => <option key={item.id} value={item.name_en}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                    </select>
                  </div>
                </div>

                {submitError && <p role="alert" className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800">{submitError}</p>}

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
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-700 disabled:opacity-50 hover:bg-emerald-800 text-white rounded font-bold shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit Application (Request Pending)'}
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

        {canViewDirectory && (
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
                  {districtOptions.map((item) => (
                    <option key={item.id} value={item.name_en}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>
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
        )}
      </div>
    </div>
  );
};
