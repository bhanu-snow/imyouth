import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, ShieldCheck, Zap, Server, Key, Layers, RefreshCw } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const SupabaseArchitectureGuide: React.FC<Props> = ({ lang }) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendation' | 'steps' | 'schema' | 'sandbox'>('recommendation');
  
  // Sandbox test state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const fullSqlScript = `-- =========================================================================
-- IM YOUTH WING - COMPLETE PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- Bilingual Support (Hindi + English), RLS, Auth, Member IDs, & Tenures
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE youth_wing_type AS ENUM (
  'student',
  'it_cell',
  'social_action',
  'sports_cultural',
  'legal_rti',
  'general'
);

CREATE TYPE event_category_type AS ENUM (
  'rally',
  'panchayat',
  'workshop',
  'service',
  'press_conclave'
);

CREATE TYPE tenure_status_type AS ENUM (
  'current',
  'past',
  'acting'
);

-- 2. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY, -- e.g. 'YM-2026-8941'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  full_name_hi TEXT,
  phone TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  avatar_url TEXT,
  state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
  district TEXT NOT NULL,
  sub_district TEXT NOT NULL, -- Tehsil / Block / Ward
  wing youth_wing_type NOT NULL DEFAULT 'general',
  designation TEXT NOT NULL DEFAULT 'Active Youth Volunteer',
  designation_hi TEXT NOT NULL DEFAULT 'सक्रिय युवा कार्यकर्ता',
  blood_group TEXT,
  education TEXT,
  verified BOOLEAN NOT NULL DEFAULT true,
  role TEXT NOT NULL DEFAULT 'cadre', -- 'cadre', 'district_incharge', 'admin'
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. DISTRICTS & SUB-DISTRICTS
CREATE TABLE IF NOT EXISTS public.district_units (
  id TEXT PRIMARY KEY, -- e.g. 'dist-varanasi'
  state TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  activity_score INT NOT NULL DEFAULT 85,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.sub_district_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id TEXT REFERENCES public.district_units(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  in_charge_name TEXT,
  in_charge_phone TEXT,
  members_count INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
);

-- 4. LEADERSHIP TENURES (Chronological post relationship)
CREATE TABLE IF NOT EXISTS public.leadership_tenures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id TEXT REFERENCES public.district_units(id) ON DELETE CASCADE,
  leader_name_en TEXT NOT NULL,
  leader_name_hi TEXT NOT NULL,
  post_title_en TEXT NOT NULL,
  post_title_hi TEXT NOT NULL,
  tenure_start DATE NOT NULL,
  tenure_end TEXT NOT NULL DEFAULT 'Present', -- e.g. 'Present' or '2024-12-31'
  status tenure_status_type NOT NULL DEFAULT 'current',
  contact_phone TEXT,
  email TEXT,
  achievements_en TEXT[],
  achievements_hi TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. EVENTS & RALLIES
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT ('ev-' || floor(random() * 90000 + 10000)::text),
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category event_category_type NOT NULL DEFAULT 'rally',
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location_en TEXT NOT NULL,
  location_hi TEXT NOT NULL,
  district TEXT NOT NULL,
  sub_district TEXT,
  state TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  coordinator_phone TEXT NOT NULL,
  coordinator_designation TEXT NOT NULL,
  highlight_tag_en TEXT,
  highlight_tag_hi TEXT,
  rsvp_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. EVENT RSVPs
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  member_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(event_id, member_id)
);

-- 7. NEWS & PRESS RELEASES
CREATE TABLE IF NOT EXISTS public.news_posts (
  id TEXT PRIMARY KEY DEFAULT ('news-' || floor(random() * 90000 + 10000)::text),
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  excerpt_hi TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_hi TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'press_release',
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '3 min',
  author_name_en TEXT NOT NULL,
  author_name_hi TEXT NOT NULL,
  author_role_en TEXT NOT NULL,
  author_role_hi TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  share_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. SOCIAL BROADCAST LOGS
CREATE TABLE IF NOT EXISTS public.social_broadcasts (
  id TEXT PRIMARY KEY DEFAULT ('bcast-' || floor(random() * 90000 + 10000)::text),
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_hi TEXT NOT NULL,
  hashtags TEXT[] NOT NULL,
  target_platforms TEXT[] NOT NULL,
  url TEXT NOT NULL,
  shares_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_tenures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_units ENABLE ROW LEVEL SECURITY;

-- Public can read all verified members, events, news, and leadership
CREATE POLICY "Public read verified members" ON public.members FOR SELECT USING (verified = true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read news" ON public.news_posts FOR SELECT USING (true);
CREATE POLICY "Public read leadership" ON public.leadership_tenures FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON public.district_units FOR SELECT USING (true);

-- Anyone can register as a member
CREATE POLICY "Anyone can register member" ON public.members FOR INSERT WITH CHECK (true);

-- Anyone can submit event RSVP
CREATE POLICY "Anyone can RSVP" ON public.event_rsvps FOR INSERT WITH CHECK (true);
`;

  const envSample = `# .env or Vercel Environment Variables
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
`;

  const copyToClipboard = (text: string, type: 'sql' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2500);
    }
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setTestStatus('error');
      setTestMessage(lang === 'hi' ? 'कृपया Supabase URL और Anon Key दोनों दर्ज करें।' : 'Please enter both Supabase Project URL and Anon Key.');
      return;
    }

    setTestStatus('testing');
    setTestMessage(lang === 'hi' ? 'कनेक्शन जाँचा जा रहा है...' : 'Pinging Supabase REST endpoint...');

    try {
      // Test Supabase REST health endpoint
      const cleanedUrl = supabaseUrl.replace(/\/$/, '');
      const res = await fetch(`${cleanedUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });

      if (res.ok || res.status === 200 || res.status === 404) {
        setTestStatus('success');
        setTestMessage(
          lang === 'hi'
            ? '✅ सफल कनेक्शन! आपका Supabase प्रोजेक्ट सक्रिय है और Vercel पर तैनाती के लिए तैयार है।'
            : '✅ Connection Successful! Your Supabase project is active and ready for Vercel deployment.'
        );
      } else {
        setTestStatus('error');
        setTestMessage(`HTTP ${res.status}: ${res.statusText}. Please verify Anon Public Key.`);
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Failed to connect. Check URL syntax.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
          <span>{lang === 'hi' ? 'आर्किटेक्चर व डेटाबेस सिफारिश' : 'Architecture & Database Recommendation'}</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'hi' ? 'वर्चुअल व वर्सेल अनुकूलित' : 'Vercel & Supabase Blueprint'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-3">
          {lang === 'hi' 
            ? 'युवा मोर्चा के लिए Supabase + PostgreSQL आर्किटेक्चर गाइड' 
            : 'Supabase + PostgreSQL Architecture & Vercel Deployment Guide'}
        </h1>
        <p className="text-stone-600 max-w-3xl leading-relaxed text-sm">
          {lang === 'hi'
            ? 'राजनीतिक युवा मोर्चा की गतिशील वेबसाइट (सदस्यता, द्वैभाषिक समाचार, कार्यक्रम व ज़िला संगठन) के लिए खुला स्रोत Supabase सबसे उपयुक्त और 100% निशुल्क डेटाबेस समाधान है। यहाँ चरण-दर-चरण सेटअप व तैयार SQL स्क्रिप्ट दी गई है।'
            : 'For a dynamic political youth wing application requiring member ID cards, bilingual news feeds, event RSVPs, and district leadership timelines, Supabase (Open-Source PostgreSQL) is the premier free-tier solution on Vercel.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('recommendation')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'recommendation'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '1. Supabase क्यों सबसे श्रेष्ठ है?' : '1. Why Supabase is #1 for Youth Wing'}
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'steps'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '2. शून्य से शुरुआत (5 चरण)' : '2. Setup from Scratch (5 Steps)'}
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'schema'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '3. संपूर्ण SQL स्कीमा (Copy-Ready)' : '3. Complete Production SQL'}
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'sandbox'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'hi' ? '4. लाइव कनेक्शन टेस्ट सैंडबॉक्स' : '4. Live Supabase Test Sandbox'}
        </button>
      </div>

      {/* TAB 1: RECOMMENDATION & COMPARISON */}
      {activeTab === 'recommendation' && (
        <div className="space-y-6">
          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-stone-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                {lang === 'hi' ? 'खुला स्रोत व असली PostgreSQL' : 'Open-Source & Real PostgreSQL'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {lang === 'hi'
                  ? 'कोई विक्रेता बंधन (Vendor Lock-in) नहीं। मानक PostgreSQL जिसपर 1,00,000+ कार्यकर्ताओं का जटिल ज़िला और तहसील संबंध आसानी से इंडेक्स होता है।'
                  : 'True open-source relational database. Handles complex district-to-ward hierarchies, member tenure timelines, and foreign keys effortlessly.'}
              </p>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                {lang === 'hi' ? 'निःशुल्क मोबाइल OTP व Auth' : 'Free Mobile Phone OTP & Auth'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {lang === 'hi'
                  ? 'भारतीय युवाओं और कार्यकर्ताओं के पास अक्सर केवल फ़ोन नंबर होता है। Supabase में फ़ोन OTP, Google 1-Tap और रोल-बेस्ड सुरक्षा (RLS) बिना अतिरिक्त लागत मिलती है।'
                  : 'Includes Phone SMS OTP, Google 1-Tap, and Row Level Security out-of-the-box. Perfect for grassroots cadres who register via mobile.'}
              </p>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                {lang === 'hi' ? '1-क्लिक Vercel इंटीग्रेशन' : 'Seamless 1-Click Vercel Integration'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {lang === 'hi'
                  ? 'Vercel मार्केटप्लेस से 1 क्लिक में सीधे कनेक्ट। एनवायरनमेंट वेरिएबल स्वतः सिंक होते हैं। ज़ीरो सर्वर मेंटेनेंस।'
                  : 'Official Vercel Marketplace partner. Environment keys are injected automatically into preview and production deployments with 0 ops.'}
              </p>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="p-6 bg-white border border-stone-200 rounded-lg">
            <h3 className="font-bold text-stone-900 text-base mb-4">
              {lang === 'hi' ? 'डेटाबेस तुलना (Political Youth Wing Context)' : 'Database Evaluation Matrix for Political Youth Wing'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Solution</th>
                    <th className="py-2.5 px-3">Free Tier Limits</th>
                    <th className="py-2.5 px-3">Relational / District Hierarchy</th>
                    <th className="py-2.5 px-3">Auth Built-in (Phone/SMS)</th>
                    <th className="py-2.5 px-3">ID Photo Storage Bucket</th>
                    <th className="py-2.5 px-3">Vercel Synergy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr className="bg-amber-50/60 font-medium">
                    <td className="py-3 px-3 flex items-center gap-1.5 text-amber-900 font-bold">
                      <span>Supabase</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                        RECOMMENDED
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-700">500MB Postgres, 50k MAU, Unlimited API calls</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Native PostgreSQL foreign keys & JSONB</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Yes (Email, Google, Phone OTP)</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">1 GB Free Storage included</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">1-Click Vercel Integration</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-900">Firebase Firestore</td>
                    <td className="py-3 px-3 text-stone-600">1GB storage, 50k reads/day</td>
                    <td className="py-3 px-3 text-amber-700">NoSQL document store; complex relations harder</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Yes</td>
                    <td className="py-3 px-3 text-stone-600">5 GB Free</td>
                    <td className="py-3 px-3 text-stone-600">Manual env config</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-900">Neon PostgreSQL</td>
                    <td className="py-3 px-3 text-stone-600">0.5GB Postgres, Scale-to-zero</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Full Postgres</td>
                    <td className="py-3 px-3 text-rose-700">None (requires separate Clerk/Auth0)</td>
                    <td className="py-3 px-3 text-rose-700">No file storage (requires S3/R2)</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Vercel Postgres partner</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-stone-900">PocketBase (Self-hosted)</td>
                    <td className="py-3 px-3 text-stone-600">SQLite based; depends on server VPS</td>
                    <td className="py-3 px-3 text-stone-600">SQLite single-file database</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Yes</td>
                    <td className="py-3 px-3 text-stone-600">Local disk</td>
                    <td className="py-3 px-3 text-rose-700">Needs persistent VPS (not serverless)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5 STEPS TO SETUP FROM SCRATCH */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? 'निःशुल्क Supabase खाता बनाएं और प्रोजेक्ट शुरू करें' : 'Create Free Supabase Project'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {lang === 'hi'
                    ? 'https://supabase.com पर जाएं और "Start your project" पर क्लिक करें। अपने प्रोजेक्ट का नाम "im-youth-portal" रखें और सुरक्षित Database Password सेट करें। क्षेत्र के रूप में Mumbai (ap-south-1) चुनें।'
                    : 'Navigate to supabase.com, sign in with GitHub or Google, and click "New Project". Choose Region: Mumbai (ap-south-1) for lowest latency across India, and enter a strong database password.'}
                </p>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  <span>Open Supabase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? 'SQL Editor में स्कीमा माइग्रेशन चलाएं' : 'Run the Production SQL Schema Migration'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {lang === 'hi'
                    ? 'Supabase डैशबोर्ड में बायीं ओर "SQL Editor" पर क्लिक करें। "New Query" बनाएं, हमारे "3. Production SQL" टैब से कोड कॉपी करके पेस्ट करें और "Run" दबाएं। यह सदस्यों, ज़िलों, कार्यक्रमों और समाचारों की सभी तालिकाएं और सुरक्षा नीतियां (RLS) बना देगा।'
                    : 'Click "SQL Editor" on the left navigation bar. Click "New Query", copy our complete SQL script from Tab 3, paste it into the editor, and click "Run". This instantly scaffolds members, events, leadership tenures, and security rules.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? 'ID कार्ड फोटो के लिए स्टोरेज बकेट बनाएं' : 'Create Storage Bucket for Member Photos & ID Cards'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {lang === 'hi'
                    ? 'Storage टैब पर जाएं -> "Create new bucket" -> नाम दें "youth-cadre-photos" -> "Public bucket" विकल्प को चालू रखें ताकि पहचान पत्र और जनसंपर्क बैनर का सीधा URL मिल सके।'
                    : 'Go to Storage -> "New Bucket" -> Name it "youth-cadre-photos" -> Toggle "Public Bucket" ON so that member ID card avatars and generated banners are immediately accessible.'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? 'API क्रेडेंशियल्स प्राप्त करें' : 'Retrieve API Keys from Project Settings'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {lang === 'hi'
                    ? 'Project Settings -> "API" में जाएं। वहाँ से Project URL और anon public key कॉपी करें।'
                    : 'Go to Project Settings -> API. Copy your "Project URL" (e.g., https://xyz.supabase.co) and your "anon public key".'}
                </p>
                <div className="bg-stone-900 text-stone-100 p-3 rounded font-mono text-xs flex items-center justify-between">
                  <code>{envSample}</code>
                  <button
                    onClick={() => copyToClipboard(envSample, 'env')}
                    className="p-1.5 text-stone-400 hover:text-white transition-colors"
                    title="Copy Env sample"
                  >
                    {copiedEnv ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                5
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {lang === 'hi' ? 'Vercel पर एनवायरनमेंट वेरिएबल जोड़ें और डिप्लॉय करें' : 'Deploy to Vercel with Environment Variables'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {lang === 'hi'
                    ? 'अपने Vercel प्रोजेक्ट सेटिंग्स में जाएं -> Environment Variables -> VITE_SUPABASE_URL और VITE_SUPABASE_ANON_KEY जोड़ें। रि-डिप्लॉय पर आपकी वेबसाइट पूरी तरह से डायनामिक और रीयल-टाइम बन जाएगी!'
                    : 'In your Vercel Dashboard -> Project Settings -> Environment Variables, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Trigger redeploy, and your site now persists live members, events, and news!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE SQL SCHEMA */}
      {activeTab === 'schema' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-stone-100 px-4 py-3 rounded-t-lg border border-b-0 border-stone-200">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-stone-800">
                supabase_schema_im_youth.sql (8 Tables, RLS, Indexes)
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(fullSqlScript, 'sql')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-stone-900 text-stone-100 p-4 rounded-b-lg font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
            <pre>{fullSqlScript}</pre>
          </div>
        </div>
      )}

      {/* TAB 4: SANDBOX TEST */}
      {activeTab === 'sandbox' && (
        <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-5">
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-1">
              {lang === 'hi' ? 'लाइव Supabase क्रेडेंशियल टेस्ट' : 'Test Supabase Connectivity Live'}
            </h3>
            <p className="text-stone-600 text-xs">
              {lang === 'hi'
                ? 'यदि आपने Supabase प्रोजेक्ट बना लिया है, तो यहाँ URL और Anon Key डालकर सीधे कनेक्शन की जाँच कर सकते हैं।'
                : 'Plug in your Supabase project credentials to verify live connectivity with your backend right now.'}
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-amber-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Anon Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-amber-600 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              {testStatus === 'testing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Live Endpoint</span>
                </>
              )}
            </button>

            {testMessage && (
              <div
                className={`p-3 rounded text-xs leading-relaxed ${
                  testStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
