import React, { useState, useEffect, useMemo } from 'react';
import { 
  Send, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  MessageSquare, 
  Twitter, 
  Facebook, 
  Instagram, 
  ExternalLink,
  Layers,
  Calendar,
  Newspaper,
  CheckCircle2
} from 'lucide-react';
import { Language, NewsItem, PartyEvent, SocialPlatform, SocialBroadcastItem } from '../types';
import { 
  ShareContent, 
  createShareContentFromNews, 
  createShareContentFromEvent, 
  formatWhatsAppMessage, 
  formatTelegramMessage, 
  formatTwitterText, 
  getShareUrl, 
  generateInstagramBanner 
} from '../utils/socialShare';
import { storageService } from '../services/storageService';

interface Props {
  lang: Language;
  preselectedNews?: NewsItem | null;
  preselectedEvent?: PartyEvent | null;
}

export const SocialBroadcastStudio: React.FC<Props> = ({ 
  lang, 
  preselectedNews, 
  preselectedEvent 
}) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [eventsList, setEventsList] = useState<PartyEvent[]>([]);
  const [broadcastHistory, setBroadcastHistory] = useState<SocialBroadcastItem[]>([]);

  // Source selection
  const [sourceType, setSourceType] = useState<'news' | 'event' | 'custom'>('news');
  const [selectedNewsId, setSelectedNewsId] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Custom text fields
  const [customTitleEn, setCustomTitleEn] = useState('Youth Wing Launches Nationwide Environmental Action Week');
  const [customTitleHi, setCustomTitleHi] = useState('युवा मोर्चा द्वारा देशव्यापी पर्यावरण संरक्षण सप्ताह का शुभारंभ');
  const [customBodyEn, setCustomBodyEn] = useState('Mobilizing 10,000+ volunteers across 40 districts for clean river drives and tree plantation!');
  const [customBodyHi, setCustomBodyHi] = useState('40 ज़िलों के 10,000+ कार्यकर्ताओं द्वारा नदी स्वच्छता व व्यापक वृक्षारोपण महाभियान!');
  const [customHashtags, setCustomHashtags] = useState('#YouthPower #YuvaShakti #IMYouth2026');

  // Preview & Broadcast Settings
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('whatsapp');
  const [broadcastLanguage, setBroadcastLanguage] = useState<'dual' | 'hi' | 'en'>('dual');
  const [copiedText, setCopiedText] = useState(false);
  const [broadcastAllSuccess, setBroadcastAllSuccess] = useState(false);
  const [generatedBannerUrl, setGeneratedBannerUrl] = useState<string>('');

  useEffect(() => {
    const news = storageService.getNews();
    const events = storageService.getEvents();
    const broadcasts = storageService.getBroadcasts();

    setNewsList(news);
    setEventsList(events);
    setBroadcastHistory(broadcasts);

    if (preselectedNews) {
      setSourceType('news');
      setSelectedNewsId(preselectedNews.id);
    } else if (preselectedEvent) {
      setSourceType('event');
      setSelectedEventId(preselectedEvent.id);
    } else if (news.length > 0) {
      setSelectedNewsId(news[0].id);
    }
  }, [preselectedNews, preselectedEvent]);

  // Derived current share content
  const currentShareContent: ShareContent = useMemo(() => {
    if (sourceType === 'news') {
      const found = newsList.find((n) => n.id === selectedNewsId) || newsList[0];
      if (found) return createShareContentFromNews(found);
    } else if (sourceType === 'event') {
      const found = eventsList.find((e) => e.id === selectedEventId) || eventsList[0];
      if (found) return createShareContentFromEvent(found);
    }

    return {
      titleEn: customTitleEn,
      titleHi: customTitleHi,
      textEn: customBodyEn,
      textHi: customBodyHi,
      url: window.location.origin,
      hashtags: customHashtags.split(' ').filter(Boolean),
      category: 'YOUTH ACTION',
    };
  }, [sourceType, selectedNewsId, selectedEventId, customTitleEn, customTitleHi, customBodyEn, customBodyHi, customHashtags, newsList, eventsList]);

  // Generate Instagram Banner whenever currentShareContent changes
  useEffect(() => {
    try {
      const banner = generateInstagramBanner(currentShareContent);
      setGeneratedBannerUrl(banner);
    } catch {
      // fallback
    }
  }, [currentShareContent]);

  // Handle Copy Formatted text
  const handleCopyCurrent = () => {
    let textToCopy = '';
    if (previewPlatform === 'whatsapp') {
      textToCopy = formatWhatsAppMessage(currentShareContent, broadcastLanguage);
    } else if (previewPlatform === 'telegram') {
      textToCopy = formatTelegramMessage(currentShareContent, broadcastLanguage);
    } else if (previewPlatform === 'twitter') {
      textToCopy = formatTwitterText(currentShareContent, broadcastLanguage === 'dual' ? 'hi' : broadcastLanguage);
    } else {
      textToCopy = `${currentShareContent.titleHi}\n${currentShareContent.titleEn}\n\n${currentShareContent.textHi}\n\n${currentShareContent.url}\n${currentShareContent.hashtags.join(' ')}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Launch Single Platform
  const handleLaunchPlatform = (platform: SocialPlatform) => {
    if (platform === 'instagram') {
      // Trigger banner download + copy caption
      handleDownloadBanner();
      handleCopyCurrent();
      window.open('https://www.instagram.com/', '_blank');
      return;
    }

    const shareUrl = getShareUrl(platform, currentShareContent, broadcastLanguage);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');

    // Update broadcast stats
    storageService.incrementNewsShare(selectedNewsId);
  };

  // Download Instagram Banner
  const handleDownloadBanner = () => {
    if (!generatedBannerUrl) return;
    const a = document.createElement('a');
    a.href = generatedBannerUrl;
    a.download = `IM_Youth_${Date.now()}_instagram.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // SINGLE ACTION: BROADCAST TO ALL 5 PLATFORMS
  const handleBroadcastAll = () => {
    // 1. Copy comprehensive message to clipboard
    const universalPayload = `🇮🇳 ${currentShareContent.titleHi}\n📢 ${currentShareContent.titleEn}\n\n${currentShareContent.textHi}\n\n${currentShareContent.textEn}\n\n📍 ${currentShareContent.url}\n${currentShareContent.hashtags.join(' ')}`;
    navigator.clipboard.writeText(universalPayload);

    // 2. Open WhatsApp, Telegram, X in tabs
    const platformsToOpen: SocialPlatform[] = ['whatsapp', 'telegram', 'twitter', 'facebook'];
    platformsToOpen.forEach((p, idx) => {
      const url = getShareUrl(p, currentShareContent, broadcastLanguage);
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }, idx * 250);
    });

    // 3. Automatically trigger Instagram graphic banner download
    if (generatedBannerUrl) {
      setTimeout(() => {
        handleDownloadBanner();
      }, 1000);
    }

    // 4. Save to broadcast history
    const newBroadcast: SocialBroadcastItem = {
      id: `bcast-${Date.now()}`,
      titleEn: currentShareContent.titleEn,
      titleHi: currentShareContent.titleHi,
      contentEn: currentShareContent.textEn,
      contentHi: currentShareContent.textHi,
      hashtags: currentShareContent.hashtags,
      url: currentShareContent.url,
      targetPlatforms: ['whatsapp', 'telegram', 'twitter', 'facebook', 'instagram'],
      createdAt: new Date().toISOString(),
      metrics: {
        shares: 1,
        clicks: 0,
      },
    };
    const updated = storageService.saveBroadcast(newBroadcast);
    setBroadcastHistory(updated);

    setBroadcastAllSuccess(true);
    setTimeout(() => setBroadcastAllSuccess(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
          <span>{lang === 'hi' ? 'सोशल मीडिया एकीकरण' : 'Social Media Integration'}</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'hi' ? 'एक-क्लिक संपूर्ण प्रसारण' : 'One-Shot Multi-Platform Engine'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
          {lang === 'hi' 
            ? 'सोशल मीडिया ब्रॉडकास्ट स्टूडियो (द्वैभाषिक हिंदी + अंग्रेज़ी)' 
            : 'Social Media Broadcast Studio (Bilingual Hindi + English)'}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">
          {lang === 'hi'
            ? 'मुस्लिम यूथ लीग (MYL) व MSF की गतिविधियों, बयानों और सम्मेलनों को एक साथ व्हाट्सएप, टेलीग्राम, एक्स (ट्विटर), फेसबुक और इंस्टाग्राम पर एक ही क्लिक में प्रसारित करें।'
            : 'Publish political press releases, rally schedules, and party declarations to WhatsApp, Telegram, X, Facebook, and Instagram simultaneously with a single action.'}
        </p>
      </div>

      {/* Primary 1-Shot Broadcast Callout Banner (IUML Green + Deep Blue) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white p-6 rounded-xl mb-8 border border-emerald-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'hi' ? 'एक-क्लिक सभी चैनलों पर साझा करें' : 'One-Action Universal Broadcast'}</span>
          </div>
          <h2 className="text-xl font-bold">
            {lang === 'hi' 
              ? 'सभी 5 सोशल मीडिया प्लेटफॉर्म पर एक साथ भेजें' 
              : 'Broadcast to WhatsApp, Telegram, X, Facebook & Instagram'}
          </h2>
          <p className="text-emerald-100 text-xs max-w-xl">
            {lang === 'hi'
              ? 'व्हाट्सएप ग्रुप, टेलीग्राम चैनल और ट्विटर पर साझा करने के साथ-साथ इंस्टाग्राम के लिए हरा व नीला ब्रांडेड पोस्टर स्वतः डाउनलोड होगा।'
              : 'Simultaneously opens native sharing dialogs, copies the dual-language payload, and auto-downloads the branded Instagram visual asset.'}
          </p>
        </div>

        <button
          onClick={handleBroadcastAll}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-lg shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{lang === 'hi' ? 'अभी सभी 5 प्लेटफॉर्म पर भेजें' : 'Broadcast to All Platforms Now'}</span>
        </button>
      </div>

      {broadcastAllSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg mb-6 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>{lang === 'hi' ? 'सफल प्रसारण!' : 'Universal Broadcast Initiated!'}</strong>
            <span className="block text-xs text-emerald-700 mt-0.5">
              {lang === 'hi'
                ? 'व्हाट्सएप, टेलीग्राम, एक्स, और फेसबुक के शेयरिंग टैब खोल दिए गए हैं और इंस्टाग्राम पोस्टर डाउनलोड हो गया है।'
                : 'Native share windows opened for WhatsApp, Telegram, X, and Facebook. Instagram card downloaded to your device.'}
            </span>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Content Source Selector & Language Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-white border border-stone-200 rounded-lg space-y-5">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
              {lang === 'hi' ? '1. सामग्री का चयन करें' : '1. Select Broadcast Content'}
            </h3>

            {/* Source Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSourceType('news')}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors flex items-center justify-center gap-1.5 ${
                  sourceType === 'news'
                    ? 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'समाचार' : 'Press News'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('event')}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors flex items-center justify-center gap-1.5 ${
                  sourceType === 'event'
                    ? 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'कार्यक्रम' : 'Event / Rally'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('custom')}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors flex items-center justify-center gap-1.5 ${
                  sourceType === 'custom'
                    ? 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'कस्टम संदेश' : 'Custom'}</span>
              </button>
            </div>

            {/* If News Selected */}
            {sourceType === 'news' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  {lang === 'hi' ? 'प्रेस विज्ञप्ति चुनें' : 'Choose Press Statement'}
                </label>
                <select
                  value={selectedNewsId}
                  onChange={(e) => setSelectedNewsId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:border-amber-600"
                >
                  {newsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {lang === 'hi' ? item.title.hi : item.title.en}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* If Event Selected */}
            {sourceType === 'event' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  {lang === 'hi' ? 'कार्यक्रम / रैली चुनें' : 'Choose Event / Rally'}
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:border-amber-600"
                >
                  {eventsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.date} — {lang === 'hi' ? item.title.hi : item.title.en} ({item.district})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* If Custom Selected */}
            {sourceType === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    शीर्षक (हिंदी) / Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={customTitleHi}
                    onChange={(e) => setCustomTitleHi(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={customTitleEn}
                    onChange={(e) => setCustomTitleEn(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    विवरण (हिंदी) / Body (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={customBodyHi}
                    onChange={(e) => setCustomBodyHi(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Body (English)
                  </label>
                  <textarea
                    rows={2}
                    value={customBodyEn}
                    onChange={(e) => setCustomBodyEn(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={customHashtags}
                    onChange={(e) => setCustomHashtags(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            )}

            {/* Language Output Mode */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                {lang === 'hi' ? 'प्रसारण भाषा मोड' : 'Broadcast Language Format'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastLanguage('dual')}
                  className={`py-1.5 px-2 text-xs font-medium rounded border ${
                    broadcastLanguage === 'dual'
                      ? 'bg-stone-900 text-white border-stone-900 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  {lang === 'hi' ? 'द्वैभाषिक (हिंदी+EN)' : 'Dual (Hindi+EN)'}
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastLanguage('hi')}
                  className={`py-1.5 px-2 text-xs font-medium rounded border ${
                    broadcastLanguage === 'hi'
                      ? 'bg-stone-900 text-white border-stone-900 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  हिंदी केवल
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastLanguage('en')}
                  className={`py-1.5 px-2 text-xs font-medium rounded border ${
                    broadcastLanguage === 'en'
                      ? 'bg-stone-900 text-white border-stone-900 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  English Only
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats & Reach indicator */}
          <div className="p-4 bg-stone-100 rounded-lg text-xs space-y-1.5 text-stone-600">
            <div className="flex justify-between">
              <span>{lang === 'hi' ? 'अनुमानित कैडर पहुंच:' : 'Estimated Cadre Reach:'}</span>
              <strong className="text-stone-900">45,000+ Volunteers</strong>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'hi' ? 'सक्रिय ज़िला व्हाट्सएप ग्रुप्स:' : 'Active District Groups:'}</span>
              <strong className="text-stone-900">128 WhatsApp / Telegram channels</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Platform-Specific Preview & Individual Sharing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-white border border-stone-200 rounded-lg space-y-4">
            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto">
              <button
                onClick={() => setPreviewPlatform('whatsapp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  previewPlatform === 'whatsapp'
                    ? 'bg-white text-emerald-800 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setPreviewPlatform('telegram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  previewPlatform === 'telegram'
                    ? 'bg-white text-sky-800 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Telegram</span>
              </button>

              <button
                onClick={() => setPreviewPlatform('twitter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  previewPlatform === 'twitter'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Twitter className="w-3.5 h-3.5 text-stone-800" />
                <span>X (Twitter)</span>
              </button>

              <button
                onClick={() => setPreviewPlatform('facebook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  previewPlatform === 'facebook'
                    ? 'bg-white text-blue-800 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => setPreviewPlatform('instagram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  previewPlatform === 'instagram'
                    ? 'bg-white text-rose-800 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-rose-600" />
                <span>Instagram Card</span>
              </button>
            </div>

            {/* Platform Preview Box */}
            {previewPlatform !== 'instagram' ? (
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                {previewPlatform === 'whatsapp' && formatWhatsAppMessage(currentShareContent, broadcastLanguage)}
                {previewPlatform === 'telegram' && formatTelegramMessage(currentShareContent, broadcastLanguage)}
                {previewPlatform === 'twitter' && formatTwitterText(currentShareContent, broadcastLanguage === 'dual' ? 'hi' : broadcastLanguage)}
                {previewPlatform === 'facebook' && (
                  <div>
                    <div className="font-sans font-bold text-sm mb-2">{currentShareContent.titleHi}</div>
                    <div className="font-sans text-stone-600 mb-3">{currentShareContent.textHi}</div>
                    <div className="p-3 bg-white border border-stone-200 rounded text-stone-500 text-[11px] font-sans">
                      <div className="font-bold text-stone-800">{currentShareContent.titleEn}</div>
                      <div>{currentShareContent.textEn}</div>
                      <div className="text-amber-700 mt-1">{currentShareContent.url}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Instagram Banner Preview */
              <div className="space-y-3">
                <div className="relative aspect-square max-w-[340px] mx-auto rounded-lg overflow-hidden border border-stone-300 shadow-md">
                  {generatedBannerUrl && (
                    <img 
                      src={generatedBannerUrl} 
                      alt="Instagram Graphic Banner" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <p className="text-center text-[11px] text-stone-500">
                  {lang === 'hi' 
                    ? '1080x1080 पिक्सल हाई-रिज़ॉल्यूशन पोस्टर तैयार है। इसे सीधे इंस्टाग्राम फीड या स्टोरी पर पोस्ट करें।' 
                    : 'Ready-to-post 1080x1080 px graphic banner with official party branding and bilingual quotes.'}
                </p>
              </div>
            )}

            {/* Actions for current platform */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleCopyCurrent}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors inline-flex items-center gap-1.5"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy Formatted Text'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {previewPlatform === 'instagram' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDownloadBanner}
                      className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'पोस्टर डाउनलोड करें' : 'Download Graphic PNG'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open('https://www.instagram.com', '_blank')}
                      className="px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 inline-flex items-center gap-1"
                    >
                      <span>Open Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLaunchPlatform(previewPlatform)}
                    className="px-4 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'hi' 
                        ? `${previewPlatform.toUpperCase()} पर साझा करें` 
                        : `Share on ${previewPlatform.toUpperCase()}`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Broadcast History Strip */}
          <div className="p-4 bg-white border border-stone-200 rounded-lg">
            <h4 className="text-xs font-bold text-stone-900 mb-2">
              {lang === 'hi' ? 'हालिया प्रसारण इतिहास (Broadcast History)' : 'Recent Broadcast History'}
            </h4>
            <div className="space-y-2">
              {broadcastHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="text-xs p-2.5 bg-stone-50 rounded flex items-center justify-between">
                  <div className="truncate max-w-[340px]">
                    <span className="font-semibold text-stone-800 block truncate">
                      {lang === 'hi' ? item.titleHi : item.titleEn}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {item.createdAt.slice(0, 10)} · 5 channels dispatched
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                    {item.metrics?.shares || 1} shares
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
