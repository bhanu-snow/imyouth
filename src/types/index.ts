export type Language = 'hi' | 'en';

export type UserRole = 
  | 'superadmin'         // Super Admin (Main Settings, View All Passwords, Change Any Password, Manage Roles)
  | 'state_president'    // State President (Posts, Wings, Districts CRUD, Cadre Approvals)
  | 'content_manager'    // Content Manager (Edit FAQ myths/facts, Leader & Evidence directory & photos in EN/HI)
  | 'press_release'      // Press Release / Media In-Charge (Publish, edit, delete events/news)
  | 'state_admin'        // State Committee Admin (Full Cadre Approvals & Admin)
  | 'district_incharge'  // District President / Secretary (District approvals & events)
  | 'cadre_volunteer'    // Active Cadre Volunteer
  | 'public';            // Guest / Public Visitor

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role: UserRole;
  district?: string;
  designation: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface PostDesignation {
  id: string;
  titleEn: string;
  titleHi: string;
  level: 'state' | 'zonal' | 'district' | 'block' | 'ward';
  wingId?: string;
  descriptionEn: string;
  descriptionHi: string;
  status: 'active' | 'reserved' | 'vacant';
  termYears?: number;
  updatedAt?: string;
}

export interface OrgWing {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  color: string;
  focusEn: string;
  focusHi: string;
  descriptionEn: string;
  descriptionHi: string;
  headLeaderName?: string;
  badgeLabel?: string;
  updatedAt?: string;
}

export interface OrgDistrict {
  id: string;
  nameEn: string;
  nameHi: string;
  zone: 'Western UP' | 'Rohilkhand' | 'Awadh' | 'Purvanchal' | 'Bundelkhand';
  subDistricts: string[];
  headquarters?: string;
  inChargeName: string;
  inChargePhone: string;
  activeCadreCount: number;
  status: 'active' | 'growing' | 'forming';
  updatedAt?: string;
}

export type YouthWing = 
  | 'myl_cadre'        // Muslim Youth League
  | 'msf'              // Muslim Students Federation (Student Wing)
  | 'white_guard'      // Humanitarian & Seva Relief Brigade
  | 'life_lift'        // Career Guidance & Skill Development Cell
  | 'legal_cell'       // Legal Aid & Constitutional Rights Cell
  | 'it_media'         // IT & Social Media Cell
  | 'general';

export type MemberStatus = 'pending' | 'approved' | 'rejected';

export interface Member {
  id: string; // public application/cadre ID
  recordId?: string; // stable database application key; not displayed
  fullName: string;
  fullNameHi?: string;
  phone: string;
  email: string;
  avatarUrl: string;
  state: string; // Uttar Pradesh
  district: string;
  subDistrict: string; // Tehsil / Block / Ward
  wing: YouthWing;
  designation: string;
  designationHi: string;
  joinedAt: string;
  verified: boolean;
  status: MemberStatus;
  communityBackground?: string; // e.g. "Dalit / Alpsankhyak Unity (Muslim, Sikh, Christian, Buddhist)"
  approvedBy?: string;
  approvedAt?: string;
  bloodGroup?: string;
  education?: string;
  bio?: string;
}

export type EventCategory = 
  | 'rally' 
  | 'conference' 
  | 'campus_drive' 
  | 'career_conclave' 
  | 'relief_seva';

export interface PartyEvent {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: { en: string; hi: string };
  district: string;
  subDistrict?: string;
  state: string;
  rsvpCount: number;
  userRsvp?: 'going' | 'maybe' | null;
  coordinator: {
    name: string;
    phone: string;
    designation: string;
  };
  highlightTag?: { en: string; hi: string };
  createdBy?: string;
}

export type NewsCategory = 
  | 'press_release' 
  | 'ground_action' 
  | 'statement' 
  | 'campaign';

export interface NewsItem {
  id: string;
  title: { en: string; hi: string };
  excerpt: { en: string; hi: string };
  fullContent: { en: string; hi: string };
  category: NewsCategory;
  publishedAt: string;
  readTime: string;
  author: {
    name: { en: string; hi: string };
    role: { en: string; hi: string };
  };
  shareCount: number;
  tags: string[];
}

export interface LeadershipTenure {
  id: string;
  leaderName: { en: string; hi: string };
  postTitle: { en: string; hi: string };
  tenureStart: string;
  tenureEnd: string | 'Present';
  status: 'current' | 'past' | 'acting';
  contact?: string;
  email?: string;
  achievements: { en: string; hi: string }[];
}

export interface SubDistrictUnit {
  id: string;
  name: { en: string; hi: string };
  inCharge: string;
  inChargePhone: string;
  membersCount: number;
  status: 'high_activity' | 'active' | 'growing';
}

export interface DistrictUnit {
  id: string;
  state: string;
  districtName: { en: string; hi: string };
  activeMembers: number;
  completedEvents: number;
  activityScore: number;
  subDistricts: SubDistrictUnit[];
  leadershipTimeline: LeadershipTenure[];
}

export type SocialPlatform = 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'instagram';

export interface SocialBroadcastItem {
  id: string;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  hashtags: string[];
  url: string;
  targetPlatforms: SocialPlatform[];
  createdAt: string;
  metrics?: {
    shares: number;
    clicks: number;
  };
}

export interface MythFaqItem {
  id: string;
  category: 'history' | 'ideology' | 'up_focus' | 'secularism' | 'wings';
  mythEn: string;
  mythHi: string;
  factEn: string;
  factHi: string;
  detailedExplanationEn: string;
  detailedExplanationHi: string;
  cadreTalkingPointsEn: string[];
  cadreTalkingPointsHi: string[];
}

export type ParliamentaryHouse = 
  | 'constituent_assembly' 
  | 'lok_sabha' 
  | 'rajya_sabha' 
  | 'union_ministry' 
  | 'state_assembly'
  | 'myl_national'
  | 'myl_state_up';

export interface ParliamentaryLeader {
  id: string;
  nameEn: string;
  nameHi: string;
  house: ParliamentaryHouse;
  constituencyEn: string;
  constituencyHi: string;
  tenureYears: string;
  rolesEn: string[];
  rolesHi: string[];
  keyContributionsEn: string[];
  keyContributionsHi: string[];
  citationRecord: string; // Official Lok Sabha / Constituent Assembly archival reference
  photoUrl?: string; // Real archival photo or portrait URL
  isSitting?: boolean;
  badgeLabel?: { en: string; hi: string };
}

export interface IdeologyComparison {
  id: string;
  titleEn: string;
  titleHi: string;
  topicEn: string;
  topicHi: string;
  ourStanceEn: string;
  ourStanceHi: string;
  otherPartiesEn: string;
  otherPartiesHi: string;
  coalitionHistoryEn: string;
  coalitionHistoryHi: string;
}
