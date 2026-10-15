import { 
  Member, 
  PartyEvent, 
  NewsItem, 
  DistrictUnit, 
  SocialBroadcastItem, 
  AuthUser, 
  UserRole,
  PostDesignation,
  OrgWing,
  OrgDistrict,
  LeadershipTenure,
  MythFaqItem,
  ParliamentaryLeader
} from '../types';
import { MYTHS_AND_FAQS } from '../data/mythsFaqData';
import { PARLIAMENTARY_LEADERS } from '../data/parliamentaryHistoryData';

const STORAGE_KEYS = {
  MEMBERS: 'myl_up_members_v4',
  EVENTS: 'myl_up_events_v4',
  NEWS: 'myl_up_news_v4',
  DISTRICTS: 'myl_up_districts_v5',
  BROADCASTS: 'myl_up_broadcasts_v4',
  AUTH_USER: 'myl_up_auth_user_v7',
  ALL_USERS: 'myl_up_all_users_v7',
  POSTS: 'myl_up_posts_v1',
  WINGS: 'myl_up_wings_v1',
  ORG_DISTRICTS: 'myl_up_org_districts_v2',
  DISTRICT_LEADERSHIP: 'myl_up_dist_leadership_v2',
  FAQS: 'myl_up_faqs_v1',
  LEADERS: 'myl_up_leaders_v1',
};

export const PUBLIC_USER: AuthUser = {
  id: 'user-public-guest',
  name: 'Public Citizen',
  email: 'guest@mylup.org',
  phone: '',
  role: 'public',
  designation: 'Public Visitor',
  createdAt: '2026-10-15',
};

export const DEMO_USERS: AuthUser[] = []; // Demo credentials removed; use Supabase Auth.


const INITIAL_MEMBERS: Member[] = [
  {
    id: 'MYL-UP-2026-101',
    fullName: 'Mohd. Zeeshan Farooqui',
    fullNameHi: 'मोहम्मद ज़ीशान फ़ारूक़ी',
    phone: '+91 98370 12345',
    email: 'zeeshan.myl@up.org',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    state: 'Uttar Pradesh',
    district: 'Moradabad',
    subDistrict: 'Sambhal Road Unit',
    wing: 'myl_cadre',
    designation: 'District General Secretary (MYL)',
    designationHi: 'ज़िला महासचिव (मुस्लिम यूथ लीग)',
    joinedAt: '2024-02-10',
    verified: true,
    status: 'approved',
    communityBackground: 'Muslim Minority / Alpsankhyak Front',
    approvedBy: 'Adv. Sarfaraz Ahmed',
    approvedAt: '2024-02-12',
    bloodGroup: 'B+',
    education: 'LL.B, Moradabad Hindu College',
    bio: 'Advocating for educational scholarships and legal aid for underprivileged students across Western UP.',
  },
  {
    id: 'MYL-UP-2026-102',
    fullName: 'Shadab Ahmad Khan',
    fullNameHi: 'शादाब अहमद ख़ान',
    phone: '+91 94150 99887',
    email: 'shadab.msf@up.org',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    state: 'Uttar Pradesh',
    district: 'Aligarh',
    subDistrict: 'AMU Campus Unit',
    wing: 'msf',
    designation: 'State Vice President (MSF)',
    designationHi: 'प्रदेश उपाध्यक्ष (मुस्लिम स्टूडेंट्स फेडरेशन)',
    joinedAt: '2023-11-15',
    verified: true,
    status: 'approved',
    communityBackground: 'Student / Youth Alpsankhyak Front',
    approvedBy: 'State Committee',
    approvedAt: '2023-11-16',
    bloodGroup: 'O+',
    education: 'M.A. Political Science, AMU',
    bio: 'Active student union voice championing campus democracy, subsidized hostel facilities, and fair competitive exam procedures.',
  },
  {
    id: 'REQ-UP-8492',
    fullName: 'Gautam Kumar Gautam',
    fullNameHi: 'गौतम कुमार गौतम',
    phone: '+91 98110 55443',
    email: 'gautam.dalitrights@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    state: 'Uttar Pradesh',
    district: 'Moradabad',
    subDistrict: 'Bilari Tehsil',
    wing: 'legal_cell',
    designation: 'Dalit-Alpsankhyak Rights Associate',
    designationHi: 'दलित-अल्पसंख्यक अधिकार कार्यकर्ता',
    joinedAt: '2026-10-14',
    verified: false,
    status: 'pending',
    communityBackground: 'Dalit (SC) / Dr. Ambedkar Samaj Front',
    bloodGroup: 'A+',
    education: 'B.A. Political Science & Social Work',
    bio: 'Passionate about Babasaheb Ambedkar’s social justice vision, working together with MYL on student scholarships and anti-discrimination legal aid.',
  },
  {
    id: 'REQ-UP-8501',
    fullName: 'Simranjeet Singh',
    fullNameHi: 'सिमरनजीत सिंह',
    phone: '+91 97190 88221',
    email: 'simranjeet.singh@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    subDistrict: 'Hazratganj Unit',
    wing: 'white_guard',
    designation: 'Relief & Seva Volunteer',
    designationHi: 'सेवा व राहत स्वयंसेवक',
    joinedAt: '2026-10-15',
    verified: false,
    status: 'pending',
    communityBackground: 'Sikh Minority (Alpsankhyak Front)',
    bloodGroup: 'O+',
    education: 'B.Tech IT',
    bio: 'Dedicated to inter-faith disaster seva, blood donation camps, and community kitchens.',
  },
];

const INITIAL_EVENTS: PartyEvent[] = [
  {
    id: 'ev-up-1',
    title: {
      en: 'State Youth Conference & "Life Lift" Career Conclave 2026',
      hi: 'राज्य युवा सम्मेलन एवं "लाइफ लिफ्ट" करियर महासम्मेलन 2026',
    },
    description: {
      en: 'A statewide gathering organized by Muslim Youth League UP bringing together 5,000+ students and youth. Free guidance on UPSC, UPPSC, judicial services, digital skills, and central minority scholarships.',
      hi: 'मुस्लिम यूथ लीग उत्तर प्रदेश द्वारा आयोजित भव्य राज्य युवा सम्मेलन। 5,000+ युवाओं को यूपीएससी, यूपीपीएससी, न्यायिक सेवा, डिजिटल कौशल और छात्रवृत्ति पर विशेषज्ञ मार्गदर्शन।',
    },
    category: 'career_conclave',
    date: '2026-11-08',
    time: '10:30 AM',
    location: {
      en: 'Rifa-e-Aam Club Grounds, Lucknow',
      hi: 'रिफ़ा-ए-आम क्लब मैदान, लखनऊ',
    },
    district: 'Lucknow',
    subDistrict: 'Hazratganj',
    state: 'Uttar Pradesh',
    rsvpCount: 4120,
    userRsvp: 'going',
    coordinator: {
      name: 'Adv. Sarfaraz Ahmed & Team',
      phone: '+91 98370 00112',
      designation: 'National President (MYL)',
    },
    highlightTag: {
      en: 'Life Lift Conclave',
      hi: 'लाइफ लिफ्ट करियर सम्मलेन',
    },
    createdBy: 'Adv. Sarfaraz Ahmed',
  },
  {
    id: 'ev-up-2',
    title: {
      en: 'MSF State Students Charter & Campus Scholarship March',
      hi: 'MSF राज्य छात्र अधिकार सभा एवं छात्रवृत्ति पदयात्रा',
    },
    description: {
      en: 'Muslim Students Federation (MSF) mobilization demanding timely disbursal of post-matric educational scholarships, subsidized hostel accommodations, and transparent university examinations.',
      hi: 'मुस्लिम स्टूडेंट्स फेडरेशन (MSF) द्वारा पोस्ट-मैट्रिक छात्रवृत्ति के समयबद्ध भुगतान, किफायती हॉस्टल और पारदर्शी विश्वविद्यालय परीक्षाओं की मांग को लेकर छात्र सभा।',
    },
    category: 'campus_drive',
    date: '2026-11-18',
    time: '11:00 AM',
    location: {
      en: 'Town Hall Grounds, Sambhal',
      hi: 'टाउन हॉल मैदान, संभल',
    },
    district: 'Sambhal',
    subDistrict: 'Chandausi Tehsil',
    state: 'Uttar Pradesh',
    rsvpCount: 1850,
    userRsvp: null,
    coordinator: {
      name: 'Tariq Anwar',
      phone: '+91 94123 44556',
      designation: 'District MSF In-Charge',
    },
    highlightTag: {
      en: 'Student Rights',
      hi: 'छात्र अधिकार',
    },
    createdBy: 'Tariq Anwar',
  },
  {
    id: 'ev-up-3',
    title: {
      en: 'White Guard Winter Blanket & Medical Seva Camp',
      hi: 'व्हाइट गार्ड शीतकालीन कंबल वितरण एवं स्वास्थ्य सेवा शिविर',
    },
    description: {
      en: 'Humanitarian community relief drive by White Guard volunteers providing free doctor consultations, essential medicines, and blankets to destitute families of all communities.',
      hi: 'व्हाइट गार्ड स्वयंसेवकों द्वारा सभी समुदायों के जरूरतमंद परिवारों हेतु निःशुल्क स्वास्थ्य जांच, दवाएं और शीतकालीन कंबल वितरण शिविर।',
    },
    category: 'relief_seva',
    date: '2026-11-25',
    time: '09:30 AM',
    location: {
      en: 'Community Health Centre Compound, Moradabad',
      hi: 'सामुदायिक केंद्र परिसर, मुरादाबाद',
    },
    district: 'Moradabad',
    subDistrict: 'Bilari Tehsil',
    state: 'Uttar Pradesh',
    rsvpCount: 920,
    userRsvp: 'maybe',
    coordinator: {
      name: 'Dr. Imran Qureshi',
      phone: '+91 98399 22334',
      designation: 'White Guard Seva In-Charge',
    },
    highlightTag: {
      en: 'Seva & Relief',
      hi: 'सेवा एवं राहत',
    },
    createdBy: 'Adv. Zeeshan Farooqui',
  },
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-up-1',
    title: {
      en: 'Muslim Youth League UP Ratifies 10-Point "Youth & Education Resolution" for Uttar Pradesh',
      hi: 'मुस्लिम यूथ लीग उत्तर प्रदेश ने राज्य के युवाओं के लिए 10-सूत्रीय "तालीम एवं रोजगार प्रस्ताव" पारित किया',
    },
    excerpt: {
      en: 'National President Adv. Sarfaraz Ahmed stated that MYL is building constructive grassroots leadership committed to Baba Saheb Ambedkar\'s constitutional ideals.',
      hi: 'राष्ट्रीय अध्यक्ष एडवोकेट सरफ़राज़ अहमद ने कहा कि MYL बाबासाहेब डॉ. आंबेडकर के संवैधानिक आदर्शों पर आधारित रचनात्मक व शिक्षित युवा नेतृत्व तैयार कर रही है।',
    },
    fullContent: {
      en: 'Addressing the State Cadre Convention, the leadership ratified the historic 10-Point Resolution. Demands include restoring full post-matric scholarship allocations for OBC, Dalit, and minority students, establishing government degree colleges in educationally backward tehsils of Moradabad, Sambhal, Rampur, and Azamgarh, and launching district-level competitive examination coaching centres free of charge.',
      hi: 'राज्य कार्यकर्ता सम्मेलन को संबोधित करते हुए नेतृत्व ने ऐतिहासिक 10-सूत्रीय प्रस्ताव पारित किया। इसमें ओबीसी, दलित और अल्पसंख्यक छात्रों की छात्रवृत्ति का शत-प्रतिशत वितरण, मुरादाबाद, संभल, रामपुर, और आज़मगढ़ की पिछड़ी तहसीलों में सरकारी डिग्री कॉलेज खोलने, और ज़िला स्तर पर निःशुल्क कोचिंग केंद्र स्थापित करने की मांग की गई है।',
    },
    category: 'press_release',
    publishedAt: '2026-10-14',
    readTime: '3 min',
    author: {
      name: { en: 'UP State Media Committee', hi: 'उत्तर प्रदेश राज्य मीडिया समिति' },
      role: { en: 'Official Spokesperson', hi: 'आधिकारिक प्रवक्ता' },
    },
    shareCount: 2840,
    tags: ['MuslimYouthLeague', 'UPYouth', 'EducationRights', 'LifeLift'],
  },
  {
    id: 'news-up-2',
    title: {
      en: 'MSF Launches Statewide "Campus Helpline" for Post-Matric Minority & Dalit Scholarships',
      hi: 'MSF ने उत्तर प्रदेश के छात्रों हेतु "कैंपस छात्रवृत्ति सहायता हेल्पलाइन" का शुभारंभ किया',
    },
    excerpt: {
      en: 'Dedicated student volunteer desks established across universities and degree colleges to assist students with online portal verification and documentation.',
      hi: 'विश्वविद्यालयों व महाविद्यालयों में छात्रों के ऑनलाइन पोर्टल सत्यापन और दस्तावेजीकरण में सहायता हेतु समर्पित छात्र सहायता डेस्क स्थापित।',
    },
    fullContent: {
      en: 'Muslim Students Federation (MSF) units in Aligarh, Lucknow, Varanasi, and Meerut have initiated direct student assistance desks. The initiative aims to prevent thousands of eligible students from losing vital educational aid due to portal technical errors and red tape.',
      hi: 'मुस्लिम स्टूडेंट्स फेडरेशन (MSF) ने अलीगढ़, लखनऊ, वाराणसी और मेरठ के कॉलेजों में सीधी सहायता डेस्क शुरू की है, ताकि तकनीकी खामियों और प्रशासनिक लेटलतीफी के कारण किसी भी योग्य छात्र की छात्रवृत्ति न रुके।',
    },
    category: 'ground_action',
    publishedAt: '2026-10-11',
    readTime: '3 min',
    author: {
      name: { en: 'MSF State Secretariat', hi: 'MSF प्रदेश सचिवालय' },
      role: { en: 'Student Affairs Secretary', hi: 'छात्र कल्याण सचिव' },
    },
    shareCount: 3950,
    tags: ['MSF', 'ScholarshipHelp', 'StudentEmpowerment'],
  },
];

const INITIAL_DISTRICTS: DistrictUnit[] = [
  {
    id: 'dist-sambhal',
    state: 'Uttar Pradesh',
    districtName: { en: 'Sambhal', hi: 'संभल' },
    activeMembers: 1980,
    completedEvents: 42,
    activityScore: 95,
    subDistricts: [
      {
        id: 'sub-sambhal-sadar',
        name: { en: 'Sambhal Sadar Tehsil', hi: 'संभल सदर तहसील' },
        inCharge: 'Mohd. Danish Qasmi',
        inChargePhone: '+91 94121 22334',
        membersCount: 820,
        status: 'high_activity',
      },
      {
        id: 'sub-chandausi',
        name: { en: 'Chandausi Tehsil Unit', hi: 'चंदौसी तहसील इकाई' },
        inCharge: 'Arun Kumar & Rizwan Ali',
        inChargePhone: '+91 94123 44556',
        membersCount: 640,
        status: 'high_activity',
      },
      {
        id: 'sub-gunnaur',
        name: { en: 'Gunnaur Tehsil Unit', hi: 'गुन्नौर तहसील इकाई' },
        inCharge: 'Zubair Ahmad',
        inChargePhone: '+91 94125 66778',
        membersCount: 520,
        status: 'active',
      },
    ],
    leadershipTimeline: [
      {
        id: 'lead-smb-1',
        leaderName: { en: 'Farhan Akhtar Siddiqui', hi: 'फरहान अख्तर सिद्दीकी' },
        postTitle: { en: 'District President (MYL Sambhal)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग संभल)' },
        tenureStart: '2024-01',
        tenureEnd: 'Present',
        status: 'current',
        contact: '+91 98372 11223',
        email: 'sambhal.myl@up.org',
        achievements: [
          { en: 'Established MSF study circles in 18 degree colleges', hi: '18 डिग्री कॉलेजों में MSF अध्ययन मंडल स्थापित किए' },
          { en: 'Conducted Life Lift career orientation for 2,200 rural matriculates', hi: '2,200 ग्रामीण छात्रों हेतु लाइफ लिफ्ट करियर वर्कशॉप आयोजित की' },
        ],
      },
      {
        id: 'lead-smb-2',
        leaderName: { en: 'Naveed Ur Rehman', hi: 'नवीद उर रहमान' },
        postTitle: { en: 'District President (MYL Sambhal)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग संभल)' },
        tenureStart: '2022-03',
        tenureEnd: '2023-12',
        status: 'past',
        achievements: [
          { en: 'Formed White Guard disaster relief team during heavy flooding', hi: 'बाढ़ के दौरान व्हाइट गार्ड आपदा राहत टीम का गठन व संचालन' },
        ],
      },
    ],
  },
  {
    id: 'dist-moradabad',
    state: 'Uttar Pradesh',
    districtName: { en: 'Moradabad', hi: 'मुरादाबाद' },
    activeMembers: 2450,
    completedEvents: 54,
    activityScore: 97,
    subDistricts: [
      {
        id: 'sub-moradabad-city',
        name: { en: 'Moradabad City Unit', hi: 'मुरादाबाद नगर इकाई' },
        inCharge: 'Waseem Akram',
        inChargePhone: '+91 98370 55667',
        membersCount: 1100,
        status: 'high_activity',
      },
      {
        id: 'sub-bilari',
        name: { en: 'Bilari Tehsil Unit', hi: 'बिलारी तहसील इकाई' },
        inCharge: 'Mohd. Rafeeq',
        inChargePhone: '+91 98372 77889',
        membersCount: 750,
        status: 'active',
      },
      {
        id: 'sub-kanth',
        name: { en: 'Kanth Tehsil Unit', hi: 'कांठ तहसील इकाई' },
        inCharge: 'Tanveer Alam',
        inChargePhone: '+91 98374 99001',
        membersCount: 600,
        status: 'active',
      },
    ],
    leadershipTimeline: [
      {
        id: 'lead-mbd-1',
        leaderName: { en: 'Adv. Zeeshan Farooqui', hi: 'एडवोकेट ज़ीशान फ़ारूक़ी' },
        postTitle: { en: 'District President (MYL Moradabad)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग मुरादाबाद)' },
        tenureStart: '2023-10',
        tenureEnd: 'Present',
        status: 'current',
        contact: '+91 98370 12345',
        email: 'moradabad.myl@up.org',
        achievements: [
          { en: 'Organized brass-ware youth artisan legal assistance cell', hi: 'पीतल दस्तकार युवा विधिक सहायता केंद्र की स्थापना' },
          { en: 'Mobilized 3,500 students in the MSF Education Convention', hi: 'MSF शिक्षा महासम्मेलन में 3,500 छात्रों की भागीदारी' },
        ],
      },
    ],
  },
  {
    id: 'dist-lucknow',
    state: 'Uttar Pradesh',
    districtName: { en: 'Lucknow', hi: 'लखनऊ' },
    activeMembers: 1820,
    completedEvents: 38,
    activityScore: 92,
    subDistricts: [
      {
        id: 'sub-hazratganj',
        name: { en: 'Central / Hazratganj Unit', hi: 'मध्य / हज़रतगंज इकाई' },
        inCharge: 'Syed Hamza',
        inChargePhone: '+91 99190 11223',
        membersCount: 780,
        status: 'high_activity',
      },
      {
        id: 'sub-old-lucknow',
        name: { en: 'Old City / Chowk Unit', hi: 'पुराना शहर / चौक इकाई' },
        inCharge: 'Mohd. Adil',
        inChargePhone: '+91 99192 33445',
        membersCount: 620,
        status: 'high_activity',
      },
    ],
    leadershipTimeline: [
      {
        id: 'lead-lko-1',
        leaderName: { en: 'Faizan Ur Rehman', hi: 'फैज़ान उर रहमान' },
        postTitle: { en: 'District President (MYL Lucknow)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग लखनऊ)' },
        tenureStart: '2024-02',
        tenureEnd: 'Present',
        status: 'current',
        contact: '+91 99190 88776',
        email: 'lucknow.myl@up.org',
        achievements: [
          { en: 'Set up UP state central cadre grievance & legal helpline', hi: 'उत्तर प्रदेश केंद्रीय कार्यकर्ता समस्या समाधान व विधिक हेल्पलाइन' },
        ],
      },
    ],
  },
];

const INITIAL_POSTS: PostDesignation[] = [
  {
    id: 'post-1',
    titleEn: 'State President',
    titleHi: 'प्रदेश अध्यक्ष',
    level: 'state',
    wingId: 'myl_cadre',
    descriptionEn: 'Apex constitutional and executive head of Muslim Youth League Uttar Pradesh committee.',
    descriptionHi: 'मुस्लिम यूथ लीग उत्तर प्रदेश राज्य समिति के शीर्ष कार्यकारी व संगठनात्मक प्रमुख।',
    status: 'active',
    termYears: 3,
  },
  {
    id: 'post-2',
    titleEn: 'State General Secretary',
    titleHi: 'प्रदेश महासचिव (संगठन)',
    level: 'state',
    wingId: 'myl_cadre',
    descriptionEn: 'Coordinates district units, organizational rallies, cadre membership drives across 75 UP districts.',
    descriptionHi: 'उत्तर प्रदेश के सभी 75 ज़िलों में संगठन विस्तार, सदस्यता अभियान और समन्वय।',
    status: 'active',
    termYears: 3,
  },
  {
    id: 'post-3',
    titleEn: 'State Media & Press Coordinator',
    titleHi: 'प्रदेश मुख्य मीडिया व प्रेस प्रवक्ता',
    level: 'state',
    wingId: 'it_media',
    descriptionEn: 'Official authorized spokesperson responsible for press releases, statements, television debates, and media relations.',
    descriptionHi: 'आधिकारिक प्रेस विज्ञप्ति, मीडिया वक्तव्य, टीवी डिबेट्स व पत्रकार वार्ता का उत्तरदायित्व।',
    status: 'active',
    termYears: 2,
  },
  {
    id: 'post-4',
    titleEn: 'Content, Ideology & Archives Convener',
    titleHi: 'वैचारिक दस्तावेज व साक्ष्य प्रमुख',
    level: 'state',
    wingId: 'general',
    descriptionEn: 'Maintains historical parliamentary archives, FAQ clarifications, bilingual cadre literature.',
    descriptionHi: 'संसदीय रिकॉर्ड, भ्रांतियों के दस्तावेजी निवारण व द्विभाषी साहित्य का संपादन।',
    status: 'active',
    termYears: 2,
  },
  {
    id: 'post-5',
    titleEn: 'District President',
    titleHi: 'ज़िला अध्यक्ष',
    level: 'district',
    wingId: 'myl_cadre',
    descriptionEn: 'Presides over district committee, local public outreach, tehsil committees, and approvals.',
    descriptionHi: 'ज़िला समिति, तहसील इकाइयों के गठन और स्थानीय जनमुद्दों पर नेतृत्व।',
    status: 'active',
    termYears: 2,
  },
  {
    id: 'post-6',
    titleEn: 'MSF Campus President (University Unit)',
    titleHi: 'एमएसएफ विश्वविद्यालय इकाई अध्यक्ष',
    level: 'block',
    wingId: 'msf',
    descriptionEn: 'Represents student affairs, scholarship facilitation, campus democracy at AMU, Lucknow University, etc.',
    descriptionHi: 'छात्रवृत्ति, कैंपस लोकतंत्र व छात्र कल्याण का विश्वविद्यालय स्तरीय नेतृत्व।',
    status: 'active',
    termYears: 1,
  },
  {
    id: 'post-7',
    titleEn: 'White Guard Disaster Seva Captain',
    titleHi: 'व्हाइट गार्ड आपदा राहत कप्तान',
    level: 'district',
    wingId: 'white_guard',
    descriptionEn: 'Coordinates flood relief, free ambulance service, hospital patient assistance, and communal peace teams.',
    descriptionHi: 'बाढ़ राहत, निःशुल्क एम्बुलेंस, रक्तदान व सर्वसमाज शांति दल का समन्वय।',
    status: 'active',
    termYears: 2,
  },
  {
    id: 'post-8',
    titleEn: 'Legal Aid & Human Rights Cell Convener',
    titleHi: 'विधिक प्रकोष्ठ व मानवाधिकार संयोजक',
    level: 'state',
    wingId: 'legal_cell',
    descriptionEn: 'Senior advocates providing free legal consultation, bail aid, and constitutional defense for poor youth.',
    descriptionHi: 'गरीब व प्रताड़ित युवाओं को निःशुल्क कानूनी सहायता, आरटीआई मार्गदर्शन व मानवाधिकार संरक्षण।',
    status: 'active',
    termYears: 2,
  },
];

const INITIAL_WINGS: OrgWing[] = [
  {
    id: 'wing-1',
    code: 'myl_cadre',
    nameEn: 'Muslim Youth League (MYL)',
    nameHi: 'मुस्लिम यूथ लीग (MYL)',
    color: 'emerald',
    focusEn: 'Youth Political Awakening & Democratic Rights',
    focusHi: 'युवा राजनीतिक जागृति व लोकतांत्रिक अधिकार',
    descriptionEn: 'The frontline youth vanguard of IUML working across Uttar Pradesh for civil rights, education, and equality.',
    descriptionHi: 'आईयूएमएल का अग्रणी युवा संगठन जो पूरे यूपी में नागरिक अधिकारों और शिक्षा के लिए सक्रिय है।',
    headLeaderName: 'Adv. Sarfaraz Ahmed',
    badgeLabel: 'Primary Youth Wing',
  },
  {
    id: 'wing-2',
    code: 'msf',
    nameEn: 'Muslim Students Federation (MSF)',
    nameHi: 'मुस्लिम स्टूडेंट्स फेडरेशन (MSF)',
    color: 'blue',
    focusEn: 'Campus Democracy, Scholarships & Student Welfare',
    focusHi: 'कैंपस लोकतंत्र, छात्रवृत्तियां एवं उच्च शिक्षा कल्याण',
    descriptionEn: 'Historic student union founded in 1937 championing educational advancement and university democracy.',
    descriptionHi: 'ऐतिहासिक छात्र संगठन जो प्रतियोगी परीक्षाओं, हॉस्टल व छात्रवृत्ति के अधिकारों की लड़ाई लड़ता है।',
    headLeaderName: 'Shadab Ahmad Khan',
    badgeLabel: 'Student Wing',
  },
  {
    id: 'wing-3',
    code: 'white_guard',
    nameEn: 'White Guard Humanitarian Seva Brigade',
    nameHi: 'व्हाइट गार्ड मानवतावादी सेवा दल',
    color: 'stone',
    focusEn: 'Disaster Relief, Ambulance Seva & Communal Harmony',
    focusHi: 'आपदा राहत, एम्बुलेंस सेवा एवं सांप्रदायिक सौहार्द',
    descriptionEn: 'Disciplined volunteer corp in white uniform serving all communities during medical crises, accidents, and calamities.',
    descriptionHi: 'सफेद वर्दीधारी अनुशासित स्वयंसेवक जो बिना किसी भेदभाव के रक्तदान, राहत व सेवा कार्य करते हैं।',
    headLeaderName: 'Simranjeet Singh',
    badgeLabel: 'Relief Brigade',
  },
  {
    id: 'wing-4',
    code: 'life_lift',
    nameEn: '"Life Lift" Career & Competitive Guidance Cell',
    nameHi: '"लाइफ लिफ्ट" करियर व प्रतियोगी मार्गदर्शन प्रकोष्ठ',
    color: 'amber',
    focusEn: 'UPSC / UPPSC Mentorship, Skill Training & Placement',
    focusHi: 'यूपीएससी, न्यायिक सेवा, डिजिटल कौशल व रोज़गार मार्गदर्शन',
    descriptionEn: 'Empowering tier-2 and tier-3 UP youth with competitive exam coaching and modern technology skills.',
    descriptionHi: 'तहसील व कस्बों के पिछड़े व अल्पसंख्यक युवाओं को प्रशासनिक परीक्षाओं की तैयारी व तकनीकी कौशल।',
    headLeaderName: 'Dr. Masood Alam',
    badgeLabel: 'Career Cell',
  },
  {
    id: 'wing-5',
    code: 'legal_cell',
    nameEn: 'Constitutional Rights & Legal Aid Cell',
    nameHi: 'संवैधानिक अधिकार व विधिक सहायता प्रकोष्ठ',
    color: 'purple',
    focusEn: 'Free Legal Defense, RTI Clinic & Civil Liberties',
    focusHi: 'निःशुल्क विधिक रक्षा, आरटीआई क्लिनिक व नागरिक स्वतंत्रता',
    descriptionEn: 'A network of advocates fighting against police harassment, illegal detentions, and constitutional violations.',
    descriptionHi: 'अधिवक्ताओं का नेटवर्क जो बाबासाहेब आंबेडकर के संविधान के तहत विधिक सुरक्षा प्रदान करता है।',
    headLeaderName: 'Adv. Zeeshan Farooqui',
    badgeLabel: 'Legal Cell',
  },
  {
    id: 'wing-6',
    code: 'it_media',
    nameEn: 'IT & Digital Media Broadcast Cell',
    nameHi: 'आईटी व डिजिटल मीडिया प्रचार प्रकोष्ठ',
    color: 'cyan',
    focusEn: 'Cyber Vigilance, Fact Checking & Social Media Broadcast',
    focusHi: 'साइबर सतर्कता, तथ्य-सत्यापन व सोशल मीडिया प्रसारण',
    descriptionEn: 'Countering fake news, designing digital campaigns in Hindi and Urdu, running grassroots broadcast desks.',
    descriptionHi: 'सोशल मीडिया पर भ्रामक प्रचार का खंडन और पार्टी के संदेश को जन-जन तक पहुंचाना।',
    headLeaderName: 'Mohd. Irfan',
    badgeLabel: 'Media Cell',
  },
  {
    id: 'wing-7',
    code: 'dalit_alpsankhyak',
    nameEn: 'Dalit-Alpsankhyak Constitutional Unity Front',
    nameHi: 'दलित-अल्पसंख्यक संवैधानिक एकता मंच',
    color: 'indigo',
    focusEn: 'Bahujan-Minority Brotherhood & Social Justice',
    focusHi: 'बहुजन-अल्पसंख्यक भाईचारा एवं सामाजिक न्याय',
    descriptionEn: 'Bridging Muslims, Dalits, Sikhs, Christians, and Buddhists on common social justice and constitutional rights platforms.',
    descriptionHi: 'दलितों, मुसलमानों, सिखों, ईसाइयों व बौद्धों का संयुक्त सामाजिक न्याय व हक-इंसाफ का मंच।',
    headLeaderName: 'Gautam Kumar Gautam',
    badgeLabel: 'Unity Front',
  },
];

const INITIAL_ORG_DISTRICTS: OrgDistrict[] = [
  {
    id: 'org-dist-1',
    nameEn: 'Moradabad',
    nameHi: 'मुरादाबाद',
    zone: 'Rohilkhand',
    subDistricts: ['Moradabad Sadar', 'Bilari', 'Kanth', 'Thakurdwara', 'Sambhal Road Ward'],
    headquarters: 'Station Road, Moradabad',
    inChargeName: 'Adv. Zeeshan Farooqui',
    inChargePhone: '+91 98370 12345',
    activeCadreCount: 384,
    status: 'active',
  },
  {
    id: 'org-dist-2',
    nameEn: 'Sambhal',
    nameHi: 'संभल',
    zone: 'Rohilkhand',
    subDistricts: ['Sambhal Sadar', 'Chandausi', 'Gunnaur', 'Bahjoi'],
    headquarters: 'Choudhary Sarai, Sambhal',
    inChargeName: 'Tariq Anwar',
    inChargePhone: '+91 98371 99882',
    activeCadreCount: 295,
    status: 'active',
  },
  {
    id: 'org-dist-3',
    nameEn: 'Rampur',
    nameHi: 'रामपुर',
    zone: 'Rohilkhand',
    subDistricts: ['Rampur Sadar', 'Bilaspur', 'Milak', 'Shahabad', 'Swar', 'Tanda'],
    headquarters: 'Topkhana Gate, Rampur',
    inChargeName: 'Akhtar Raza',
    inChargePhone: '+91 94123 44556',
    activeCadreCount: 310,
    status: 'active',
  },
  {
    id: 'org-dist-4',
    nameEn: 'Bareilly',
    nameHi: 'बरेली',
    zone: 'Rohilkhand',
    subDistricts: ['Bareilly Sadar', 'Aonla', 'Baheri', 'Faridpur', 'Mirganj', 'Nawabganj'],
    headquarters: 'Civil Lines, Bareilly',
    inChargeName: 'Wasim Akram',
    inChargePhone: '+91 98372 77889',
    activeCadreCount: 260,
    status: 'active',
  },
  {
    id: 'org-dist-5',
    nameEn: 'Meerut',
    nameHi: 'मेरठ',
    zone: 'Western UP',
    subDistricts: ['Meerut City', 'Meerut Cantt', 'Mawana', 'Sardhana'],
    headquarters: 'Hapur Stand, Meerut',
    inChargeName: 'Shahid Chaudhary',
    inChargePhone: '+91 98971 66554',
    activeCadreCount: 340,
    status: 'active',
  },
  {
    id: 'org-dist-6',
    nameEn: 'Aligarh',
    nameHi: 'अलीगढ़',
    zone: 'Western UP',
    subDistricts: ['Koil', 'Atrauli', 'Khair', 'Gabhana', 'Iglas', 'AMU Campus Unit'],
    headquarters: 'Dodhpur, Aligarh',
    inChargeName: 'Shadab Ahmad Khan',
    inChargePhone: '+91 94150 99887',
    activeCadreCount: 420,
    status: 'active',
  },
  {
    id: 'org-dist-7',
    nameEn: 'Saharanpur',
    nameHi: 'सहारनपुर',
    zone: 'Western UP',
    subDistricts: ['Saharanpur Sadar', 'Deoband', 'Behat', 'Nakur', 'Rampur Maniharan'],
    headquarters: 'Court Road, Saharanpur',
    inChargeName: 'Rizwan Usmani',
    inChargePhone: '+91 98970 33221',
    activeCadreCount: 375,
    status: 'active',
  },
  {
    id: 'org-dist-8',
    nameEn: 'Muzaffarnagar',
    nameHi: 'मुज़फ़्फ़रनगर',
    zone: 'Western UP',
    subDistricts: ['Muzaffarnagar Sadar', 'Budhana', 'Jansath', 'Khatauli'],
    headquarters: 'Meenakshi Chowk, Muzaffarnagar',
    inChargeName: 'Nadeem Ansari',
    inChargePhone: '+91 98370 88776',
    activeCadreCount: 280,
    status: 'active',
  },
  {
    id: 'org-dist-9',
    nameEn: 'Lucknow',
    nameHi: 'लखनऊ',
    zone: 'Awadh',
    subDistricts: ['Lucknow Sadar', 'Hazratganj', 'Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj'],
    headquarters: 'Kaiserbagh, Lucknow',
    inChargeName: 'Simranjeet Singh',
    inChargePhone: '+91 97190 88221',
    activeCadreCount: 350,
    status: 'active',
  },
  {
    id: 'org-dist-10',
    nameEn: 'Kanpur Nagar',
    nameHi: 'कानपुर नगर',
    zone: 'Awadh',
    subDistricts: ['Kanpur Sadar', 'Chamanganj Unit', 'Bilhaur', 'Ghatampur'],
    headquarters: 'Parade, Kanpur',
    inChargeName: 'Hamza Siddiqui',
    inChargePhone: '+91 94150 22331',
    activeCadreCount: 290,
    status: 'active',
  },
  {
    id: 'org-dist-11',
    nameEn: 'Agra',
    nameHi: 'आगरा',
    zone: 'Western UP',
    subDistricts: ['Agra Sadar', 'Etmadpur', 'Fatehabad', 'Kheragarh', 'Bah'],
    headquarters: 'Sanjay Place, Agra',
    inChargeName: 'Faizan Qureshi',
    inChargePhone: '+91 98972 11009',
    activeCadreCount: 220,
    status: 'active',
  },
  {
    id: 'org-dist-12',
    nameEn: 'Varanasi',
    nameHi: 'वाराणसी',
    zone: 'Purvanchal',
    subDistricts: ['Varanasi Sadar', 'Pindra', 'Rajatalab', 'Beniyabagh Unit'],
    headquarters: 'Nadesar, Varanasi',
    inChargeName: 'Amanullah Ansari',
    inChargePhone: '+91 94500 88990',
    activeCadreCount: 195,
    status: 'active',
  },
];

export const storageService = {
  // Auth Session
  getCurrentUser(): AuthUser {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (data) return JSON.parse(data);
    } catch {}
    // Default website opens with public role
    return PUBLIC_USER;
  },

  setCurrentUser(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch {}
  },

  getAllUsers(): AuthUser[] {
    // Legacy localStorage accounts are not authentication identities. Never expose stored passwords.
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (data) {
        const users = JSON.parse(data) as AuthUser[];
        return users.map(({ password: _password, ...user }) => user);
      }
    } catch {}
    return [];
  },

  authenticateWithPassword(_identifier: string, _passwordAttempt: string): { success: boolean; user?: AuthUser; error?: string } {
    return { success: false, error: 'Password authentication is handled by Supabase Auth.' };
  },

  updateUserRole(userId: string, newRole: UserRole, district?: string, designation?: string): AuthUser[] {
    const users = this.getAllUsers();
    const updated = users.map((u) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        role: newRole,
        district: district !== undefined ? district : u.district,
        designation: designation || u.designation,
      };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
    } catch {}

    const current = this.getCurrentUser();
    if (current.id === userId) {
      const updatedCurrent = updated.find((u) => u.id === userId);
      if (updatedCurrent) this.setCurrentUser(updatedCurrent);
    }
    return updated;
  },

  createUserAccount(_userData: Omit<AuthUser, 'id'>): { success: boolean; user?: AuthUser; error?: string } {
    return { success: false, error: 'Local account creation is disabled. Provision users through Supabase Auth and assign their profile and role in Supabase.' };
  },

  canChangeUserPassword(actingUser: AuthUser, targetUserId: string): boolean {
    if (actingUser.role === 'superadmin') return true;
    return actingUser.id === targetUserId;
  },

  changeUserPassword(_userId: string, _newPassword: string): boolean {
    return false;
  },

  changeUserPasswordWithPermission(_actingUser: AuthUser, _targetUserId: string, _newPassword: string): { success: boolean; error?: string } {
    return { success: false, error: 'Passwords are managed by Supabase Auth and cannot be viewed or changed through localStorage.' };
  },

  deleteUserAccount(userId: string): AuthUser[] {
    const users = this.getAllUsers();
    const updated = users.filter((u) => u.id !== userId);
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  getCurrentMemberId(): string | null {
    try {
      return localStorage.getItem('myl_up_current_member_id_v3');
    } catch {
      return null;
    }
  },

  setCurrentMemberId(id: string): void {
    try {
      localStorage.setItem('myl_up_current_member_id_v3', id);
    } catch {}
  },

  // Members & Cadre Approvals
  getMembers(): Member[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_MEMBERS;
  },

  // Submit new application (defaults to 'pending' unless admin enters it)
  submitMemberApplication(memberData: Omit<Member, 'id' | 'verified' | 'status' | 'joinedAt'>, isPreapproved = false, approverName = ''): Member {
    const list = this.getMembers();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = isPreapproved ? `MYL-UP-2026-${randomNum}` : `REQ-UP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMember: Member = {
      ...memberData,
      id,
      joinedAt: new Date().toISOString().slice(0, 10),
      verified: isPreapproved,
      status: isPreapproved ? 'approved' : 'pending',
      approvedBy: isPreapproved ? approverName : undefined,
      approvedAt: isPreapproved ? new Date().toISOString().slice(0, 10) : undefined,
    };

    const updated = [newMember, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
    } catch {}
    return newMember;
  },

  // Admin approval of pending cadre request
  approveCadre(requestId: string, approverUser: AuthUser): Member[] {
    const list = this.getMembers();
    const updated = list.map((m) => {
      if (m.id !== requestId) return m;
      const officialNum = Math.floor(100 + Math.random() * 900);
      return {
        ...m,
        id: `MYL-UP-2026-${officialNum}`,
        status: 'approved' as const,
        verified: true,
        approvedBy: `${approverUser.name} (${approverUser.designation})`,
        approvedAt: new Date().toISOString().slice(0, 10),
      };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  rejectCadre(requestId: string): Member[] {
    const list = this.getMembers();
    const updated = list.map((m) =>
      m.id === requestId ? { ...m, status: 'rejected' as const, verified: false } : m
    );
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Public Cadre Verification
  verifyCadreById(cadreId: string): Member | null {
    const list = this.getMembers();
    const cleanId = cadreId.trim().toUpperCase();
    return list.find((m) => m.id.toUpperCase() === cleanId) || null;
  },

  // Events CRUD (Authorized)
  getEvents(): PartyEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_EVENTS;
  },

  saveEvent(event: PartyEvent): PartyEvent[] {
    const list = this.getEvents();
    const existingIndex = list.findIndex((e) => e.id === event.id);
    let updated: PartyEvent[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = event;
    } else {
      updated = [event, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteEvent(eventId: string): PartyEvent[] {
    const list = this.getEvents();
    const updated = list.filter((e) => e.id !== eventId);
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  toggleRsvp(eventId: string, rsvpType: 'going' | 'maybe'): PartyEvent[] {
    const list = this.getEvents();
    const updated = list.map((ev) => {
      if (ev.id !== eventId) return ev;
      const isCurrently = ev.userRsvp === rsvpType;
      const nextRsvp = isCurrently ? null : rsvpType;
      const delta = isCurrently ? -1 : ev.userRsvp ? 0 : 1;
      return {
        ...ev,
        userRsvp: nextRsvp,
        rsvpCount: Math.max(0, ev.rsvpCount + delta),
      };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // News
  getNews(): NewsItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_NEWS;
  },

  saveNews(news: NewsItem): NewsItem[] {
    const list = this.getNews();
    const updated = [news, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteNews(newsId: string): NewsItem[] {
    const list = this.getNews();
    const updated = list.filter((n) => n.id !== newsId);
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  incrementNewsShare(newsId: string): void {
    const list = this.getNews();
    const updated = list.map((item) =>
      item.id === newsId ? { ...item, shareCount: item.shareCount + 1 } : item
    );
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
    } catch {}
  },

  // Districts & Leadership Tenures
  getDistricts(): DistrictUnit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISTRICTS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_DISTRICTS;
  },

  saveLeadershipTenure(districtId: string, tenure: DistrictUnit['leadershipTimeline'][0]): DistrictUnit[] {
    const list = this.getDistricts();
    const updated = list.map((d) => {
      if (d.id !== districtId) return d;
      const updatedTimeline = tenure.status === 'current'
        ? d.leadershipTimeline.map((item) =>
            item.status === 'current'
              ? { ...item, status: 'past' as const, tenureEnd: new Date().toISOString().slice(0, 7) }
              : item
          )
        : [...d.leadershipTimeline];
      return {
        ...d,
        leadershipTimeline: [tenure, ...updatedTimeline],
      };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.DISTRICTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteLeadershipTenure(districtId: string, tenureId: string): DistrictUnit[] {
    const list = this.getDistricts();
    const updated = list.map((d) => {
      if (d.id !== districtId) return d;
      return {
        ...d,
        leadershipTimeline: d.leadershipTimeline.filter((t) => t.id !== tenureId),
      };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.DISTRICTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  getBroadcasts(): SocialBroadcastItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BROADCASTS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveBroadcast(item: SocialBroadcastItem): SocialBroadcastItem[] {
    const list = this.getBroadcasts();
    const updated = [item, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Organizational Structure: Posts CRUD
  getPosts(): PostDesignation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_POSTS;
  },

  savePost(post: PostDesignation): PostDesignation[] {
    const list = this.getPosts();
    const index = list.findIndex((p) => p.id === post.id);
    let updated: PostDesignation[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...post, updatedAt: new Date().toISOString().slice(0, 10) };
    } else {
      updated = [{ ...post, updatedAt: new Date().toISOString().slice(0, 10) }, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deletePost(postId: string): PostDesignation[] {
    const list = this.getPosts();
    const updated = list.filter((p) => p.id !== postId);
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Organizational Structure: Wings CRUD
  getWings(): OrgWing[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WINGS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_WINGS;
  },

  saveWing(wing: OrgWing): OrgWing[] {
    const list = this.getWings();
    const index = list.findIndex((w) => w.id === wing.id);
    let updated: OrgWing[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...wing, updatedAt: new Date().toISOString().slice(0, 10) };
    } else {
      updated = [{ ...wing, updatedAt: new Date().toISOString().slice(0, 10) }, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WINGS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteWing(wingId: string): OrgWing[] {
    const list = this.getWings();
    const updated = list.filter((w) => w.id !== wingId);
    try {
      localStorage.setItem(STORAGE_KEYS.WINGS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Organizational Structure: Districts CRUD
  getOrgDistricts(): OrgDistrict[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORG_DISTRICTS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_ORG_DISTRICTS;
  },

  saveOrgDistrict(dist: OrgDistrict): OrgDistrict[] {
    const list = this.getOrgDistricts();
    const index = list.findIndex((d) => d.id === dist.id);
    let updated: OrgDistrict[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...dist, updatedAt: new Date().toISOString().slice(0, 10) };
    } else {
      updated = [{ ...dist, updatedAt: new Date().toISOString().slice(0, 10) }, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ORG_DISTRICTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteOrgDistrict(districtId: string): OrgDistrict[] {
    const list = this.getOrgDistricts();
    const updated = list.filter((d) => d.id !== districtId);
    try {
      localStorage.setItem(STORAGE_KEYS.ORG_DISTRICTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  getDistrictLeadership(districtId: string): LeadershipTenure[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISTRICT_LEADERSHIP);
      if (data) {
        const map: Record<string, LeadershipTenure[]> = JSON.parse(data);
        if (map[districtId]) return map[districtId];
      }
    } catch {}
    
    // Seed timeline for key districts
    const seedMap: Record<string, LeadershipTenure[]> = {
      'org-dist-1': [ // Moradabad
        {
          id: 'lead-mrd-1',
          leaderName: { en: 'Adv. Zeeshan Farooqui', hi: 'एडवोकेट ज़ीशान फ़ारूक़ी' },
          postTitle: { en: 'District President (MYL Moradabad)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग मुरादाबाद)' },
          tenureStart: '2024-02',
          tenureEnd: 'Present',
          status: 'current',
          contact: '+91 98370 12345',
          email: 'moradabad.myl@up.org',
          achievements: [
            { en: 'Established MSF campus coordination desk at Moradabad Hindu College', hi: 'मुरादाबाद हिंदू कॉलेज में एमएसएफ छात्र सहायता डेस्क स्थापित' },
            { en: 'Organized flood relief camps along Ramganga catchment tehsils', hi: 'रामगंगा बाढ़ प्रभावित क्षेत्रों में निःशुल्क भोजन व राहत वितरण' },
          ],
        },
        {
          id: 'lead-mrd-0',
          leaderName: { en: 'Haji Shakir Husain', hi: 'हाजी शाकिर हुसैन' },
          postTitle: { en: 'Former District President (MYL)', hi: 'पूर्व ज़िला अध्यक्ष (MYL)' },
          tenureStart: '2021-01',
          tenureEnd: '2024-01',
          status: 'past',
          contact: '+91 98370 55443',
          achievements: [
            { en: 'Formed active tehsil committees in Bilari, Kanth, and Thakurdwara', hi: 'बिलारी, कांठ और ठाकुरद्वारा में सक्रिय तहसील कमेटियों का गठन' },
          ],
        },
      ],
      'org-dist-2': [ // Sambhal
        {
          id: 'lead-smb-1',
          leaderName: { en: 'Farhan Akhtar Siddiqui', hi: 'फरहान अख्तर सिद्दीकी' },
          postTitle: { en: 'District President (MYL Sambhal)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग संभल)' },
          tenureStart: '2024-01',
          tenureEnd: 'Present',
          status: 'current',
          contact: '+91 98372 11223',
          achievements: [
            { en: 'Launched educational scholarship helpline across rural tehsils', hi: 'ग्रामीण तहसीलों में छात्रवृत्ति मार्गदर्शन व सहायता अभियान' },
          ],
        },
      ],
      'org-dist-9': [ // Lucknow
        {
          id: 'lead-lko-1',
          leaderName: { en: 'Simranjeet Singh', hi: 'सिमरनजीत सिंह' },
          postTitle: { en: 'District President (MYL Lucknow)', hi: 'ज़िला अध्यक्ष (मुस्लिम यूथ लीग लखनऊ)' },
          tenureStart: '2024-02',
          tenureEnd: 'Present',
          status: 'current',
          contact: '+91 97190 88221',
          achievements: [
            { en: 'Set up UP state central cadre grievance & legal helpline in Kaiserbagh', hi: 'कैसरबाग में केंद्रीय कार्यकर्ता समस्या समाधान व विधिक हेल्पलाइन' },
          ],
        },
      ],
    };
    return seedMap[districtId] || [];
  },

  saveDistrictLeadership(districtId: string, tenure: LeadershipTenure): LeadershipTenure[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISTRICT_LEADERSHIP);
      const map: Record<string, LeadershipTenure[]> = data ? JSON.parse(data) : {};
      const currentList = map[districtId] || this.getDistrictLeadership(districtId);
      
      const updatedList = tenure.status === 'current'
        ? currentList.map((item) =>
            item.status === 'current'
              ? { ...item, status: 'past' as const, tenureEnd: new Date().toISOString().slice(0, 7) }
              : item
          )
        : [...currentList];

      map[districtId] = [tenure, ...updatedList];
      localStorage.setItem(STORAGE_KEYS.DISTRICT_LEADERSHIP, JSON.stringify(map));
      return map[districtId];
    } catch {
      return [];
    }
  },

  deleteDistrictLeadership(districtId: string, tenureId: string): LeadershipTenure[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISTRICT_LEADERSHIP);
      const map: Record<string, LeadershipTenure[]> = data ? JSON.parse(data) : {};
      const currentList = map[districtId] || this.getDistrictLeadership(districtId);
      map[districtId] = currentList.filter((t) => t.id !== tenureId);
      localStorage.setItem(STORAGE_KEYS.DISTRICT_LEADERSHIP, JSON.stringify(map));
      return map[districtId];
    } catch {
      return [];
    }
  },

  // FAQ Myths & Facts Content CRUD
  getFaqs(): MythFaqItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (data) return JSON.parse(data);
    } catch {}
    return MYTHS_AND_FAQS;
  },

  saveFaq(faq: MythFaqItem): MythFaqItem[] {
    const list = this.getFaqs();
    const index = list.findIndex((f) => f.id === faq.id);
    let updated: MythFaqItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = faq;
    } else {
      updated = [faq, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteFaq(faqId: string): MythFaqItem[] {
    const list = this.getFaqs();
    const updated = list.filter((f) => f.id !== faqId);
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Parliamentary Leaders & Evidence CRUD
  getParliamentaryLeaders(): ParliamentaryLeader[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERS);
      if (data) return JSON.parse(data);
    } catch {}
    return PARLIAMENTARY_LEADERS;
  },

  saveLeader(leader: ParliamentaryLeader): ParliamentaryLeader[] {
    const list = this.getParliamentaryLeaders();
    const index = list.findIndex((l) => l.id === leader.id);
    let updated: ParliamentaryLeader[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = leader;
    } else {
      updated = [leader, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  deleteLeader(leaderId: string): ParliamentaryLeader[] {
    const list = this.getParliamentaryLeaders();
    const updated = list.filter((l) => l.id !== leaderId);
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(updated));
    } catch {}
    return updated;
  },
};
