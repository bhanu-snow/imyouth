import { Language } from '../types';

export const translations = {
  // Brand & Nav
  appName: {
    en: 'IM Youth',
    hi: 'आईएम युवा मोर्चा',
  },
  tagline: {
    en: 'Youth Power, Nation Building',
    hi: 'युवा शक्ति, राष्ट्र निर्माण',
  },
  nav: {
    home: { en: 'Home', hi: 'मुख्य पृष्ठ' },
    about: { en: 'Our Mission', hi: 'हमारा उद्देश्य' },
    membership: { en: 'Join & ID Card', hi: 'सदस्यता एवं पहचान पत्र' },
    events: { en: 'Events & Rallies', hi: 'कार्यक्रम व सभाएं' },
    news: { en: 'Press Bulletin', hi: 'समाचार व प्रेस नोट' },
    districts: { en: 'District Leadership', hi: 'ज़िला व तहसील संगठन' },
    broadcast: { en: 'Social Studio', hi: 'सोशल मीडिया स्टूडियो' },
    techStack: { en: 'Tech & DB Guide', hi: 'डेटाबेस व तकनीकी गाइड' },
  },
  hero: {
    kicker: {
      en: 'Official Youth Wing Portal',
      hi: 'आधिकारिक युवा मोर्चा पोर्टल',
    },
    titlePrimary: {
      en: 'Empowering India’s Youth to Lead the Nation',
      hi: 'भारत के युवाओं को राष्ट्र नेतृत्व के लिए सशक्त बनाना',
    },
    subtitle: {
      en: 'Connecting visionary young leaders, grassroots volunteers, and student cadres across every district, tehsil, and ward. Real-time updates, digital membership, and unified social media broadcast.',
      hi: 'हर ज़िले, तहसील और वार्ड के ऊर्जावान युवा नेताओं, ज़मीनी कार्यकर्ताओं और छात्र शक्ति का एकजुट मंच। रीयल-टाइम अपडेट, डिजिटल पहचान पत्र और एक-क्लिक सोशल मीडिया प्रसारण।',
    },
    ctaJoin: {
      en: 'Register & Get Digital ID Card',
      hi: 'सदस्य बनें और डिजिटल आईडी पाएं',
    },
    ctaBroadcast: {
      en: 'Open Social Media Studio',
      hi: 'सोशल मीडिया स्टूडियो खोलें',
    },
    statsCadres: { en: 'Verified Youth Cadres', hi: 'सत्यापित युवा कार्यकर्ता' },
    statsDistricts: { en: 'Districts Active', hi: 'सक्रिय ज़िला इकाइयाँ' },
    statsEvents: { en: 'Ground Actions Held', hi: 'आयोजित ज़मीनी कार्यक्रम' },
    statsReach: { en: 'Social Media Reach', hi: 'सोशल मीडिया पहुंच' },
  },
  common: {
    viewAll: { en: 'View All', hi: 'सभी देखें' },
    submit: { en: 'Submit', hi: 'जमा करें' },
    save: { en: 'Save', hi: 'सुरक्षित करें' },
    cancel: { en: 'Cancel', hi: 'रद्द करें' },
    loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
    search: { en: 'Search...', hi: 'खोजें...' },
    share: { en: 'Share', hi: 'साझा करें' },
    download: { en: 'Download', hi: 'डाउनलोड करें' },
    print: { en: 'Print Card', hi: 'कार्ड प्रिंट करें' },
    rsvp: { en: 'RSVP Now', hi: 'भागीदारी दर्ज करें' },
    going: { en: 'Going', hi: 'मैं आ रहा हूँ' },
    maybe: { en: 'Maybe', hi: 'संभवतः' },
    attendees: { en: 'attending', hi: 'उपस्थित होंगे' },
    copied: { en: 'Copied to clipboard!', hi: 'क्लिपबोर्ड पर कॉपी हो गया!' },
    readMore: { en: 'Read Statement', hi: 'पूरा बयान पढ़ें' },
  },
  wings: {
    student: { en: 'Student Wing', hi: 'छात्र मोर्चा' },
    it_cell: { en: 'IT & Digital Media Cell', hi: 'आईटी व डिजिटल मीडिया प्रकोष्ठ' },
    social_action: { en: 'Community Action & Seva', hi: 'सेवा एवं सामाजिक कार्य' },
    sports_cultural: { en: 'Sports & Cultural Wing', hi: 'खेल व सांस्कृतिक प्रकोष्ठ' },
    legal_rti: { en: 'Legal Aid & RTI Cell', hi: 'विधिक सहायता व आरटीआई' },
    general: { en: 'General Cadre', hi: 'सामान्य कार्यकर्ता' },
  },
};

export function t(keyPath: string, lang: Language): string {
  const parts = keyPath.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return keyPath;
    }
  }
  if (current && typeof current === 'object' && lang in current) {
    return current[lang];
  }
  return keyPath;
}
