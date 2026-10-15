import React, { useState, useEffect } from 'react';
import { Newspaper, Share2, PlusCircle, Clock, Tag, ExternalLink, MessageSquare } from 'lucide-react';
import { NewsItem, Language, NewsCategory } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  lang: Language;
  onOpenSocialBroadcast: (news: NewsItem) => void;
}

export const LiveNewsFeed: React.FC<Props> = ({ lang, onOpenSocialBroadcast }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptHi, setExcerptHi] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentHi, setContentHi] = useState('');
  const [category, setCategory] = useState<NewsCategory>('press_release');
  const [tagsInput, setTagsInput] = useState('YouthWing, GroundAction, Rozgar');

  useEffect(() => {
    const list = storageService.getNews();
    setNews(list);
  }, []);

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleHi) return;

    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: { en: titleEn, hi: titleHi },
      excerpt: { en: excerptEn || titleEn, hi: excerptHi || titleHi },
      fullContent: { en: contentEn || excerptEn || titleEn, hi: contentHi || excerptHi || titleHi },
      category,
      publishedAt: new Date().toISOString().slice(0, 10),
      readTime: '3 min',
      author: {
        name: { en: 'Central Youth Media Desk', hi: 'केंद्रीय युवा मीडिया डेस्क' },
        role: { en: 'Official Spokesperson', hi: 'आधिकारिक प्रवक्ता' },
      },
      shareCount: 1,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    const updated = storageService.saveNews(newItem);
    setNews(updated);
    setShowPublishModal(false);

    // reset
    setTitleEn('');
    setTitleHi('');
    setExcerptEn('');
    setExcerptHi('');
    setContentEn('');
    setContentHi('');
  };

  const filteredNews = news.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <span>{lang === 'hi' ? 'प्रेस एवं मीडिया बुलेटिन' : 'Press & Action Bulletin'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'आधिकारिक समाचार व बयान' : 'Live Grassroots Dispatches'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'लाइव समाचार एवं प्रेस विज्ञप्तियां' : 'Live Party News & Youth Action Dispatches'}
          </h1>
          <p className="text-stone-600 text-xs max-w-2xl mt-1">
            {lang === 'hi'
              ? 'युवा मोर्चा के आधिकारिक नीतिगत बयान, ज़मीनी जनसंपर्क की ताजा खबरें और छात्र आंदोलन की रिपोर्ट।'
              : 'Verified statements, resolutions on employment and education, and district action reports published in real-time.'}
          </p>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'नई प्रेस विज्ञप्ति जारी करें' : 'Publish Press Release'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { key: 'all', label: { en: 'All Updates', hi: 'सभी समाचार' } },
          { key: 'press_release', label: { en: 'Press Releases', hi: 'प्रेस विज्ञप्ति' } },
          { key: 'ground_action', label: { en: 'Ground Actions', hi: 'ज़मीनी आंदोलन' } },
          { key: 'statement', label: { en: 'Statements', hi: 'आधिकारिक बयान' } },
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

      {/* News List */}
      <div className="space-y-5">
        {filteredNews.map((item) => {
          const isExpanded = expandedNewsId === item.id;
          return (
            <article
              key={item.id}
              className="p-6 bg-white border border-stone-200 rounded-xl space-y-4 hover:border-emerald-600/40 transition-colors shadow-xs"
            >
              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
                    ★ {item.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.readTime}</span>
                </div>
                <div className="text-[11px] font-mono text-stone-500">
                  {item.shareCount.toLocaleString()} {lang === 'hi' ? 'शेयर' : 'shares'}
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-lg md:text-xl font-extrabold text-stone-900 leading-snug">
                  {lang === 'hi' ? item.title.hi : item.title.en}
                </h2>
                {lang === 'hi' && (
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    {item.title.en}
                  </p>
                )}
              </div>

              {/* Excerpt / Full Content */}
              <div className="text-stone-700 text-xs leading-relaxed space-y-2">
                <p>{lang === 'hi' ? item.excerpt.hi : item.excerpt.en}</p>
                {isExpanded && (
                  <div className="p-4 bg-stone-50 rounded-lg border-l-2 border-amber-600 space-y-2 text-stone-800 animate-fade-in mt-3">
                    <p className="whitespace-pre-line leading-relaxed">
                      {lang === 'hi' ? item.fullContent.hi : item.fullContent.en}
                    </p>
                    <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                      <strong>Author: </strong>
                      {lang === 'hi' ? item.author.name.hi : item.author.name.en} (
                      {lang === 'hi' ? item.author.role.hi : item.author.role.en})
                    </div>
                  </div>
                )}
              </div>

              {/* Tags & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[11px] text-stone-500 hover:text-stone-800">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedNewsId(isExpanded ? null : item.id)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    {isExpanded ? (lang === 'hi' ? 'संक्षिप्त करें' : 'Show Less') : (lang === 'hi' ? 'पूरा पढ़ें' : 'Read Full')}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSocialBroadcast(item)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'सोशल मीडिया पर भेजें' : 'Broadcast Release'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Publish Press Release Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              {lang === 'hi' ? 'नवीन प्रेस विज्ञप्ति / बुलेटिन जारी करें' : 'Publish Official Press Release'}
            </h3>

            <form onSubmit={handlePublishSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Headline (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youth Wing Submits 10-Point Education Charter..."
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  शीर्षक (हिंदी) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. युवा मोर्चा ने शिक्षा सुधार हेतु 10-सूत्रीय मांग पत्र सौंपा..."
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className="w-full p-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="press_release">Press Release (प्रेस विज्ञप्ति)</option>
                    <option value="ground_action">Ground Action (ज़मीनी आंदोलन)</option>
                    <option value="statement">Official Statement (बयान)</option>
                    <option value="campaign">Youth Campaign (अभियान)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Summary (English)</label>
                <textarea
                  rows={2}
                  placeholder="Short excerpt for social media preview..."
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">सारांश (हिंदी)</label>
                <textarea
                  rows={2}
                  placeholder="सोशल मीडिया पूर्वावलोकन हेतु संक्षिप्त विवरण..."
                  value={excerptHi}
                  onChange={(e) => setExcerptHi(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Statement / Text (English)</label>
                <textarea
                  rows={3}
                  placeholder="Full official release content..."
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded"
                >
                  Publish & Syndicate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
