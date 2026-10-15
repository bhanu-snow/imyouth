import React, { useState } from 'react';
import { HelpCircle, Search, Share2, CheckCircle2, AlertTriangle, BookOpen, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { MYTHS_AND_FAQS } from '../data/mythsFaqData';

interface Props {
  lang: Language;
}

export const FaqMythBuster: React.FC<Props> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(MYTHS_AND_FAQS[0].id);

  const filteredFaqs = MYTHS_AND_FAQS.filter((faq) => {
    const matchesSearch = 
      faq.mythEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.mythHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.factEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.factHi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShareFact = (faq: typeof MYTHS_AND_FAQS[0]) => {
    const text = `📌 *तथ्य बनाम भ्रांति / Fact vs Propaganda*\n\n❌ *शंका:* ${faq.mythHi}\n\n✅ *ऐतिहासिक वास्तविकता:* ${faq.factHi}\n\n🇮🇳 *मुस्लिम यूथ लीग (MYL) उत्तर प्रदेश*\nअधिक जानकारी: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <span>{lang === 'hi' ? 'वैचारिक संसाधन व तथ्य' : 'Ideological Resource & Fact Check'}</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Myths vs Historical Reality'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {lang === 'hi'
            ? 'पार्टी से जुड़े भ्रम, मिथक और ऐतिहासिक तथ्य (FAQ)'
            : 'Clarifying Confusions: Myths vs Historical Reality (FAQ)'}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl mt-1 leading-relaxed">
          {lang === 'hi'
            ? 'इंडियन यूनियन मुस्लिम लीग (IUML) और मुस्लिम यूथ लीग (MYL) के गठन, संविधान के प्रति निष्ठा, और उत्तर प्रदेश में हमारी भूमिका से जुड़े सभी सवालों के प्रामाणिक दस्तावेजी उत्तर।'
            : 'Official documentation and factual clarity on IUML’s post-independence founding (10 March 1948 in Madras), Constituent Assembly legacy, secular democratic commitments, and the role of MYL and MSF in Uttar Pradesh.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'सवाल या विषय खोजें...' : 'Search myths or facts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className={`p-5 rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-500/10'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded inline-block">
                      {lang === 'hi' ? 'भ्रामक मिथक / Myth' : 'Common Myth'}
                    </span>
                    <h3 className="text-base font-bold text-stone-900">
                      {lang === 'hi' ? faq.mythHi : faq.mythEn}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 underline shrink-0 mt-1">
                    {isExpanded ? (lang === 'hi' ? 'संक्षिप्त करें' : 'Close') : (lang === 'hi' ? 'तथ्य देखें' : 'View Fact')}
                  </span>
                </div>

                {/* Quick 1-Line Fact summary */}
                <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs font-semibold text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{lang === 'hi' ? faq.factHi : faq.factEn}</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-stone-100 space-y-4 animate-fade-in text-xs">
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">
                      {lang === 'hi' ? 'ऐतिहासिक व कानूनी संदर्भ:' : 'Historical & Legal Context:'}
                    </h4>
                    <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                      {lang === 'hi' ? faq.detailedExplanationHi : faq.detailedExplanationEn}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-lg space-y-2">
                    <h4 className="font-bold text-stone-900">
                      {lang === 'hi' ? 'कार्यकर्ताओं के लिए मुख्य तर्क (Ground Talking Points):' : 'Key Talking Points for Cadres:'}
                    </h4>
                    <ul className="space-y-1.5 text-stone-700">
                      {(lang === 'hi' ? faq.cadreTalkingPointsHi : faq.cadreTalkingPointsEn).map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleShareFact(faq)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'व्हाट्सएप पर यह तथ्य साझा करें' : 'Share Fact to WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
