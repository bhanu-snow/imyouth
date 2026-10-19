import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Building2, CalendarDays, CheckCircle2, Clock3, UserRoundCog } from 'lucide-react';
import type {
  AuthUser,
  CommitteeScope,
  Language,
  Member,
  MemberDesignationAppointment,
  OrganizationCommittee,
  PostDesignation,
} from '../types';
import { memberService } from '../services/memberService';
import { memberOrganizationService } from '../services/memberOrganizationService';
import { organizationAdminService } from '../services/organizationAdminService';
import { referenceDataService, type DistrictOption, type StateOption, type SubDistrictOption, type ZoneOption, type WingOption } from '../services/referenceDataService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
}

const today = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};
const canManage = (role: AuthUser['role']) => ['superadmin', 'state_admin', 'district_incharge'].includes(role);

const fieldClass = 'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100';

export const OrganizationAdminDesk: React.FC<Props> = ({ lang, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'committees'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [committees, setCommittees] = useState<OrganizationCommittee[]>([]);
  const [posts, setPosts] = useState<PostDesignation[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrictOption[]>([]);
  const [wings, setWings] = useState<WingOption[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [membershipRows, setMembershipRows] = useState<Awaited<ReturnType<typeof memberOrganizationService.loadHistory>>['memberships']>([]);
  const [appointments, setAppointments] = useState<MemberDesignationAppointment[]>([]);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [startsOn, setStartsOn] = useState(today());
  const [stateId, setStateId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [subDistrictId, setSubDistrictId] = useState('');
  const [membershipEndDate, setMembershipEndDate] = useState(today());
  const [membershipEndReason, setMembershipEndReason] = useState<'joined_other_organization' | 'resigned' | 'other'>('joined_other_organization');
  const [appointmentEndDates, setAppointmentEndDates] = useState<Record<string, string>>({});
  const [appointmentEndReasons, setAppointmentEndReasons] = useState<Record<string, 'term_ended' | 'resigned' | 'replaced' | 'other'>>({});

  const [committeeNameEn, setCommitteeNameEn] = useState('');
  const [committeeNameHi, setCommitteeNameHi] = useState('');
  const [committeeScope, setCommitteeScope] = useState<CommitteeScope>(
    currentUser.role === 'district_incharge' ? 'district' : 'state',
  );
  const [committeeStateId, setCommitteeStateId] = useState('');
  const [committeeZoneId, setCommitteeZoneId] = useState('');
  const [committeeDistrictId, setCommitteeDistrictId] = useState('');
  const [committeeStartsOn, setCommitteeStartsOn] = useState(today());
  const [newPostCommitteeId, setNewPostCommitteeId] = useState('');
  const [newPostTitleEn, setNewPostTitleEn] = useState('');
  const [newPostTitleHi, setNewPostTitleHi] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const approvedMembers = useMemo(
    () => members.filter((member) => member.status === 'approved' && Boolean(member.recordId)),
    [members],
  );
  const selectedMember = approvedMembers.find((member) => member.recordId === selectedMemberId);
  const selectedPost = posts.find((post) => post.id === selectedPostId);
  const selectedCommittee = selectedPost?.committeeId
    ? committees.find((committee) => committee.id === selectedPost.committeeId)
    : undefined;
  const activeMembership = membershipRows.find((membership) => !membership.endsOn);
  const activeWings = wings.filter((wing) => wing.code === 'myl_cadre');
  const mylWingId = activeWings[0]?.id ?? '';

  const districtInchargeDistrictId = districts.find(
    (district) => district.name_en.toLowerCase() === (currentUser.district ?? '').toLowerCase(),
  )?.id;
  const visibleCommittees = committees.filter((committee) => {
    if (currentUser.role === 'superadmin' || currentUser.role === 'state_admin') {
      return currentUser.role === 'superadmin' || committee.scopeLevel !== 'district';
    }
    return committee.scopeLevel === 'district' && committee.districtId === districtInchargeDistrictId;
  });
  const visiblePosts = posts.filter((post) => {
    const committee = post.committeeId ? committees.find((item) => item.id === post.committeeId) : undefined;
    if (currentUser.role === 'superadmin') return !committee || visibleCommittees.some((item) => item.id === committee.id);
    if (currentUser.role === 'state_admin') {
      return post.level === 'state' || post.level === 'zonal'
        ? !committee || visibleCommittees.some((item) => item.id === committee.id)
        : false;
    }
    return ['district', 'block', 'ward'].includes(post.level)
      && (!committee || visibleCommittees.some((item) => item.id === committee.id));
  });

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [memberRows, committeeRows, designationRows, stateRows, zoneRows, districtRows, wingRows] = await Promise.all([
        memberService.listForAuthorizedUser(),
        organizationAdminService.listCommittees(),
        memberOrganizationService.activeDesignations(),
        referenceDataService.states(),
        referenceDataService.zones(),
        referenceDataService.districts(),
        referenceDataService.wings(),
      ]);
      setMembers(memberRows);
      setCommittees(committeeRows);
      setPosts(designationRows);
      setStates(stateRows);
      setZones(zoneRows);
      setDistricts(districtRows);
      setWings(wingRows);
      setStateId((current) => current || stateRows[0]?.id || '');
      setCommitteeStateId((current) => current || stateRows[0]?.id || '');
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load member and committee data.');
    } finally {
      setIsLoading(false);
    }
  };

  const canEndAppointment = (appointment: MemberDesignationAppointment) =>
    currentUser.role === 'superadmin'
    || (currentUser.role === 'state_admin' && ['state', 'zonal'].includes(appointment.scopeLevel))
    || (currentUser.role === 'district_incharge' && appointment.districtId === districtInchargeDistrictId);

  useEffect(() => {
    if (!canManage(currentUser.role)) {
      setIsLoading(false);
      return;
    }
    void loadData();
  }, [currentUser.role]);

  useEffect(() => {
    if (!selectedMember) return;
    setStateId(selectedMember.stateId ?? states[0]?.id ?? '');
    setDistrictId(selectedMember.districtId ?? '');
    setSubDistrictId(selectedMember.subDistrictId ?? '');
    setZoneId(districts.find((district) => district.id === selectedMember.districtId)?.zone_id ?? '');
    setSelectedPostId('');
    void memberOrganizationService.loadHistory(selectedMember.recordId ?? selectedMember.id)
      .then((history) => {
        setMembershipRows(history.memberships);
        setAppointments(history.appointments);
      })
      .catch((historyError: unknown) => {
        setMembershipRows([]);
        setAppointments([]);
        setError(historyError instanceof Error ? historyError.message : 'Could not load member history.');
      });
  }, [selectedMemberId, members, districts, states]);

  useEffect(() => {
    if (!districtId) {
      setSubDistricts([]);
      return;
    }
    let cancelled = false;
    void referenceDataService.subDistricts(districtId).then(
      (rows) => {
        if (cancelled) return;
        setSubDistricts(rows);
        if (!rows.some((row) => row.id === subDistrictId)) setSubDistrictId(rows[0]?.id ?? '');
      },
      (lookupError) => {
        if (!cancelled) setError(lookupError instanceof Error ? lookupError.message : 'Could not load local units.');
      },
    );
    return () => { cancelled = true; };
  }, [districtId]);

  useEffect(() => {
    setCommitteeZoneId('');
    const assignedDistrict = currentUser.role === 'district_incharge'
      ? districts.find((district) => district.id === districtInchargeDistrictId)
      : undefined;
    setCommitteeDistrictId(assignedDistrict?.id ?? '');
    if (assignedDistrict) {
      setCommitteeZoneId(assignedDistrict.zone_id ?? '');
      setCommitteeStateId(assignedDistrict.state_id);
    }
  }, [committeeScope, committeeStateId, currentUser.role, districtInchargeDistrictId, districts]);

  const scopedDistricts = districts.filter((district) =>
    district.state_id === stateId && (!zoneId || district.zone_id === zoneId),
  );
  const committeeScopedDistricts = districts.filter((district) =>
    district.state_id === committeeStateId
      && (currentUser.role !== 'district_incharge' || district.id === districtInchargeDistrictId)
      && (committeeScope !== 'district' || !committeeZoneId || district.zone_id === committeeZoneId),
  );
  const selectedStateZones = zones.filter((zone) => zone.state_id === stateId);
  const selectedCommitteeZones = zones.filter((zone) => zone.state_id === committeeStateId);

  const refreshSelectedMemberHistory = async () => {
    if (!selectedMember) return;
    const history = await memberOrganizationService.loadHistory(selectedMember.recordId ?? selectedMember.id);
    setMembershipRows(history.memberships);
    setAppointments(history.appointments);
  };

  const submitAppointment = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedMember || !selectedPost) {
      setError('Select an approved member and a post designation.');
      return;
    }
    const selectedMemberRecordId = selectedMember.recordId ?? selectedMember.id;
    const committee = selectedCommittee;
    const appointmentStateId = committee?.stateId ?? stateId;
    const appointmentZoneId = committee?.zoneId
      ?? (selectedPost.level === 'zonal' ? zoneId : districts.find((district) => district.id === districtId)?.zone_id ?? undefined);
    const appointmentDistrictId = committee?.districtId
      ?? (['district', 'block', 'ward'].includes(selectedPost.level) ? districtId : undefined);
    const appointmentSubDistrictId = ['block', 'ward'].includes(selectedPost.level) ? subDistrictId : undefined;

    if (!appointmentStateId
      || (selectedPost.level !== 'state' && !appointmentZoneId)
      || (['district', 'block', 'ward'].includes(selectedPost.level) && !appointmentDistrictId)
      || (['block', 'ward'].includes(selectedPost.level) && !appointmentSubDistrictId)) {
      setError('Complete the required geographic scope for this designation.');
      return;
    }

    setIsSaving(true);
    try {
      await memberOrganizationService.assignDesignation({
        memberId: selectedMemberRecordId,
        postDesignationId: selectedPost.id,
        scopeLevel: selectedPost.level,
        stateId: appointmentStateId,
        zoneId: appointmentZoneId,
        districtId: appointmentDistrictId,
        subDistrictId: appointmentSubDistrictId,
        startsOn,
      });
      await refreshSelectedMemberHistory();
      setSuccess('Designation appointment saved.');
      setSelectedPostId('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not assign designation.');
    } finally {
      setIsSaving(false);
    }
  };

  const submitMembershipEnd = async () => {
    if (!activeMembership) return;
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await memberOrganizationService.endMembership({
        membershipId: activeMembership.id,
        endsOn: membershipEndDate,
        reason: membershipEndReason,
      });
      await refreshSelectedMemberHistory();
      setSuccess('Primary Member status ended and retained in history.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update membership.');
    } finally {
      setIsSaving(false);
    }
  };

  const endAppointment = async (appointment: MemberDesignationAppointment) => {
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await memberOrganizationService.endDesignation({
        appointmentId: appointment.id,
        endsOn: appointmentEndDates[appointment.id] ?? today(),
        reason: appointmentEndReasons[appointment.id] ?? 'term_ended',
      });
      await refreshSelectedMemberHistory();
      setSuccess('Designation appointment ended and retained in history.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not end designation.');
    } finally {
      setIsSaving(false);
    }
  };

  const createCommittee = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!committeeNameEn.trim() || !committeeNameHi.trim() || !mylWingId || !committeeStateId) {
      setError('Complete the committee name, active wing, and state.');
      return;
    }
    const zone = committeeScope !== 'state' ? committeeZoneId : undefined;
    const district = committeeScope === 'district' ? committeeDistrictId : undefined;
    if ((committeeScope !== 'state' && !zone) || (committeeScope === 'district' && !district)) {
      setError('Select the geography for this committee scope.');
      return;
    }
    setIsSaving(true);
    try {
      await organizationAdminService.saveCommittee({
        nameEn: committeeNameEn,
        nameHi: committeeNameHi,
        descriptionEn: '',
        descriptionHi: '',
        wingId: mylWingId,
        scopeLevel: committeeScope,
        stateId: committeeStateId,
        zoneId: zone,
        districtId: district,
        startsOn: committeeStartsOn,
        status: 'active',
      });
      setCommitteeNameEn('');
      setCommitteeNameHi('');
      await loadData();
      setSuccess('Committee created. You can now add its post designations.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not create committee.');
    } finally {
      setIsSaving(false);
    }
  };

  const createCommitteePost = async (event: React.FormEvent) => {
    event.preventDefault();
    const committee = visibleCommittees.find((item) => item.id === newPostCommitteeId);
    if (!committee || !newPostTitleEn.trim() || !newPostTitleHi.trim()) {
      setError('Select a committee and complete both designation titles.');
      return;
    }
    const level = committee.scopeLevel === 'zonal' ? 'zonal' : committee.scopeLevel;
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await organizationAdminService.savePost({
        id: '',
        titleEn: newPostTitleEn,
        titleHi: newPostTitleHi,
        level,
        wingId: committee.wingId,
        committeeId: committee.id,
        descriptionEn: '',
        descriptionHi: '',
        status: 'active',
      });
      setNewPostTitleEn('');
      setNewPostTitleHi('');
      await loadData();
      setSuccess('Committee post designation created.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not create committee designation.');
    } finally {
      setIsSaving(false);
    }
  };

  const closeCommittee = async (committee: OrganizationCommittee) => {
    if (!window.confirm(`Close "${committee.nameEn}" and end its active appointments today?`)) return;
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await organizationAdminService.saveCommittee({ ...committee, status: 'closed', endsOn: today() });
      await loadData();
      setSuccess('Committee closed; active appointments were archived.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not close committee.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!canManage(currentUser.role)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-rose-700" />
        <h1 className="mt-3 text-xl font-black text-stone-900">{lang === 'hi' ? 'पहुंच प्रतिबंधित' : 'Access restricted'}</h1>
        <p className="mt-2 text-sm text-stone-600">{lang === 'hi' ? 'यह डेस्क अधिकृत संगठन प्रशासकों के लिए है।' : 'This desk is for authorized organization administrators.'}</p>
      </div>
    );
  }

  const committeeScopes: CommitteeScope[] = currentUser.role === 'superadmin'
    ? ['state', 'zonal', 'district']
    : currentUser.role === 'state_admin' ? ['state', 'zonal'] : ['district'];
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-7 sm:px-6">
      <header className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 p-5 text-white shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-200">
          <UserRoundCog className="h-4 w-4" />
          {lang === 'hi' ? 'सदस्य व विशेष समिति प्रबंधन' : 'Membership & Special Committee Desk'}
        </div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{lang === 'hi' ? 'संगठनात्मक कार्यकाल व समितियां' : 'Organization appointments & committees'}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-200">
          {lang === 'hi'
            ? 'प्राथमिक सदस्यता पद-परिवर्तन से अलग रहती है। सभी पद व समितियां दिनांकित इतिहास के रूप में सुरक्षित रहते हैं।'
            : 'Primary membership is independent of office changes. Appointments and special committees are kept as dated history.'}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3" role="tablist">
        <button type="button" role="tab" aria-selected={activeTab === 'members'} onClick={() => setActiveTab('members')} className={`rounded-lg px-4 py-2 text-sm font-bold ${activeTab === 'members' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}>
          {lang === 'hi' ? 'सदस्य इतिहास व पद' : 'Member history & posts'}
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'committees'} onClick={() => setActiveTab('committees')} className={`rounded-lg px-4 py-2 text-sm font-bold ${activeTab === 'committees' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}>
          {lang === 'hi' ? 'विशेष समितियां' : 'Special committees'}
        </button>
      </div>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {success && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}
      {isLoading && <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">{lang === 'hi' ? 'संगठन डेटा लोड हो रहा है…' : 'Loading organization data…'}</div>}

      {!isLoading && activeTab === 'members' && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.5fr)]">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <label className="block text-sm font-bold text-stone-800" htmlFor="member-select">
              {lang === 'hi' ? 'स्वीकृत सदस्य चुनें' : 'Select an approved member'}
            </label>
            <select id="member-select" value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)} className={fieldClass}>
              <option value="">{lang === 'hi' ? 'सदस्य चुनें' : 'Choose member'}</option>
              {approvedMembers.map((member) => <option key={member.recordId} value={member.recordId}>{member.fullName} · {member.district} · {member.id}</option>)}
            </select>
            {selectedMember && (
              <>
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="font-extrabold text-stone-900">{selectedMember.fullName}</p>
                  <p className="mt-1 text-xs text-stone-600">{selectedMember.id} · {selectedMember.district}{selectedMember.subDistrict ? ` · ${selectedMember.subDistrict}` : ''}</p>
                  <p className="mt-2 text-xs font-bold text-emerald-900">{activeMembership ? 'Primary Member · Active' : 'Primary membership ended'}</p>
                </div>
                {activeMembership && (
                  <div className="space-y-2 border-t border-stone-100 pt-4">
                    <h2 className="text-sm font-extrabold text-stone-800">{lang === 'hi' ? 'सदस्यता समाप्त करें' : 'Record membership departure'}</h2>
                    <input aria-label="Membership end date" type="date" min={activeMembership.startsOn} max={today()} value={membershipEndDate} onChange={(event) => setMembershipEndDate(event.target.value)} className={fieldClass} />
                    <select value={membershipEndReason} onChange={(event) => setMembershipEndReason(event.target.value as typeof membershipEndReason)} className={fieldClass}>
                      <option value="joined_other_organization">{lang === 'hi' ? 'दूसरे संगठन में शामिल हुए' : 'Joined another organization'}</option>
                      <option value="resigned">{lang === 'hi' ? 'स्वेच्छा से सदस्यता छोड़ी' : 'Resigned'}</option>
                      <option value="other">{lang === 'hi' ? 'अन्य कारण' : 'Other reason'}</option>
                    </select>
                    <button type="button" disabled={isSaving} onClick={() => {
                      if (window.confirm('End this member’s Primary Member status and close active appointments on this date?')) void submitMembershipEnd();
                    }} className="w-full rounded-lg border border-rose-300 px-3 py-2 text-sm font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-50">
                      {lang === 'hi' ? 'सदस्यता समाप्त दर्ज करें' : 'End Primary Member status'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-5">
            {selectedMember ? (
              <>
                {activeMembership && (
                  <form onSubmit={(event) => { void submitAppointment(event); }} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                    <div>
                      <h2 className="text-lg font-extrabold text-stone-900">{lang === 'hi' ? 'पद नियुक्ति दर्ज करें' : 'Record an office appointment'}</h2>
                      <p className="mt-1 text-xs text-stone-600">{lang === 'hi' ? 'प्राथमिक सदस्यता जारी रहेगी। विशेष समिति के पद साथ-साथ रखे जा सकते हैं।' : 'Primary membership continues; special committee posts may overlap.'}</p>
                    </div>
                    <select required value={selectedPostId} onChange={(event) => setSelectedPostId(event.target.value)} className={fieldClass}>
                      <option value="">{lang === 'hi' ? 'सक्रिय पद चुनें' : 'Select active designation'}</option>
                      {visiblePosts.map((post) => <option key={post.id} value={post.id}>{post.titleEn}{post.committeeId ? ` · ${committees.find((item) => item.id === post.committeeId)?.nameEn ?? 'Committee'}` : ` · ${post.level}`}</option>)}
                    </select>
                    {selectedCommittee && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
                        {selectedCommittee.nameEn} · {selectedCommittee.scopeLevel} · {selectedCommittee.status}
                      </div>
                    )}
                    {selectedPost && !selectedCommittee && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="text-xs font-bold text-stone-700">
                          State
                          <select value={stateId} onChange={(event) => setStateId(event.target.value)} className={`${fieldClass} mt-1`}>
                            {states.map((state) => <option key={state.id} value={state.id}>{state.name_en}</option>)}
                          </select>
                        </label>
                        {selectedPost.level !== 'state' && (
                          <label className="text-xs font-bold text-stone-700">
                            Zone
                            <select value={zoneId} onChange={(event) => { setZoneId(event.target.value); setDistrictId(''); }} disabled={currentUser.role === 'district_incharge'} className={`${fieldClass} mt-1 disabled:bg-stone-100`}>
                              <option value="">Select zone</option>
                              {selectedStateZones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name_en}</option>)}
                            </select>
                          </label>
                        )}
                        {['district', 'block', 'ward'].includes(selectedPost.level) && (
                          <label className="text-xs font-bold text-stone-700">
                            District
                            <select value={districtId} onChange={(event) => { setDistrictId(event.target.value); setSubDistrictId(''); }} disabled={currentUser.role === 'district_incharge'} className={`${fieldClass} mt-1 disabled:bg-stone-100`}>
                              <option value="">Select district</option>
                              {scopedDistricts.map((district) => <option key={district.id} value={district.id}>{district.name_en}</option>)}
                            </select>
                          </label>
                        )}
                        {['block', 'ward'].includes(selectedPost.level) && (
                          <label className="text-xs font-bold text-stone-700">
                            Local unit
                            <select value={subDistrictId} onChange={(event) => setSubDistrictId(event.target.value)} className={`${fieldClass} mt-1`}>
                              <option value="">Select local unit</option>
                              {subDistricts.map((unit) => <option key={unit.id} value={unit.id}>{unit.name_en}</option>)}
                            </select>
                          </label>
                        )}
                      </div>
                    )}
                    <label className="block text-xs font-bold text-stone-700">
                      {lang === 'hi' ? 'प्रभावी तिथि' : 'Effective from'}
                      <input required type="date" max={today()} value={startsOn} onChange={(event) => setStartsOn(event.target.value)} className={`${fieldClass} mt-1`} />
                    </label>
                    <button type="submit" disabled={isSaving || !selectedPost} className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50">
                      {isSaving ? 'Saving…' : (lang === 'hi' ? 'नियुक्ति सुरक्षित करें' : 'Save appointment')}
                    </button>
                  </form>
                )}

                <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-stone-900"><Clock3 className="h-4 w-4 text-emerald-800" />{lang === 'hi' ? 'सदस्यता व पद इतिहास' : 'Membership & appointment history'}</h2>
                  <div className="space-y-2">
                    {membershipRows.map((membership) => (
                      <div key={membership.id} className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                        <p className="text-sm font-bold text-emerald-950">Primary Member · {membership.endsOn ? 'Ended' : 'Active'}</p>
                        <p className="mt-1 text-xs text-stone-700">{membership.startsOn} — {membership.endsOn ?? 'Present'}{membership.endReason ? ` · ${membership.endReason.replaceAll('_', ' ')}` : ''}</p>
                        {membership.endNotes && <p className="mt-1 text-xs text-stone-600">{membership.endNotes}</p>}
                      </div>
                    ))}
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="space-y-2 rounded-xl border border-stone-200 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-stone-900">{lang === 'hi' ? appointment.designationTitleHi || appointment.designationTitleEn : appointment.designationTitleEn}</p>
                            <p className="mt-1 text-xs text-stone-600">{appointment.committeeNameEn ? `${appointment.committeeNameEn} · ` : ''}{appointment.scopeLevel} · {appointment.startsOn} — {appointment.endsOn ?? 'Present'}</p>
                          </div>
                          {!appointment.endsOn && canEndAppointment(appointment) && (
                            <div className="flex flex-wrap items-center gap-2">
                              <input aria-label="Appointment end date" type="date" min={appointment.startsOn} max={today()} value={appointmentEndDates[appointment.id] ?? today()} onChange={(event) => setAppointmentEndDates((values) => ({ ...values, [appointment.id]: event.target.value }))} className="rounded-lg border border-stone-300 px-2 py-1 text-xs" />
                              <select aria-label="Appointment end reason" value={appointmentEndReasons[appointment.id] ?? 'term_ended'} onChange={(event) => setAppointmentEndReasons((values) => ({ ...values, [appointment.id]: event.target.value as 'term_ended' | 'resigned' | 'replaced' | 'other' }))} className="rounded-lg border border-stone-300 px-2 py-1 text-xs">
                                <option value="term_ended">Term ended</option>
                                <option value="resigned">Resigned</option>
                                <option value="replaced">Replaced</option>
                                <option value="other">Other</option>
                              </select>
                              <button type="button" disabled={isSaving} onClick={() => {
                                if (window.confirm(`End ${appointment.designationTitleEn} on ${appointmentEndDates[appointment.id] ?? today()}?`)) void endAppointment(appointment);
                              }} className="rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-50">End</button>
                            </div>
                          )}
                        </div>
                        {appointment.endReason && <p className="text-xs text-stone-500">End reason: {appointment.endReason.replaceAll('_', ' ')}{appointment.endNotes ? ` · ${appointment.endNotes}` : ''}</p>}
                      </div>
                    ))}
                    {membershipRows.length === 0 && appointments.length === 0 && <p className="text-sm text-stone-500">{lang === 'hi' ? 'अभी कोई सदस्यता इतिहास नहीं मिला।' : 'No membership history found.'}</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-500">
                {lang === 'hi' ? 'इतिहास देखने या पद नियुक्त करने के लिए स्वीकृत सदस्य चुनें।' : 'Choose an approved member to review history or assign a post.'}
              </div>
            )}
          </div>
        </section>
      )}

      {!isLoading && activeTab === 'committees' && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <form onSubmit={(event) => { void createCommittee(event); }} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-stone-900"><Building2 className="h-5 w-5 text-emerald-800" />{lang === 'hi' ? 'विशेष कार्य समिति बनाएं' : 'Create a special-task committee'}</h2>
            <p className="text-xs leading-relaxed text-stone-600">{lang === 'hi' ? 'हर समिति मुस्लिम यूथ लीग के अंतर्गत होगी। पद और नियुक्तियां समिति से जुड़ेंगी।' : 'Each committee belongs to Muslim Youth League; its designations and appointments remain linked to that committee.'}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-stone-700">
                Scope
                <select value={committeeScope} onChange={(event) => setCommitteeScope(event.target.value as CommitteeScope)} className={`${fieldClass} mt-1`}>
                  {committeeScopes.map((scope) => <option key={scope} value={scope}>{scope === 'zonal' ? 'Zone' : scope}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold text-stone-700">
                State
                <select value={committeeStateId} onChange={(event) => setCommitteeStateId(event.target.value)} className={`${fieldClass} mt-1`}>
                  {states.map((state) => <option key={state.id} value={state.id}>{state.name_en}</option>)}
                </select>
              </label>
              {committeeScope !== 'state' && (
                <label className="text-xs font-bold text-stone-700">
                  Zone
                  <select value={committeeZoneId} onChange={(event) => { setCommitteeZoneId(event.target.value); setCommitteeDistrictId(''); }} className={`${fieldClass} mt-1`}>
                    <option value="">Select zone</option>
                    {selectedCommitteeZones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name_en}</option>)}
                  </select>
                </label>
              )}
              {committeeScope === 'district' && (
                <label className="text-xs font-bold text-stone-700">
                  District
                  <select value={committeeDistrictId} onChange={(event) => setCommitteeDistrictId(event.target.value)} disabled={currentUser.role === 'district_incharge'} className={`${fieldClass} mt-1 disabled:bg-stone-100`}>
                    <option value="">Select district</option>
                    {committeeScopedDistricts.map((district) => <option key={district.id} value={district.id}>{district.name_en}</option>)}
                  </select>
                </label>
              )}
              <label className="text-xs font-bold text-stone-700">
                Starts on
                <input type="date" required max={today()} value={committeeStartsOn} onChange={(event) => setCommitteeStartsOn(event.target.value)} className={`${fieldClass} mt-1`} />
              </label>
            </div>
            <label className="block text-xs font-bold text-stone-700">
              Committee name (English)
              <input required value={committeeNameEn} onChange={(event) => setCommitteeNameEn(event.target.value)} className={`${fieldClass} mt-1`} />
            </label>
            <label className="block text-xs font-bold text-stone-700">
              समिति का नाम (हिंदी)
              <input required value={committeeNameHi} onChange={(event) => setCommitteeNameHi(event.target.value)} className={`${fieldClass} mt-1`} />
            </label>
            <button type="submit" disabled={isSaving || !mylWingId} className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50">
              {isSaving ? 'Saving…' : (lang === 'hi' ? 'समिति बनाएं' : 'Create committee')}
            </button>
          </form>

          <div className="space-y-4">
            <form onSubmit={(event) => { void createCommitteePost(event); }} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-stone-900"><CalendarDays className="h-5 w-5 text-blue-800" />{lang === 'hi' ? 'समिति का पद बनाएं' : 'Add a committee post'}</h2>
              <select required value={newPostCommitteeId} onChange={(event) => setNewPostCommitteeId(event.target.value)} className={fieldClass}>
                <option value="">Select open committee</option>
                {visibleCommittees.filter((committee) => committee.status !== 'closed').map((committee) => <option key={committee.id} value={committee.id}>{committee.nameEn} · {committee.scopeLevel}</option>)}
              </select>
              <label className="block text-xs font-bold text-stone-700">Post title (English)<input required value={newPostTitleEn} onChange={(event) => setNewPostTitleEn(event.target.value)} className={`${fieldClass} mt-1`} /></label>
              <label className="block text-xs font-bold text-stone-700">पद का नाम (हिंदी)<input required value={newPostTitleHi} onChange={(event) => setNewPostTitleHi(event.target.value)} className={`${fieldClass} mt-1`} /></label>
              <button type="submit" disabled={isSaving || !newPostCommitteeId || !mylWingId} className="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-950 disabled:opacity-50">
                {isSaving ? 'Saving…' : (lang === 'hi' ? 'पद सुरक्षित करें' : 'Save committee post')}
              </button>
            </form>

            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-extrabold text-stone-900">{lang === 'hi' ? 'समिति सूची' : 'Committees'}</h2>
              {visibleCommittees.map((committee) => (
                <article key={committee.id} className="rounded-xl border border-stone-200 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-stone-900">{lang === 'hi' ? committee.nameHi : committee.nameEn}</h3>
                      <p className="mt-1 text-xs capitalize text-stone-600">{committee.scopeLevel} · {committee.status} · {committee.startsOn}{committee.endsOn ? ` — ${committee.endsOn}` : ''}</p>
                    </div>
                    {committee.status !== 'closed' && (
                      <button type="button" disabled={isSaving} onClick={() => { void closeCommittee(committee); }} className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-50">
                        {lang === 'hi' ? 'समिति बंद करें' : 'Close committee'}
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {!visibleCommittees.length && <p className="text-sm text-stone-500">{lang === 'hi' ? 'अभी कोई समिति नहीं है।' : 'No committees in your scope yet.'}</p>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
