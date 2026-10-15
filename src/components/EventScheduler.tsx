import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Share2, 
  PlusCircle, 
  Clock, 
  Check, 
  Trash2, 
  Edit3, 
  Lock, 
  ShieldAlert 
} from 'lucide-react';
import { PartyEvent, Language, EventCategory, AuthUser } from '../types';
import { eventService } from '../services/eventService';
import { TranslateButton } from './common/TranslateButton';
import { translateEnglishToHindi } from '../utils/translationService';
import { referenceDataService, type DistrictOption, type LookupOption } from '../services/referenceDataService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
  onOpenSocialBroadcast: (event: PartyEvent) => void;
}

export const EventScheduler: React.FC<Props> = ({ 
  lang, 
  currentUser, 
  onOpenSocialBroadcast 
}) => {
  const [events, setEvents] = useState<PartyEvent[]>([]);
  const [dataError, setDataError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PartyEvent | null>(null);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descHi, setDescHi] = useState('');
  const [category, setCategory] = useState<EventCategory>('career_conclave');
  const [date, setDate] = useState('2026-11-15');
  const [time, setTime] = useState('11:00 AM');
  const [locationEn, setLocationEn] = useState('');
  const [locationHi, setLocationHi] = useState('');
  const [district, setDistrict] = useState(currentUser.district || 'Moradabad');
  const [districtId, setDistrictId] = useState('');
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<LookupOption[]>([]);
  const [lookupError, setLookupError] = useState('');
  const [state] = useState('Uttar Pradesh');
  const [coordinatorName, setCoordinatorName] = useState(currentUser.name || 'Adv. Sarfaraz Ahmed');
  const [coordinatorPhone, setCoordinatorPhone] = useState(currentUser.phone || '+91 98370 00112');

  const isAuthorized = currentUser.role === 'superadmin' || currentUser.role === 'press_release';

  useEffect(() => {
    let cancelled = false;
    void eventService.list()
      .then((rows) => { if (!cancelled) { setEvents(rows); setDataError(''); } })
      .catch((error: unknown) => { if (!cancelled) setDataError(error instanceof Error ? error.message : 'Could not load events from Supabase.'); });

    void Promise.all([referenceDataService.districts(), referenceDataService.eventCategories()])
      .then(([districtRows, categoryRows]) => {
        if (cancelled) return;
        setDistrictOptions(districtRows);
        setCategoryOptions(categoryRows);
        const initialDistrict = districtRows.find((item) => item.name_en.toLowerCase() === (currentUser.district || 'Moradabad').toLowerCase())
          || districtRows.find((item) => item.code === 'moradabad')
          || districtRows[0];
        if (initialDistrict) {
          setDistrictId(initialDistrict.id);
          setDistrict(initialDistrict.name_en);
        }
        setLookupError('');
      })
      .catch((error: unknown) => {
        if (!cancelled) setLookupError(error instanceof Error ? error.message : 'Could not load reference data from Supabase.');
      });
    return () => { cancelled = true; };
  }, [currentUser.district]);

  const refreshEvents = async () => {
    const rows = await eventService.list();
    setEvents(rows);
    setDataError('');
  };

  const handleToggleRsvp = async (eventId: string, rsvpType: 'going' | 'maybe') => {
    try {
      await eventService.toggleRsvp(eventId, rsvpType);
      await refreshEvents();
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Could not save event RSVP.');
    }
  };

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setTitleEn('');
    setTitleHi('');
    setDescEn('');
    setDescHi('');
    setLocationEn('');
    setLocationHi('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (ev: PartyEvent) => {
    setEditingEvent(ev);
    setTitleEn(ev.title.en);
    setTitleHi(ev.title.hi);
    setDescEn(ev.description.en);
    setDescHi(ev.description.hi);
    setCategory(ev.category);
    setDate(ev.date);
    setTime(ev.time);
    setLocationEn(ev.location.en);
    setLocationHi(ev.location.hi);
    setDistrict(ev.district);
    const matchingDistrict = districtOptions.find((item) => item.name_en.toLowerCase() === ev.district.toLowerCase());
    setDistrictId(matchingDistrict?.id || '');
    setCoordinatorName(ev.coordinator.name);
    setCoordinatorPhone(ev.coordinator.phone);
    setShowAddModal(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event schedule?')) return;
    try {
      await eventService.remove(eventId);
      await refreshEvents();
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Could not delete event.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !locationEn || !districtId) return;

    const eventToSave: PartyEvent = {
      id: editingEvent ? editingEvent.id : `ev-up-${Date.now()}`,
      title: { en: titleEn, hi: titleHi || titleEn },
      description: { en: descEn, hi: descHi || descEn },
      category,
      date,
      time,
      location: { en: locationEn, hi: locationHi || locationEn },
      district,
      state: 'Uttar Pradesh',
      rsvpCount: editingEvent ? editingEvent.rsvpCount : 0,
      userRsvp: editingEvent ? editingEvent.userRsvp : null,
      coordinator: {
        name: coordinatorName,
        phone: coordinatorPhone,
        designation: `${currentUser.designation || 'In-Charge'}`,
      },
      highlightTag: {
        en: 'UP State Event',
        hi: 'यूपी राज्य कार्यक्रम',
      },
      createdBy: currentUser.name,
    };

    try {
      await eventService.save(eventToSave);
      await refreshEvents();
      setShowAddModal(false);
      setEditingEvent(null);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Could not save event.');
    }
  };

  const downloadIcs = (event: PartyEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Muslim Youth League UP//Event//EN
BEGIN:VEVENT
SUMMARY:${event.title.en}
DESCRIPTION:${event.description.en}
LOCATION:${event.location.en}
DTSTART:${event.date.replace(/-/g, '')}T090000Z
DTEND:${event.date.replace(/-/g, '')}T130000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'all') return true;
    return ev.category === selectedCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {dataError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{dataError}</div>}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <span>{lang === 'hi' ? 'कार्यक्रम व रैलियां' : 'Scheduled Events & Actions'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'उत्तर प्रदेश युवा संपर्क' : 'UP Ground Outreach'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'MYL व MSF कार्यक्रम एवं सभाएं' : 'MYL & MSF Youth Conferences & Rallies'}
          </h1>
          <p className="text-stone-600 text-xs max-w-2xl mt-1">
            {lang === 'hi'
              ? 'आगामी लाइफ लिफ्ट सम्मेलनों, छात्र पंचायतों और सेवा शिविरों में भागीदारी सुनिश्चित करें, आरएसवीपी दर्ज करें और सोशल मीडिया पर एक क्लिक में साझा करें।'
              : 'Discover scheduled Life Lift career conclaves, MSF student conventions, and White Guard relief seva camps across UP.'}
          </p>
        </div>

        {/* Action button based on Auth */}
        {isAuthorized ? (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'नया कार्यक्रम जोड़ें' : 'Schedule New Event'}</span>
          </button>
        ) : (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              {lang === 'hi' 
                ? 'केवल प्रेस रिलीज प्रभारी (press_release) या सुपर एडमिन ही कार्यक्रम व रैलियां प्रकाशित कर सकते हैं' 
                : 'Only Press Release Role or Super Admin can publish/edit rallies (Public/Cadres can RSVP)'}
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: { en: 'All Events', hi: 'सभी कार्यक्रम' } },
          ...categoryOptions.map((item) => ({
            key: item.code,
            label: { en: item.name_en, hi: item.name_hi || item.name_en },
          })),
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedCategory(item.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === item.key
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {item.label[lang]}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="p-5 bg-white border border-stone-200 rounded-xl space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category & Date badge + In-Charge controls */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
                  ★ {ev.category.replace('_', ' ').toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-600">
                    {ev.date} · {ev.time}
                  </span>
                  {/* Authorized CRUD controls */}
                  {isAuthorized && (
                    <div className="flex items-center gap-1 ml-1 pl-2 border-l border-stone-200">
                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="p-1 text-stone-400 hover:text-blue-900 transition-colors"
                        title="Edit Event"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {lang === 'hi' ? ev.title.hi : ev.title.en}
                </h3>
                {lang === 'hi' && (
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {ev.title.en}
                  </p>
                )}
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {lang === 'hi' ? ev.description.hi : ev.description.en}
                </p>
              </div>

              {/* Location & Coordinator */}
              <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 text-stone-700">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="font-medium">
                    {lang === 'hi' ? ev.location.hi : ev.location.en} ({ev.district})
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                  <span>Coordinator: {ev.coordinator.name}</span>
                  <span className="font-mono">{ev.coordinator.phone}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              {/* RSVP Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentUser.role === 'public'}
                  title={currentUser.role === 'public' ? (lang === 'hi' ? 'RSVP के लिए पहले लॉगिन करें' : 'Sign in to RSVP') : undefined}
                  onClick={() => handleToggleRsvp(ev.id, 'going')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                    ev.userRsvp === 'going'
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{ev.userRsvp === 'going' ? (lang === 'hi' ? 'आ रहे हैं' : 'Going') : (lang === 'hi' ? 'मैं आ रहा हूँ' : 'RSVP')}</span>
                </button>

                <span className="text-[11px] font-mono font-medium text-stone-500 ml-1">
                  {ev.rsvpCount.toLocaleString()} {lang === 'hi' ? 'कार्यकर्ता' : 'attending'}
                </span>
              </div>

              {/* Share & Calendar Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => downloadIcs(ev)}
                  title="Add to Calendar (.ics)"
                  className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenSocialBroadcast(ev)}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-800" />
                  <span>{lang === 'hi' ? 'शेयर करें' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Event Modal (Protected) */}
      {showAddModal && isAuthorized && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              {editingEvent ? 'Edit Event Schedule' : (lang === 'hi' ? 'नवीन कार्यक्रम / रैली अनुसूची' : 'Schedule New Youth Event')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Event Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life Lift State Career Conclave"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  onBlur={async () => {
                    if (titleEn.trim() && !titleHi.trim()) {
                      const tr = await translateEnglishToHindi(titleEn);
                      if (tr) setTitleHi(tr);
                    }
                  }}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    कार्यक्रम शीर्षक (हिंदी)
                  </label>
                  <TranslateButton
                    englishText={titleEn}
                    onTranslated={(hi) => setTitleHi(hi)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="उदा. लाइफ लिफ्ट राज्य करियर महासम्मेलन"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    disabled={categoryOptions.length === 0}
                    className="w-full p-2 border border-stone-300 rounded bg-white disabled:bg-stone-100"
                  >
                    <option value="">{lang === 'hi' ? 'श्रेणी चुनें' : 'Select category'}</option>
                    {categoryOptions.map((item) => <option key={item.id} value={item.code}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District (UP)</label>
                  <select
                    required
                    value={districtId}
                    onChange={(e) => {
                      const selected = districtOptions.find((item) => item.id === e.target.value);
                      setDistrictId(e.target.value);
                      setDistrict(selected?.name_en || '');
                    }}
                    disabled={districtOptions.length === 0}
                    className="w-full p-2 border border-stone-300 rounded bg-white focus:border-emerald-700 focus:outline-none disabled:bg-stone-100"
                  >
                    <option value="">{lang === 'hi' ? 'ज़िला चुनें' : 'Select district'}</option>
                    {districtOptions.map((item) => <option key={item.id} value={item.id}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                  </select>
                  {lookupError && <p role="alert" className="mt-1 text-rose-700 text-[11px]">{lookupError}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Venue / Location (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rifa-e-Aam Club Grounds, Lucknow"
                  value={locationEn}
                  onChange={(e) => setLocationEn(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Event agenda and key speakers..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                >
                  {editingEvent ? 'Save Changes' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
