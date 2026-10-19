import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PartyIntroMission } from './components/PartyIntroMission';
import type { Language, NewsItem, PartyEvent, AuthUser, Member } from './types';
import { PUBLIC_USER } from './services/storageService';
import { authService } from './services/authService';
import { memberService } from './services/memberService';
import { PublicCardAccess } from './components/PublicCardAccess';
import { 
  Compass, 
  BookOpen, 
  Share2, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Landmark,
  Scale
} from 'lucide-react';

const CadreWorkflowToolkit = lazy(() => import('./components/CadreWorkflowToolkit').then((module) => ({ default: module.CadreWorkflowToolkit })));
const FaqMythBuster = lazy(() => import('./components/FaqMythBuster').then((module) => ({ default: module.FaqMythBuster })));
const SocialBroadcastStudio = lazy(() => import('./components/SocialBroadcastStudio').then((module) => ({ default: module.SocialBroadcastStudio })));
const MemberRegistration = lazy(() => import('./components/MemberRegistration').then((module) => ({ default: module.MemberRegistration })));
const EventScheduler = lazy(() => import('./components/EventScheduler').then((module) => ({ default: module.EventScheduler })));
const LiveNewsFeed = lazy(() => import('./components/LiveNewsFeed').then((module) => ({ default: module.LiveNewsFeed })));
const SangathanPage = lazy(() => import('./components/SangathanPage').then((module) => ({ default: module.SangathanPage })));
const CadreApprovalsQueue = lazy(() => import('./components/CadreApprovalsQueue').then((module) => ({ default: module.CadreApprovalsQueue })));
const ParliamentaryHistoryView = lazy(() => import('./components/ParliamentaryHistoryView').then((module) => ({ default: module.ParliamentaryHistoryView })));
const LoginPage = lazy(() => import('./components/LoginPage').then((module) => ({ default: module.LoginPage })));
const RoleManagementView = lazy(() => import('./components/RoleManagementView').then((module) => ({ default: module.RoleManagementView })));
const OrganizationalStructureManager = lazy(() => import('./components/OrganizationalStructureManager').then((module) => ({ default: module.OrganizationalStructureManager })));
const OrganizationAdminDesk = lazy(() => import('./components/OrganizationAdminDesk').then((module) => ({ default: module.OrganizationAdminDesk })));

const PUBLIC_TABS = new Set(['home', 'parliamentary', 'faq', 'events', 'membership', 'verification', 'download-card', 'login', 'workflow']);
const REVIEW_ROLES = new Set(['superadmin', 'state_admin', 'district_incharge']);
const canAccessTab = (tab: string, role: AuthUser['role']) => {
  if (role === 'public') return PUBLIC_TABS.has(tab);
  if (['home', 'parliamentary', 'faq', 'events', 'membership', 'verification', 'download-card', 'login', 'workflow', 'districts', 'broadcast'].includes(tab)) return true;
  if (tab === 'approvals' || tab === 'organization-admin') return REVIEW_ROLES.has(role);
  if (tab === 'structure') return ['superadmin', 'state_admin'].includes(role);
  return tab === 'role-management' && role === 'superadmin';
};

export default function App() {
  const [lang, setLang] = useState<Language>('hi'); // Default Hindi with English toggle
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preselectedNews, setPreselectedNews] = useState<NewsItem | null>(null);
  const [preselectedEvent, setPreselectedEvent] = useState<PartyEvent | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser>(PUBLIC_USER);
  const [openMembershipRequestForm, setOpenMembershipRequestForm] = useState(false);
  const [memberRefreshError, setMemberRefreshError] = useState('');

  useEffect(() => {
    let cancelled = false;
    void authService.restoreSession()
      .then((user) => { if (!cancelled && user) setCurrentUser(user); })
      .catch(() => { if (!cancelled) setCurrentUser(PUBLIC_USER); });
    return () => { cancelled = true; };
  }, []);
  const [members, setMembers] = useState<Member[]>([]);

  const pendingCadresCount = members.filter((m) => m.status === 'pending').length;

  const refreshMembers = async () => {
    if (!REVIEW_ROLES.has(currentUser.role)) {
      setMembers([]);
      setMemberRefreshError('');
      return;
    }
    try {
      setMembers(await memberService.listForAuthorizedUser());
      setMemberRefreshError('');
    } catch (error) {
      setMembers([]);
      setMemberRefreshError(error instanceof Error ? error.message : 'Could not refresh member applications.');
    }
  };

  useEffect(() => {
    void refreshMembers();
  }, [currentUser.id, currentUser.role]);

  useEffect(() => {
    if (!canAccessTab(activeTab, currentUser.role)) setActiveTab('home');
  }, [activeTab, currentUser.role]);

  const navigateToTab = (tab: string) => {
    if (!canAccessTab(tab, currentUser.role)) {
      setActiveTab('login');
    } else {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigateToMembershipRequest = () => {
    setOpenMembershipRequestForm(true);
    navigateToTab('membership');
  };
  const visibleTab = canAccessTab(activeTab, currentUser.role) ? activeTab : 'home';

  const handleUserChange = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleOpenSocialFromNews = (news: NewsItem) => {
    setPreselectedNews(news);
    setPreselectedEvent(null);
    navigateToTab('broadcast');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSocialFromEvent = (event: PartyEvent) => {
    setPreselectedEvent(event);
    setPreselectedNews(null);
    navigateToTab('broadcast');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        activeTab={visibleTab}
        onTabChange={navigateToTab}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-stone-500">{lang === 'hi' ? 'पृष्ठ लोड हो रहा है…' : 'Loading page…'}</div>}>
        {visibleTab === 'home' && (
          <div>
            <HeroSection
              lang={lang}
              isLoggedIn={currentUser.role !== 'public'}
              onNavigateToMembership={() => navigateToTab('membership')}
              onNavigateToBroadcast={() => navigateToTab('broadcast')}
              onNavigateToWorkflow={() => navigateToTab('workflow')}
              onNavigateToFaq={() => navigateToTab('faq')}
            />

            {/* Comprehensive Quick Action Cards Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {REVIEW_ROLES.has(currentUser.role) && <button
                  type="button"
                  onClick={() => navigateToTab('approvals')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all text-left group cursor-pointer relative"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  {pendingCadresCount > 0 && (
                    <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                      {pendingCadresCount} pending
                    </span>
                  )}
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'कैडर अनुमोदन व सार्वजनिक सत्यापन' : 'Approvals & Public Verify'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'लंबित आवेदन समीक्षा, अनुमोदन व QR टोकन सत्यापन' : 'Pending requests queue & public token verification'}
                  </p>
                </button>}

                <button
                  type="button"
                  onClick={() => navigateToTab('parliamentary')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-blue-900 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'संसदीय साक्ष्य व विचारधारा' : 'Parliamentary Evidence & Founders'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-900 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'संविधान सभा, लोकसभा व राज्यसभा में दस्तावेजी रिकॉर्ड' : 'Constituent Assembly Hansard & ideological comparison'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigateToTab('faq')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-blue-700 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'भ्रम व तथ्य (FAQ)' : 'Myths vs Facts (FAQ)'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? '1948 इतिहास, धर्मनिरपेक्षता व यूपी में भूमिका' : 'Debunking propaganda with constitutional facts'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigateToTab('workflow')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'कैडर वर्कफ़्लो' : 'Cadre Workflow'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'परिचय, सार्वजनिक रिकॉर्ड, FAQ और सदस्यता अनुरोध' : 'Introduction, public records, FAQs & membership requests'}
                  </p>
                </button>

                {currentUser.role !== 'public' && <button
                  type="button"
                  onClick={() => navigateToTab('broadcast')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'सोशल मीडिया स्टूडियो' : 'Social Broadcast Studio'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'व्हाट्सएप, टेलीग्राम, एक्स व इंस्टाग्राम पोस्टर 1 क्लिक' : '1-action broadcast & green/blue Instagram card'}
                  </p>
                </button>}

                <button
                  type="button"
                  onClick={() => navigateToTab('download-card')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-blue-700 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'सदस्य कार्ड सत्यापन व डाउनलोड' : 'Verify & Download Member Card'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'सत्यापित सदस्य की आईडी जांचें और कार्ड डाउनलोड करें' : 'Verify a member ID and download the approved card'}
                  </p>
                </button>

                {currentUser.role !== 'public' && <button
                  type="button"
                  onClick={() => navigateToTab('districts')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-blue-900 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'यूपी ज़िला नेतृत्व व कार्यकाल' : 'UP District Units & Tenures'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-900 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'ज़िला व तहसील वार पदाधिकारी कार्यकाल रिकॉर्ड' : 'District leadership timelines & office-bearer history'}
                  </p>
                </button>}

                <button
                  type="button"
                  onClick={() => navigateToTab('events')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'रैलियां, सभाएं व प्रेस बुलेटिन' : 'Rallies, Events & Press Feed'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'कार्यकर्ताओं हेतु इवेंट शेड्यूलिंग व प्रेस अपडेट' : 'RSVP event manager & live official news updates'}
                  </p>
                </button>
              </div>
            </div>

            {/* Ideological & Constitutional Mission */}
            <PartyIntroMission
              lang={lang}
              isLoggedIn={currentUser.role !== 'public'}
              onNavigateToMembership={() => navigateToTab('membership')}
              onNavigateToWorkflow={() => navigateToTab('workflow')}
              onNavigateToFaq={() => navigateToTab('faq')}
            />
          </div>
        )}

        {visibleTab === 'workflow' && (
          <CadreWorkflowToolkit
            lang={lang}
            isLoggedIn={currentUser.role !== 'public'}
            onNavigateToMembership={navigateToMembershipRequest}
            onNavigateToBroadcast={() => navigateToTab('broadcast')}
            onNavigateToEvidence={() => navigateToTab('parliamentary')}
          />
        )}

        {visibleTab === 'approvals' && REVIEW_ROLES.has(currentUser.role) && (
          <CadreApprovalsQueue
            lang={lang}
            currentUser={currentUser}
            onRefreshMembers={refreshMembers}
          />
        )}

        {visibleTab === 'parliamentary' && (
          <ParliamentaryHistoryView 
            lang={lang} 
            currentUser={currentUser} 
          />
        )}

        {visibleTab === 'faq' && (
          <FaqMythBuster 
            lang={lang} 
            currentUser={currentUser} 
          />
        )}

        {visibleTab === 'structure' && ['superadmin', 'state_admin'].includes(currentUser.role) && (
          <OrganizationalStructureManager
            lang={lang}
            currentUser={currentUser}
          />
        )}

        {visibleTab === 'broadcast' && currentUser.role !== 'public' && (
          <SocialBroadcastStudio
            lang={lang}
            preselectedNews={preselectedNews}
            preselectedEvent={preselectedEvent}
          />
        )}

        {visibleTab === 'login' && (
          <LoginPage
            lang={lang}
            onLoginSuccess={(user) => {
              handleUserChange(user);
              setActiveTab(user.role === 'superadmin' ? 'role-management' : REVIEW_ROLES.has(user.role) ? 'approvals' : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {visibleTab === 'role-management' && currentUser.role === 'superadmin' && (
          <RoleManagementView
            lang={lang}
            currentUser={currentUser}
            onUserUpdated={refreshMembers}
            onNavigateToStructure={() => navigateToTab('structure')}
            onNavigateLogin={() => {
              navigateToTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {visibleTab === 'membership' && (
          <MemberRegistration 
            lang={lang} 
            currentUser={currentUser} 
            onMemberRegistered={refreshMembers}
            openRequestForm={openMembershipRequestForm}
            onRequestFormOpened={() => setOpenMembershipRequestForm(false)}
          />
        )}

        {visibleTab === 'districts' && currentUser.role !== 'public' && (
          <SangathanPage lang={lang} currentUser={currentUser} />
        )}

        {visibleTab === 'events' && (
          <div className="space-y-12">
            <EventScheduler
              lang={lang}
              currentUser={currentUser}
              onOpenSocialBroadcast={handleOpenSocialFromEvent}
            />
            <div className="border-t border-stone-200 pt-8">
              <LiveNewsFeed
                lang={lang}
                currentUser={currentUser}
                onOpenSocialBroadcast={handleOpenSocialFromNews}
              />
            </div>
          </div>
        )}
        {visibleTab === 'verification' && <PublicCardAccess lang={lang} mode="verification" />}
        {visibleTab === 'download-card' && <PublicCardAccess lang={lang} mode="download" />}
        {visibleTab === 'organization-admin' && REVIEW_ROLES.has(currentUser.role) && (
          <OrganizationAdminDesk lang={lang} currentUser={currentUser} />
        )}
        {memberRefreshError && REVIEW_ROLES.has(currentUser.role) && (
          <div role="alert" className="mx-auto mt-4 max-w-5xl rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {memberRefreshError}
          </div>
        )}
        </Suspense>
      </main>

      {/* Official Footer with Codesquare.co.in and Kerala links */}
      <footer className="bg-white border-t border-stone-200 mt-16 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-emerald-950">MUSLIM YOUTH LEAGUE (MYL)</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-700">{lang === 'hi' ? 'उत्तर प्रदेश राज्य समिति' : 'Uttar Pradesh State Committee'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-900 font-semibold">दलित, अल्पसंख्यक एवं सर्वसमाज एकता</span>
            </div>

            {/* Official Kerala Portal Live Link */}
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="text-stone-500 font-medium">Daily Updates:</span>
              <a
                href="https://www.iumlkerala.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 hover:text-emerald-950 font-black underline underline-offset-2 inline-flex items-center gap-1"
              >
                <span>IUML Kerala Official (iumlkerala.org)</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateToTab('parliamentary')}
                className="hover:text-blue-900 transition-colors"
              >
                {lang === 'hi' ? 'संसदीय साक्ष्य' : 'Parliamentary Records'}
              </button>
              <button
                onClick={() => navigateToTab('faq')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'तथ्य बनाम भ्रम (FAQ)' : 'FAQ & Myths'}
              </button>
              <button
                onClick={() => navigateToTab('membership')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'सदस्यता' : 'Membership'}
              </button>
              <button onClick={() => navigateToTab('verification')} className="hover:text-emerald-800 transition-colors">
                {lang === 'hi' ? 'सदस्य सत्यापन' : 'Member Verification'}
              </button>
              <button onClick={() => navigateToTab('download-card')} className="hover:text-emerald-800 transition-colors">
                {lang === 'hi' ? 'कार्ड डाउनलोड' : 'Download Card'}
              </button>
              {currentUser.role !== 'public' && (
                <>
                  <button onClick={() => navigateToTab('workflow')} className="hover:text-emerald-800 transition-colors">
                    {lang === 'hi' ? 'फील्ड वर्कफ़्लो' : 'Cadre Workflow'}
                  </button>
                  <button onClick={() => navigateToTab('districts')} className="hover:text-emerald-800 transition-colors">
                    {lang === 'hi' ? 'संगठन' : 'Sangathan'}
                  </button>
                  <button onClick={() => navigateToTab('broadcast')} className="hover:text-emerald-800 transition-colors">
                    {lang === 'hi' ? 'सोशल स्टूडियो' : 'Social Studio'}
                  </button>
                </>
              )}
              {REVIEW_ROLES.has(currentUser.role) && (
                <>
                  <button onClick={() => navigateToTab('approvals')} className="hover:text-emerald-800 transition-colors">
                    {lang === 'hi' ? 'सत्यापन व अनुमोदन' : 'Approvals Desk'}
                  </button>
                  <button onClick={() => navigateToTab('organization-admin')} className="hover:text-emerald-800 transition-colors">
                    {lang === 'hi' ? 'सदस्यता व समितियां' : 'Membership & Committees'}
                  </button>
                </>
              )}
              {['superadmin', 'state_admin'].includes(currentUser.role) && (
                <button
                  onClick={() => navigateToTab('structure')}
                  className="hover:text-emerald-800 transition-colors font-bold text-emerald-800"
                >
                  {lang === 'hi' ? 'विंग्स व पद CRUD' : 'Wings & Posts CRUD'}
                </button>
              )}
              {currentUser.role === 'superadmin' ? (
                <button
                  onClick={() => navigateToTab('role-management')}
                  className="hover:text-emerald-800 transition-colors font-bold text-stone-900"
                >
                  {lang === 'hi' ? 'भूमिका प्रबंधन' : 'Role Management'}
                </button>
              ) : currentUser.role === 'public' ? (
                <>
                  <button
                    onClick={() => navigateToTab('login')}
                    className="hover:text-emerald-800 transition-colors font-semibold text-emerald-700"
                  >
                    {lang === 'hi' ? 'पासवर्ड लॉगिन' : 'Password Login'}
                  </button>
                </>
              ) : null}
            </div>

            {/* Created by Codesquare.co.in with Backlink */}
            <div className="flex items-center gap-3 text-[11px] text-stone-500">
              <span>
                Created by{' '}
                <a
                  href="https://codesquare.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-stone-900 hover:text-emerald-700 underline underline-offset-2 transition-colors"
                >
                  Codesquare.co.in
                </a>
              </span>
              <span aria-hidden="true">·</span>
              <span>© {new Date().getFullYear()} Muslim Youth League (MYL) UP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
