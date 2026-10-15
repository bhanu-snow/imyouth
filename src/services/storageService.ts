import { Member, PartyEvent, NewsItem, DistrictUnit, SocialBroadcastItem, AuthUser, UserRole } from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'myl_up_members_v3',
  EVENTS: 'myl_up_events_v3',
  NEWS: 'myl_up_news_v3',
  DISTRICTS: 'myl_up_districts_v3',
  BROADCASTS: 'myl_up_broadcasts_v3',
  AUTH_USER: 'myl_up_auth_user_v3',
};

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'user-admin-1',
    name: 'Adv. Sarfaraz Ahmed',
    email: 'admin@mylup.org',
    phone: '+91 98370 00112',
    password: 'admin123',
    role: 'state_admin',
    designation: 'National President (MYL) & State Head UP',
    createdAt: '2024-01-01',
    lastLogin: '2026-10-15',
  },
  {
    id: 'user-dist-1',
    name: 'Adv. Zeeshan Farooqui',
    email: 'moradabad@mylup.org',
    phone: '+91 98370 12345',
    password: 'district123',
    role: 'district_incharge',
    district: 'Moradabad',
    designation: 'District President (MYL Moradabad)',
    createdAt: '2024-02-10',
    lastLogin: '2026-10-14',
  },
  {
    id: 'user-cadre-1',
    name: 'Shadab Ahmad Khan',
    email: 'volunteer@mylup.org',
    phone: '+91 94150 99887',
    password: 'cadre123',
    role: 'cadre_volunteer',
    district: 'Aligarh',
    designation: 'MSF State Vice President / AMU Unit',
    createdAt: '2024-03-15',
    lastLogin: '2026-10-12',
  },
  {
    id: 'user-guest-1',
    name: 'Public Visitor (Unauthenticated)',
    email: 'guest@mylup.org',
    phone: '',
    password: '',
    role: 'public',
    designation: 'Public Citizen / Cadre Aspirant',
    createdAt: '2026-10-15',
  },
];

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

export const storageService = {
  // Auth Session
  getCurrentUser(): AuthUser {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (data) return JSON.parse(data);
    } catch {}
    // Default to State Admin for immediate convenience
    return DEMO_USERS[0];
  },

  setCurrentUser(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch {}
  },

  getAllUsers(): AuthUser[] {
    try {
      const data = localStorage.getItem('myl_up_all_users_v4');
      if (data) return JSON.parse(data);
    } catch {}
    return DEMO_USERS;
  },

  authenticateWithPassword(identifier: string, passwordAttempt: string): { success: boolean; user?: AuthUser; error?: string } {
    const users = this.getAllUsers();
    const cleanId = identifier.trim().toLowerCase();
    const found = users.find((u) => 
      u.email?.toLowerCase() === cleanId || 
      (u.phone && u.phone.replace(/[\s\-\+]/g, '').includes(cleanId.replace(/[\s\-\+]/g, ''))) ||
      u.name.toLowerCase() === cleanId
    );

    if (!found) {
      return { success: false, error: 'User account not found. Please verify email/phone.' };
    }

    if (found.password && found.password !== passwordAttempt) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const updatedUser: AuthUser = { 
      ...found, 
      lastLogin: new Date().toISOString().slice(0, 10) 
    };
    this.setCurrentUser(updatedUser);

    const updatedList = users.map((u) => u.id === found.id ? updatedUser : u);
    try {
      localStorage.setItem('myl_up_all_users_v4', JSON.stringify(updatedList));
    } catch {}

    return { success: true, user: updatedUser };
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
      localStorage.setItem('myl_up_all_users_v4', JSON.stringify(updated));
    } catch {}

    const current = this.getCurrentUser();
    if (current.id === userId) {
      const updatedCurrent = updated.find((u) => u.id === userId);
      if (updatedCurrent) this.setCurrentUser(updatedCurrent);
    }
    return updated;
  },

  createUserAccount(userData: Omit<AuthUser, 'id'>): { success: boolean; user?: AuthUser; error?: string } {
    const users = this.getAllUsers();
    if (userData.email && users.some((u) => u.email?.toLowerCase() === userData.email?.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newId = `user-cadre-${Date.now()}`;
    const newUser: AuthUser = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString().slice(0, 10),
      lastLogin: new Date().toISOString().slice(0, 10),
    };
    const updated = [...users, newUser];
    try {
      localStorage.setItem('myl_up_all_users_v4', JSON.stringify(updated));
    } catch {}
    return { success: true, user: newUser };
  },

  changeUserPassword(userId: string, newPassword: string): boolean {
    const users = this.getAllUsers();
    const updated = users.map((u) => u.id === userId ? { ...u, password: newPassword } : u);
    try {
      localStorage.setItem('myl_up_all_users_v4', JSON.stringify(updated));
    } catch {}
    const current = this.getCurrentUser();
    if (current.id === userId) {
      this.setCurrentUser({ ...current, password: newPassword });
    }
    return true;
  },

  deleteUserAccount(userId: string): AuthUser[] {
    const users = this.getAllUsers();
    const updated = users.filter((u) => u.id !== userId);
    try {
      localStorage.setItem('myl_up_all_users_v4', JSON.stringify(updated));
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
};
