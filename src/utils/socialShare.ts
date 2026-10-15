import { PartyEvent, NewsItem, SocialPlatform } from '../types';

export interface ShareContent {
  titleEn: string;
  titleHi: string;
  textEn: string;
  textHi: string;
  url: string;
  hashtags: string[];
  category?: string;
  dateOrVenue?: string;
}

export function formatWhatsAppMessage(content: ShareContent, lang: 'dual' | 'hi' | 'en' = 'dual'): string {
  const parts: string[] = [];

  if (lang === 'dual' || lang === 'hi') {
    parts.push(`🇮🇳 *${content.titleHi}*`);
    if (content.textHi) parts.push(content.textHi);
  }

  if (lang === 'dual') {
    parts.push(`---------------------------`);
  }

  if (lang === 'dual' || lang === 'en') {
    parts.push(`📢 *${content.titleEn}*`);
    if (content.textEn) parts.push(content.textEn);
  }

  if (content.dateOrVenue) {
    parts.push(`📍 *विवरण / Details:* ${content.dateOrVenue}`);
  }

  parts.push(`\n🔗 *अधिक जानकारी व जुड़ें:* ${content.url}`);
  parts.push(`\n${content.hashtags.join(' ')}`);

  return parts.join('\n');
}

export function formatTelegramMessage(content: ShareContent, lang: 'dual' | 'hi' | 'en' = 'dual'): string {
  const parts: string[] = [];

  if (lang === 'dual' || lang === 'hi') {
    parts.push(`⚡️ *${content.titleHi}*`);
    if (content.textHi) parts.push(content.textHi);
  }

  if (lang === 'dual') {
    parts.push(`\n--- English ---`);
  }

  if (lang === 'dual' || lang === 'en') {
    parts.push(`*${content.titleEn}*`);
    if (content.textEn) parts.push(content.textEn);
  }

  if (content.dateOrVenue) {
    parts.push(`\n📅 ${content.dateOrVenue}`);
  }

  parts.push(`\n🌐 Portal: ${content.url}`);
  parts.push(`${content.hashtags.join(' ')}`);

  return parts.join('\n');
}

export function formatTwitterText(content: ShareContent, lang: 'dual' | 'hi' | 'en' = 'hi'): string {
  // Twitter has strict 280 char limit; optimize text
  let baseText = '';
  if (lang === 'hi') {
    baseText = `🇮🇳 ${content.titleHi}\n\n${content.textHi.slice(0, 110)}...`;
  } else if (lang === 'en') {
    baseText = `📢 ${content.titleEn}\n\n${content.textEn.slice(0, 110)}...`;
  } else {
    baseText = `🇮🇳 ${content.titleHi.slice(0, 80)}\n${content.titleEn.slice(0, 60)}...`;
  }

  const tags = content.hashtags.slice(0, 3).join(' ');
  return `${baseText}\n\n${tags}`;
}

export function getShareUrl(platform: SocialPlatform, content: ShareContent, lang: 'dual' | 'hi' | 'en' = 'dual'): string {
  const encodedUrl = encodeURIComponent(content.url);

  switch (platform) {
    case 'whatsapp': {
      const msg = encodeURIComponent(formatWhatsAppMessage(content, lang));
      return `https://api.whatsapp.com/send?text=${msg}`;
    }
    case 'telegram': {
      const msg = encodeURIComponent(formatTelegramMessage(content, lang));
      return `https://t.me/share/url?url=${encodedUrl}&text=${msg}`;
    }
    case 'twitter': {
      const text = encodeURIComponent(formatTwitterText(content, lang === 'dual' ? 'hi' : lang));
      const tags = content.hashtags.map((t) => t.replace('#', '')).slice(0, 3).join(',');
      return `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}&hashtags=${encodeURIComponent(tags)}`;
    }
    case 'facebook': {
      const quote = encodeURIComponent(`${content.titleHi} | ${content.titleEn}`);
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${quote}`;
    }
    case 'instagram':
      // Return web profile or instructions link
      return `https://www.instagram.com/`;
    default:
      return content.url;
  }
}

export function createShareContentFromNews(news: NewsItem): ShareContent {
  return {
    titleEn: news.title.en,
    titleHi: news.title.hi,
    textEn: news.excerpt.en,
    textHi: news.excerpt.hi,
    url: window.location.origin + `?tab=news&id=${news.id}`,
    hashtags: news.tags.map((t) => `#${t}`),
    category: news.category,
  };
}

export function createShareContentFromEvent(event: PartyEvent): ShareContent {
  return {
    titleEn: event.title.en,
    titleHi: event.title.hi,
    textEn: event.description.en,
    textHi: event.description.hi,
    url: window.location.origin + `?tab=events&id=${event.id}`,
    hashtags: ['#IMYouth', '#YouthRally', '#YuvaShakti', '#NationalYouthWing'],
    category: event.category,
    dateOrVenue: `${event.date} (${event.time}) @ ${event.location.hi} / ${event.location.en}`,
  };
}

/**
 * Generates a high-resolution graphical banner (1080x1080) for Instagram Feed / Story
 * Stylized with IUML Emerald Green (#047857), Deep Royal Blue (#1e3a8a), and Crisp White
 * Returns data URL (png)
 */
export function generateInstagramBanner(content: ShareContent): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Deep Royal Blue to Midnight Blue gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  bgGradient.addColorStop(0, '#0f172a'); // Midnight
  bgGradient.addColorStop(0.5, '#1e3a8a'); // Royal Blue
  bgGradient.addColorStop(1, '#064e3b'); // Deep IUML Emerald
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1080, 1080);

  // Top Accent Strip: Pure IUML Emerald Green + White
  ctx.fillStyle = '#047857'; // IUML Green
  ctx.fillRect(0, 0, 1080, 24);
  ctx.fillStyle = '#ffffff'; // White
  ctx.fillRect(0, 24, 1080, 8);
  ctx.fillStyle = '#1d4ed8'; // Blue
  ctx.fillRect(0, 32, 1080, 8);

  // Subtle decorative geometric glow
  ctx.beginPath();
  ctx.arc(920, 160, 240, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(4, 120, 87, 0.15)';
  ctx.fill();

  // Top Header: Organization Branding
  ctx.fillStyle = '#34d399'; // Bright Mint Emerald
  ctx.font = 'bold 34px system-ui, sans-serif';
  ctx.fillText('MUSLIM YOUTH LEAGUE (MYL) · उत्तर प्रदेश', 80, 115);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 24px system-ui, sans-serif';
  ctx.fillText('INDIAN UNION MUSLIM LEAGUE · MSF CADRE BULLETIN', 80, 155);

  // Thin separator rule
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 185);
  ctx.lineTo(1000, 185);
  ctx.stroke();

  // Category / Kicker Badge background (Emerald Green)
  ctx.fillStyle = '#047857';
  ctx.fillRect(80, 225, 340, 52);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px system-ui, sans-serif';
  const categoryLabel = content.category?.toUpperCase() || 'OFFICIAL PRESS RELEASE';
  ctx.fillText(`★ ${categoryLabel}`, 105, 260);

  // Main Hindi Headline (Bold White)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px system-ui, "Noto Sans Devanagari", sans-serif';
  wrapText(ctx, content.titleHi, 80, 355, 920, 68);

  // English Sub-headline (Bright Cyan / Light Blue)
  ctx.fillStyle = '#93c5fd';
  ctx.font = '600 34px system-ui, sans-serif';
  wrapText(ctx, content.titleEn, 80, 565, 920, 48);

  // Date / Venue or Excerpt Box (Clean White / Semi-translucent Glass)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(80, 720, 920, 170);
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 720, 920, 170);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = '400 26px system-ui, sans-serif';
  const excerpt = content.dateOrVenue || content.textEn || content.textHi;
  wrapText(ctx, excerpt, 110, 770, 860, 38);

  // Bottom Footer Strip
  ctx.fillStyle = '#047857';
  ctx.fillRect(80, 940, 920, 6);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 24px system-ui, sans-serif';
  ctx.fillText('हक़, इंसाफ़, तालीम और भाईचारा | @MYLUttarPradesh', 80, 985);

  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('imyouth.vercel.app', 770, 985);

  return canvas.toDataURL('image/png');
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      if (currentY > y + lineHeight * 4) {
        // limit lines
        ctx.fillText(line + '...', x, currentY);
        return;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
