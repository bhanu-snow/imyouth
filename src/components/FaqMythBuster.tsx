import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  FileText,
  Sparkles
} from 'lucide-react';
import { Language, MythFaqItem, AuthUser } from '../types';
import { faqService } from '../services/faqService';
import { LadderSymbolIcon } from './PartySymbol';
import { TranslateButton } from './common/TranslateButton';
import { translateEnglishToHindi } from '../utils/translationService';
import { referenceDataService, type LookupOption } from '../services/referenceDataService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
}

export const FaqMythBuster: React.FC<Props> = ({ lang, currentUser }) => {
  const [faqs, setFaqs] = useState<MythFaqItem[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<LookupOption[]>([]);
  const [lookupError, setLookupError] = useState('');
  const [faqError, setFaqError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit / Add Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<MythFaqItem | null>(null);

  // Form states
  const [category, setCategory] = useState<MythFaqItem['category']>('history');
  const [mythEn, setMythEn] = useState('');
  const [mythHi, setMythHi] = useState('');
  const [factEn, setFactEn] = useState('');
  const [factHi, setFactHi] = useState('');
  const [detailedEn, setDetailedEn] = useState('');
  const [detailedHi, setDetailedHi] = useState('');
  const [pointsEnText, setPointsEnText] = useState('');
  const [pointsHiText, setPointsHiText] = useState('');

  const canEditContent = currentUser.role === 'superadmin' || currentUser.role === 'content_manager';

  useEffect(() => {
    loadFaqs();
    let cancelled = false;
    void referenceDataService.faqCategories()
      .then((rows) => { if (!cancelled) { setCategoryOptions(rows); setLookupError(''); } })
      .catch((error: unknown) => { if (!cancelled) setLookupError(error instanceof Error ? error.message : 'Could not load FAQ categories.'); });
    return () => { cancelled = true; };
  }, []);

  const loadFaqs = async () => {
    try {
      const list = await faqService.list();
      setFaqs(list);
      setFaqError('');
      setExpandedId((current) => current && list.some((item) => item.id === current) ? current : (list[0]?.id ?? null));
    } catch (error) {
      setFaqError(error instanceof Error ? error.message : 'Could not load FAQs from Supabase.');
    }
  };

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setCategory('history');
    setMythEn('');
    setMythHi('');
    setFactEn('');
    setFactHi('');
    setDetailedEn('');
    setDetailedHi('');
    setPointsEnText('');
    setPointsHiText('');
    setShowModal(true);
  };

  const handleOpenEdit = (faq: MythFaqItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFaq(faq);
    setCategory(faq.category);
    setMythEn(faq.mythEn);
    setMythHi(faq.mythHi);
    setFactEn(faq.factEn);
    setFactHi(faq.factHi);
    setDetailedEn(faq.detailedExplanationEn);
    setDetailedHi(faq.detailedExplanationHi);
    setPointsEnText(faq.cadreTalkingPointsEn.join('\n'));
    setPointsHiText(faq.cadreTalkingPointsHi.join('\n'));
    setShowModal(true);
  };

  const handleDeleteFaq = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(lang === 'hi' ? 'क्या आप इस FAQ को हटाना चाहते हैं?' : 'Are you sure you want to delete this FAQ clarification?')) return;
    try {
      await faqService.remove(id);
      await loadFaqs();
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Could not delete FAQ.');
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mythEn || !mythHi || !factEn || !factHi) return;

    const parsedPointsEn = pointsEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedPointsHi = pointsHiText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const faqData: MythFaqItem = {
      id: editingFaq ? editingFaq.id : `faq-${Date.now()}`,
      category,
      mythEn,
      mythHi,
      factEn,
      factHi,
      detailedExplanationEn: detailedEn,
      detailedExplanationHi: detailedHi,
      cadreTalkingPointsEn: parsedPointsEn.length ? parsedPointsEn : [factEn],
      cadreTalkingPointsHi: parsedPointsHi.length ? parsedPointsHi : [factHi],
    };

    try {
      await faqService.save(faqData);
      await loadFaqs();
      setShowModal(false);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Could not save FAQ to Supabase.');
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.mythEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.mythHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.factEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.factHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.detailedExplanationEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.detailedExplanationHi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShareFact = (faq: MythFaqItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mylup.org';
    const text = `📌 *तथ्य बनाम भ्रांति / Fact vs Propaganda*\n\n❌ *शंका:* ${faq.mythHi}\n\n✅ *ऐतिहासिक वास्तविकता:* ${faq.factHi}\n\n🇮🇳 *मुस्लिम यूथ लीग (MYL) उत्तर प्रदेश*\nअधिक जानकारी: ${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header with High-Visibility Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <LadderSymbolIcon size={16} />
            <span>{lang === 'hi' ? 'वैचारिक साक्ष्य व भ्रांति निवारण' : 'Ideological Evidence & Fact Verification'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'ऐतिहासिक वास्तविकता' : 'Myths vs Historical Reality'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {lang === 'hi'
              ? 'पार्टी से जुड़े भ्रम, मिथक और ऐतिहासिक तथ्य (FAQ)'
              : 'Clarifying Confusions: Myths vs Historical Reality (FAQ)'}
          </h1>

          <p className="text-stone-700 text-sm sm:text-base max-w-3xl leading-relaxed font-normal">
            {lang === 'hi'
              ? 'इंडियन यूनियन मुस्लिम लीग (IUML) और मुस्लिम यूथ लीग (MYL) के गठन (10 मार्च 1948 मद्रास), संविधान के प्रति निष्ठा, और उत्तर प्रदेश में हमारी भूमिका से जुड़े सभी सवालों के प्रामाणिक दस्तावेजी उत्तर।'
              : 'Official documentation and factual clarity on IUML’s post-independence founding (10 March 1948 in Madras), Constituent Assembly legacy, secular democratic commitments, and the role of MYL and MSF in Uttar Pradesh.'}
          </p>
        </div>

        {/* Content Manager Action Button */}
        {canEditContent ? (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? '+ नया मिथक / FAQ जोड़ें' : '+ Add New Myth / FAQ'}</span>
          </button>
        ) : (
          <div className="text-xs text-stone-500 bg-stone-100 p-2.5 rounded-xl border border-stone-200 shrink-0">
            {lang === 'hi' ? 'संपादक: कंटेंट मैनेजर (content_manager)' : 'Editor: Content Manager Role'}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'सवाल, तथ्य या विषय खोजें...' : 'Search myths, facts or keywords...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-white shadow-2xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { key: 'all', label: { en: 'All Questions', hi: 'सभी प्रश्न' } },
            { key: 'history', label: { en: '1948 History', hi: '1948 इतिहास' } },
            { key: 'up_focus', label: { en: 'UP Relevance', hi: 'यूपी में भूमिका' } },
            { key: 'secularism', label: { en: 'Secularism', hi: 'धर्मनिरपेक्षता' } },
            { key: 'wings', label: { en: 'MYL / MSF Wings', hi: 'संगठन विंग्स' } },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:text-stone-900'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List with High Visibility Fonts */}
      {faqError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {faqError}
        </div>
      )}
      {!faqError && faqs.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {lang === 'hi'
            ? 'Supabase में अभी FAQ रिकॉर्ड नहीं हैं। supabase/seed.sql को Supabase SQL Editor में चलाएँ, फिर पेज रीफ़्रेश करें।'
            : 'No FAQ records were found in Supabase. Run supabase/seed.sql in the Supabase SQL Editor, then refresh this page.'}
        </div>
      )}
      <div className="space-y-5">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md inline-block">
                        {lang === 'hi' ? 'भ्रामक मिथक / Common Myth' : 'Common Propaganda / Myth'}
                      </span>
                      <span className="text-xs text-stone-400 capitalize font-medium">
                        · {faq.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Highly Visible Myth Heading */}
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-stone-900 leading-snug">
                      {lang === 'hi' ? faq.mythHi : faq.mythEn}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canEditContent && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(faq, e)}
                          className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit FAQ (Content Manager)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFaq(faq.id, e)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <span className="text-xs sm:text-sm font-bold text-emerald-700 underline shrink-0 mt-1">
                      {isExpanded ? (lang === 'hi' ? 'संक्षिप्त करें' : 'Hide Details') : (lang === 'hi' ? 'तथ्य विस्तार देखें' : 'View Verified Fact')}
                    </span>
                  </div>
                </div>

                {/* Quick 1-Line Fact summary in Prominent Emerald Badge */}
                <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-start gap-3 text-sm sm:text-base font-bold text-emerald-950">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{lang === 'hi' ? faq.factHi : faq.factEn}</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-stone-200 space-y-5 animate-fade-in text-sm sm:text-base">
                  <div>
                    <h4 className="font-extrabold text-stone-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'hi' ? 'ऐतिहासिक व कानूनी संदर्भ:' : 'Historical & Legal Archival Context:'}</span>
                    </h4>
                    <p className="text-stone-800 leading-relaxed font-normal bg-stone-50 p-4 rounded-xl border border-stone-200/60 whitespace-pre-line text-sm sm:text-base">
                      {lang === 'hi' ? faq.detailedExplanationHi : faq.detailedExplanationEn}
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-emerald-50/60 via-stone-50 to-blue-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                    <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-sm sm:text-base">
                      <ShieldCheck className="w-4 h-4 text-blue-900" />
                      <span>{lang === 'hi' ? 'कार्यकर्ताओं के लिए मुख्य तर्क (Ground Cadre Talking Points):' : 'Key Talking Points for Cadres & Field Outreach:'}</span>
                    </h4>
                    <ul className="space-y-2 text-stone-800 text-sm sm:text-base">
                      {(lang === 'hi' ? faq.cadreTalkingPointsHi : faq.cadreTalkingPointsEn).map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                          <span className="leading-relaxed font-medium">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-stone-400 font-mono">
                      Ref ID: {faq.id}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleShareFact(faq, e)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'व्हाट्सएप पर यह तथ्य साझा करें' : 'Share Fact to WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CONTENT MANAGER ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-lg text-stone-900">
                  {editingFaq 
                    ? (lang === 'hi' ? 'मिथक व तथ्य संपादित करें (Content Desk)' : 'Edit Myth & Fact Clarification')
                    : (lang === 'hi' ? 'नया मिथक व ऐतिहासिक तथ्य जोड़ें' : 'Add New Myth & Archival Clarification')}
                </h3>
                <span className="text-xs text-emerald-800 font-semibold">
                  Bilingual Hindi & English Content Synchronization
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

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  {categoryOptions.map((item) => <option key={item.id} value={item.code}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                </select>
                {lookupError && <p role="alert" className="mt-1 text-rose-700">{lookupError}</p>}
              </div>

              {/* Myth Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-rose-800 mb-1">Propaganda / Myth (English) *</label>
                  <textarea
                    rows={2}
                    required
                    value={mythEn}
                    onChange={(e) => setMythEn(e.target.value)}
                    onBlur={async () => {
                      if (mythEn.trim() && !mythHi.trim()) {
                        const tr = await translateEnglishToHindi(mythEn);
                        if (tr) setMythHi(tr);
                      }
                    }}
                    placeholder="e.g. Is IUML a pre-partition party?"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-rose-800">भ्रामक मिथक / शंका (हिंदी) *</label>
                    <TranslateButton
                      englishText={mythEn}
                      onTranslated={(hi) => setMythHi(hi)}
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={mythHi}
                    onChange={(e) => setMythHi(e.target.value)}
                    placeholder="उदा. क्या IUML बंटवारे से पहले की पार्टी है?"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Fact Summary Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-800 mb-1">1-Line Fact Summary (English) *</label>
                  <textarea
                    rows={2}
                    required
                    value={factEn}
                    onChange={(e) => setFactEn(e.target.value)}
                    onBlur={async () => {
                      if (factEn.trim() && !factHi.trim()) {
                        const tr = await translateEnglishToHindi(factEn);
                        if (tr) setFactHi(tr);
                      }
                    }}
                    placeholder="e.g. FALSE. IUML was founded in independent India on 10 March 1948 in Madras..."
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-emerald-800">1-पंक्ति तथ्य निष्कर्ष (हिंदी) *</label>
                    <TranslateButton
                      englishText={factEn}
                      onTranslated={(hi) => setFactHi(hi)}
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={factHi}
                    onChange={(e) => setFactHi(e.target.value)}
                    placeholder="उदा. पूर्णतः असत्य। IUML का गठन आज़ाद भारत में 10 मार्च 1948 को मद्रास में हुआ..."
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Detailed Historical Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Detailed Explanation (English)</label>
                  <textarea
                    rows={3}
                    value={detailedEn}
                    onChange={(e) => setDetailedEn(e.target.value)}
                    onBlur={async () => {
                      if (detailedEn.trim() && !detailedHi.trim()) {
                        const tr = await translateEnglishToHindi(detailedEn);
                        if (tr) setDetailedHi(tr);
                      }
                    }}
                    placeholder="Historical facts, Constituent Assembly references, coalition governance..."
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">विस्तृत ऐतिहासिक संदर्भ (हिंदी)</label>
                    <TranslateButton
                      englishText={detailedEn}
                      onTranslated={(hi) => setDetailedHi(hi)}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={detailedHi}
                    onChange={(e) => setDetailedHi(e.target.value)}
                    placeholder="ऐतिहासिक साक्ष्य, संविधान सभा संदर्भ, संसदीय रिकॉर्ड..."
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Talking Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Cadre Talking Points (English, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={pointsEnText}
                    onChange={(e) => setPointsEnText(e.target.value)}
                    placeholder="Point 1&#10;Point 2&#10;Point 3"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">कार्यकर्ताओं के लिए तर्क (हिंदी)</label>
                    <TranslateButton
                      englishText={pointsEnText}
                      onTranslated={(hi) => setPointsHiText(hi)}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={pointsHiText}
                    onChange={(e) => setPointsHiText(e.target.value)}
                    placeholder="तर्क बिंदु 1&#10;तर्क बिंदु 2&#10;तर्क बिंदु 3"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
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
                  {editingFaq ? (lang === 'hi' ? 'अपडेट सहेजें' : 'Save Updates') : (lang === 'hi' ? 'FAQ जोड़ें' : 'Publish FAQ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
