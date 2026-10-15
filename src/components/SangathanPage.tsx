import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, Search, Users, MapPin, Phone, Mail, CalendarDays, RefreshCw, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import type { AuthUser, Language } from '../types';
import { sangathanService, type SangathanDistrict, type SangathanTenure } from '../services/sangathanService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
}

const canManage = (role: AuthUser['role']) =>
  ['superadmin', 'state_president', 'state_admin', 'district_incharge'].includes(role);

const dateLabel = (value: string, lang: Language) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
};

export const SangathanPage: React.FC<Props> = ({ lang, currentUser }) => {
  const hi = lang === 'hi';
  const [districts, setDistricts] = useState<SangathanDistrict[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [leadership, setLeadership] = useState<SangathanTenure[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [leadershipLoading, setLeadershipLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leaderName, setLeaderName] = useState('');
  const [leaderNameHi, setLeaderNameHi] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postTitleHi, setPostTitleHi] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [appointmentStatus, setAppointmentStatus] = useState<'current' | 'acting'>('current');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const loadDistricts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await sangathanService.districts();
      setDistricts(rows);
      setSelectedId((old) => rows.some((row) => row.id === old) ? old : rows[0]?.id ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load organisation directory.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLeadership = useCallback(async (districtId: string) => {
    if (!districtId) { setLeadership([]); return; }
    setLeadershipLoading(true);
    try {
      setLeadership(await sangathanService.leadership(districtId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leadership.');
    } finally {
      setLeadershipLoading(false);
    }
  }, []);

  useEffect(() => { void loadDistricts(); }, [loadDistricts]);
  useEffect(() => { void loadLeadership(selectedId); }, [selectedId, loadLeadership]);

  const filteredDistricts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return districts;
    return districts.filter((district) =>
      district.nameEn.toLocaleLowerCase().includes(term)
      || district.nameHi.includes(query.trim())
      || district.inChargeName?.toLocaleLowerCase().includes(term)
    );
  }, [districts, query]);

  const selected = districts.find((district) => district.id === selectedId) ?? null;
  const activeLeaders = leadership.filter((item) => item.status === 'current' || item.status === 'acting');
  const historicalLeaders = leadership.filter((item) => item.status === 'past');

  const saveAppointment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      await sangathanService.appoint({
        districtId: selected.id,
        leaderNameEn: leaderName,
        leaderNameHi,
        postTitleEn: postTitle,
        postTitleHi,
        tenureStart: startDate,
        status: appointmentStatus,
        contactPhone: phone,
        email,
      });
      setShowForm(false);
      setLeaderName('');
      setLeaderNameHi('');
      setPostTitle('');
      setPostTitleHi('');
      setPhone('');
      setEmail('');
      await loadLeadership(selected.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save appointment.');
    } finally {
      setSaving(false);
    }
  };

  const removeAppointment = async (item: SangathanTenure) => {
    if (!window.confirm(hi ? 'क्या इस पदाधिकारी रिकॉर्ड को हटाना है? यह कार्रवाई वापस नहीं होगी।' : 'Delete this leadership record? This cannot be undone.')) return;
    setError('');
    try {
      await sangathanService.removeTenure(item.id);
      await loadLeadership(item.districtId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete leadership record.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="text-emerald-200 text-xs font-bold tracking-[0.2em] uppercase mb-3">MYL Uttar Pradesh</div>
              <h1 className="text-3xl sm:text-4xl font-black">{hi ? 'संगठन' : 'Sangathan'}</h1>
              <p className="text-emerald-50 mt-2 text-sm sm:text-base">{hi ? 'संगठनात्मक निर्देशिका एवं पदाधिकारी रिकॉर्ड' : 'Organisation directory and office-bearer records'}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 min-w-28">
                <div className="text-2xl font-black">{districts.length}</div>
                <div className="text-xs text-emerald-100">{hi ? 'डेटाबेस ज़िले' : 'District records'}</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 min-w-28">
                <div className="text-2xl font-black">{leadership.length}</div>
                <div className="text-xs text-emerald-100">{hi ? 'चयनित ज़िले के रिकॉर्ड' : 'Selected district records'}</div>
              </div>
              <button onClick={() => { void loadDistricts(); if (selectedId) void loadLeadership(selectedId); }} className="self-start inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-bold hover:bg-white/10">
                <RefreshCw className="w-4 h-4" /> {hi ? 'रीफ़्रेश' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="bg-white border border-stone-200 rounded-2xl overflow-hidden self-start">
          <div className="p-4 border-b border-stone-100">
            <h2 className="font-extrabold text-stone-900 mb-3">{hi ? 'ज़िला निर्देशिका' : 'District directory'}</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={hi ? 'ज़िला खोजें…' : 'Search districts…'} className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-emerald-600" />
            </div>
          </div>
          <div className="max-h-[620px] overflow-y-auto p-2">
            {loading && <p className="p-4 text-sm text-stone-500">{hi ? 'डेटाबेस से लोड हो रहा है…' : 'Loading from database…'}</p>}
            {!loading && filteredDistricts.map((district) => (
              <button key={district.id} onClick={() => setSelectedId(district.id)} className={`w-full text-left rounded-xl p-3 mb-1 transition-colors ${selectedId === district.id ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'hover:bg-stone-50 border border-transparent text-stone-700'}`}>
                <div className="font-bold text-sm">{hi ? district.nameHi : district.nameEn}</div>
                <div className="text-xs mt-1 text-stone-500">{district.inChargeName || (hi ? 'पदाधिकारी विवरण उपलब्ध नहीं' : 'No office-bearer record')}</div>
              </button>
            ))}
            {!loading && filteredDistricts.length === 0 && <p className="p-4 text-sm text-stone-500">{hi ? 'कोई ज़िला नहीं मिला।' : 'No districts found.'}</p>}
          </div>
        </aside>

        <section className="space-y-6">
          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
          {!selected && !loading && <div className="bg-white rounded-2xl border border-stone-200 p-8 text-sm text-stone-600">{hi ? 'ज़िला रिकॉर्ड उपलब्ध नहीं है। Supabase कॉन्फ़िगरेशन और RLS जाँचें।' : 'No district records are available. Check Supabase configuration and RLS.'}</div>}
          {selected && <>
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider"><Building2 className="w-4 h-4" /> {hi ? 'ज़िला संगठन' : 'District organisation'}</div>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">{hi ? selected.nameHi : selected.nameEn}</h2>
                  <p className="text-sm text-stone-500 mt-1">{selected.headquarters || (hi ? 'मुख्यालय प्रकाशित नहीं' : 'Headquarters not published')}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${selected.status === 'active' ? 'bg-emerald-100 text-emerald-800' : selected.status === 'growing' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'}`}>{selected.status === 'active' ? (hi ? 'सक्रिय' : 'Active') : selected.status === 'growing' ? (hi ? 'विकासशील' : 'Growing') : (hi ? 'गठनाधीन' : 'Forming')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
                  <Users className="w-5 h-5 text-emerald-700 mb-2" />
                  <div className="text-xl font-black text-stone-900">{selected.activeCadreCount}</div>
                  <div className="text-xs text-stone-500">{hi ? 'संगठन द्वारा दर्ज सक्रिय कैडर' : 'Active cadre count recorded by organisation'}</div>
                </div>
                <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
                  <MapPin className="w-5 h-5 text-emerald-700 mb-2" />
                  <div className="font-bold text-stone-900">{selected.headquarters || '—'}</div>
                  <div className="text-xs text-stone-500">{hi ? 'मुख्यालय / कार्यालय' : 'Headquarters / office'}</div>
                </div>
              </div>
              {selected.inChargeName && <div className="mt-4 border-t border-stone-100 pt-4">
                <div className="text-xs font-bold text-stone-500 mb-1">{hi ? 'ज़िला प्रभारी' : 'District in-charge'}</div>
                <div className="font-bold text-stone-900">{selected.inChargeName}</div>
                {selected.inChargePhone && <a href={`tel:${selected.inChargePhone}`} className="mt-1 inline-flex items-center gap-2 text-sm text-emerald-800"><Phone className="w-4 h-4" />{selected.inChargePhone}</a>}
              </div>}
              {selected.updatedAt && <p className="text-[11px] text-stone-400 mt-4">{hi ? 'अंतिम अपडेट' : 'Last updated'}: {dateLabel(selected.updatedAt, lang)}</p>}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg font-black text-stone-900">{hi ? 'पदाधिकारी एवं कार्यकाल' : 'Office-bearers & tenure'}</h3>
                  <p className="text-sm text-stone-500 mt-1">{hi ? 'रिकॉर्ड Supabase से लोड किए जाते हैं।' : 'Records are loaded from Supabase.'}</p>
                </div>
                {canManage(currentUser.role) && <button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />{hi ? 'पदाधिकारी जोड़ें' : 'Add office-bearer'}</button>}
              </div>

              {showForm && canManage(currentUser.role) && <form onSubmit={saveAppointment} className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                <h4 className="font-bold text-stone-900">{hi ? 'नया पदाधिकारी रिकॉर्ड' : 'New office-bearer record'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="text-xs font-bold text-stone-600">{hi ? 'नाम (अंग्रेज़ी) *' : 'Name (English) *'}<input required value={leaderName} onChange={(event) => setLeaderName(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                  <label className="text-xs font-bold text-stone-600">{hi ? 'नाम (हिंदी)' : 'Name (Hindi)'}<input value={leaderNameHi} onChange={(event) => setLeaderNameHi(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                  <label className="text-xs font-bold text-stone-600">{hi ? 'पद (अंग्रेज़ी) *' : 'Designation (English) *'}<input required value={postTitle} onChange={(event) => setPostTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                  <label className="text-xs font-bold text-stone-600">{hi ? 'पद (हिंदी)' : 'Designation (Hindi)'}<input value={postTitleHi} onChange={(event) => setPostTitleHi(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                  <label className="text-xs font-bold text-stone-600">{hi ? 'कार्यकाल प्रारंभ *' : 'Tenure start *'}<input type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                  <label className="text-xs font-bold text-stone-600">{hi ? 'स्थिति' : 'Status'}<select value={appointmentStatus} onChange={(event) => setAppointmentStatus(event.target.value as 'current' | 'acting')} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal"><option value="current">{hi ? 'वर्तमान' : 'Current'}</option><option value="acting">{hi ? 'कार्यवाहक' : 'Acting'}</option></select></label>
                  <label className="text-xs font-bold text-stone-600">{hi ? 'प्रकाशित संपर्क नंबर' : 'Public contact phone'}<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                  <label className="text-xs font-bold text-stone-600">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>
                </div>
                <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-bold">{hi ? 'रद्द करें' : 'Cancel'}</button><button disabled={saving} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{saving ? (hi ? 'सहेज रहे हैं…' : 'Saving…') : (hi ? 'रिकॉर्ड सहेजें' : 'Save record')}</button></div>
              </form>}

              {leadershipLoading && <p className="py-6 text-sm text-stone-500">{hi ? 'कार्यकाल लोड हो रहे हैं…' : 'Loading leadership records…'}</p>}
              {!leadershipLoading && activeLeaders.length === 0 && <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center"><ShieldCheck className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="font-bold text-stone-700">{hi ? 'वर्तमान पदाधिकारी रिकॉर्ड उपलब्ध नहीं' : 'No current office-bearer records'}</p><p className="text-xs text-stone-500 mt-1">{hi ? 'आधिकारिक पुष्टि के बाद अधिकृत प्रशासक रिकॉर्ड जोड़ सकते हैं।' : 'An authorised administrator can add records after official confirmation.'}</p></div>}
              <div className="space-y-3">
                {activeLeaders.map((item) => <article key={item.id} className="rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap"><span className="font-extrabold text-stone-900">{hi ? item.leaderNameHi || item.leaderNameEn : item.leaderNameEn}</span><span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">{item.status === 'acting' ? (hi ? 'कार्यवाहक' : 'Acting') : (hi ? 'वर्तमान' : 'Current')}</span></div>
                    <div className="text-sm text-emerald-800 font-semibold mt-1">{hi ? item.postTitleHi || item.postTitleEn : item.postTitleEn}</div>
                    <div className="text-xs text-stone-500 mt-2 flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{dateLabel(item.tenureStart, lang)}{item.tenureEnd ? ` – ${dateLabel(item.tenureEnd, lang)}` : ''}</div>
                    {item.contactPhone && <a href={`tel:${item.contactPhone}`} className="mt-2 inline-flex items-center gap-1.5 text-xs text-stone-600"><Phone className="w-3.5 h-3.5" />{item.contactPhone}</a>}
                    {item.email && <a href={`mailto:${item.email}`} className="ml-3 mt-2 inline-flex items-center gap-1.5 text-xs text-stone-600"><Mail className="w-3.5 h-3.5" />{item.email}</a>}
                  </div>
                  {canManage(currentUser.role) && <button onClick={() => void removeAppointment(item)} aria-label={hi ? 'रिकॉर्ड हटाएं' : 'Delete record'} className="self-start rounded-lg border border-rose-200 p-2 text-rose-700 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>}
                </article>)}
              </div>

              {historicalLeaders.length > 0 && <div className="mt-7 pt-5 border-t border-stone-100"><h4 className="font-extrabold text-stone-800 mb-3">{hi ? 'पूर्व कार्यकाल' : 'Previous tenures'}</h4><div className="space-y-2">{historicalLeaders.map((item) => <div key={item.id} className="rounded-lg bg-stone-50 p-3 flex flex-col sm:flex-row sm:justify-between gap-1"><div><span className="font-bold text-sm text-stone-800">{hi ? item.leaderNameHi || item.leaderNameEn : item.leaderNameEn}</span><span className="text-sm text-stone-600"> · {hi ? item.postTitleHi || item.postTitleEn : item.postTitleEn}</span></div><span className="text-xs text-stone-500">{dateLabel(item.tenureStart, lang)} – {item.tenureEnd ? dateLabel(item.tenureEnd, lang) : '—'}</span></div>)}</div></div>}
            </div>
          </>}
          <p className="text-xs text-stone-400">{hi ? 'निर्देशिका Supabase से संचालित है। सार्वजनिक पदाधिकारी और संपर्क विवरण प्रकाशित करने से पहले आधिकारिक पुष्टि आवश्यक है।' : 'This directory is powered by Supabase. Official verification is required before publishing office-bearers or contact details.'}</p>
        </section>
      </div>
    </div>
  );
};
