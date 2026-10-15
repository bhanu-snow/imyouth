import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PartyIntroMission } from './components/PartyIntroMission';
import { CadreWorkflowToolkit } from './components/CadreWorkflowToolkit';
import { FaqMythBuster } from './components/FaqMythBuster';
import { SocialBroadcastStudio } from './components/SocialBroadcastStudio';
import { MemberRegistration } from './components/MemberRegistration';
import { EventScheduler } from './components/EventScheduler';
import { LiveNewsFeed } from './components/LiveNewsFeed';
import { DistrictLeadershipTracker } from './components/DistrictLeadershipTracker';
import { CadreApprovalsQueue } from './components/CadreApprovalsQueue';
import { ParliamentaryHistoryView } from './components/ParliamentaryHistoryView';
import { LoginPage } from './components/LoginPage';
import { RoleManagementView } from './components/RoleManagementView';
import { OrganizationalStructureManager } from './components/OrganizationalStructureManager';
import { Language, NewsItem, PartyEvent, AuthUser, Member } from './types';
import { storageService, PUBLIC_USER } from './services/storageService';
import { authService } from './services/authService';
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

export default function App() {
  const [lang, setLang] = useState<Language>('hi'); // Default Hindi with English toggle
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preselectedNews, setPreselectedNews] = useState<NewsItem | null>(null);
  const [preselectedEvent, setPreselectedEvent] = useState<PartyEvent | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser>(PUBLIC_USER);

  useEffect(() => {
    let cancelled = false;
    void authService.restoreSession()
      .then((user) => { if (!cancelled && user) setCurrentUser(user); })
      .catch(() => { if (!cancelled) setCurrentUser(PUBLIC_USER); });
    return () => { cancelled = true; };
  }, []);
  const [members, setMembers] = useState<Member[]>(() => storageService.getMembers());

  const pendingCadresCount = members.filter((m) => m.status === 'pending').length;

  const refreshMembers = () => {
    setMembers(storageService.getMembers());
  };

  const handleUserChange = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleOpenSocialFromNews = (news: NewsItem) => {
    setPreselectedNews(news);
    setPreselectedEvent(null);
    setActiveTab('broadcast');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSocialFromEvent = (event: PartyEvent) => {
    setPreselectedEvent(event);
    setPreselectedNews(null);
    setActiveTab('broadcast');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        pendingCadresCount={pendingCadresCount}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              lang={lang}
              onNavigateToMembership={() => setActiveTab('membership')}
              onNavigateToBroadcast={() => setActiveTab('broadcast')}
              onNavigateToWorkflow={() => setActiveTab('workflow')}
              onNavigateToFaq={() => setActiveTab('faq')}
            />

            {/* Comprehensive Quick Action Cards Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('workflow')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'कार्यकर्ता फील्ड वर्कफ़्लो' : 'Cadre Outreach Workflow'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? '60-सेकंड पिच, 4 विंग्स व ऑन-ग्राउंड स्टेप्स' : 'Step-by-step introduction & cadre field guide'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('approvals')}
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
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('parliamentary')}
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
                  onClick={() => setActiveTab('faq')}
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
                  onClick={() => setActiveTab('broadcast')}
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
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('membership')}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-blue-700 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>{lang === 'hi' ? 'डिजिटल सदस्यता पहचान पत्र' : 'Digital Membership Card'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 transition-colors" />
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {lang === 'hi' ? 'दलित+अल्पसंख्यक सर्वसमाज हेतु संतुलित आईडी कार्ड' : 'Balanced Blue & Green card for all communities'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('districts')}
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
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
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
              onNavigateToMembership={() => setActiveTab('membership')}
              onNavigateToBroadcast={() => setActiveTab('broadcast')}
              onNavigateToWorkflow={() => setActiveTab('workflow')}
              onNavigateToFaq={() => setActiveTab('faq')}
            />
          </div>
        )}

        {activeTab === 'workflow' && (
          <CadreWorkflowToolkit
            lang={lang}
            onNavigateToMembership={() => setActiveTab('membership')}
            onNavigateToBroadcast={() => setActiveTab('broadcast')}
          />
        )}

        {activeTab === 'approvals' && (
          <CadreApprovalsQueue
            lang={lang}
            currentUser={currentUser}
            onRefreshMembers={refreshMembers}
          />
        )}

        {activeTab === 'parliamentary' && (
          <ParliamentaryHistoryView 
            lang={lang} 
            currentUser={currentUser} 
          />
        )}

        {activeTab === 'faq' && (
          <FaqMythBuster 
            lang={lang} 
            currentUser={currentUser} 
          />
        )}

        {activeTab === 'structure' && (
          <OrganizationalStructureManager
            lang={lang}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'broadcast' && (
          <SocialBroadcastStudio
            lang={lang}
            preselectedNews={preselectedNews}
            preselectedEvent={preselectedEvent}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            lang={lang}
            onLoginSuccess={(user) => {
              handleUserChange(user);
              setActiveTab('role-management');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'role-management' && (
          <RoleManagementView
            lang={lang}
            currentUser={currentUser}
            onUserUpdated={refreshMembers}
            onNavigateToStructure={() => setActiveTab('structure')}
            onNavigateLogin={() => {
              setActiveTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'membership' && (
          <MemberRegistration 
            lang={lang} 
            currentUser={currentUser} 
            onMemberRegistered={refreshMembers}
          />
        )}

        {activeTab === 'districts' && (
          <DistrictLeadershipTracker 
            lang={lang} 
            currentUser={currentUser} 
          />
        )}

        {activeTab === 'events' && (
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
                onClick={() => setActiveTab('workflow')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'फील्ड वर्कफ़्लो' : 'Cadre Workflow'}
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'सत्यापन व अनुमोदन' : 'Approvals Desk'}
              </button>
              <button
                onClick={() => setActiveTab('parliamentary')}
                className="hover:text-blue-900 transition-colors"
              >
                {lang === 'hi' ? 'संसदीय साक्ष्य' : 'Parliamentary Records'}
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'तथ्य बनाम भ्रम (FAQ)' : 'FAQ & Myths'}
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'सोशल स्टूडियो' : 'Social Studio'}
              </button>
              <button
                onClick={() => setActiveTab('membership')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'सदस्यता' : 'Membership'}
              </button>
              <button
                onClick={() => setActiveTab('districts')}
                className="hover:text-emerald-800 transition-colors"
              >
                {lang === 'hi' ? 'यूपी ज़िले' : 'UP Districts'}
              </button>
              {(currentUser.role === 'superadmin' || currentUser.role === 'state_president') && (
                <button
                  onClick={() => setActiveTab('structure')}
                  className="hover:text-emerald-800 transition-colors font-bold text-emerald-800"
                >
                  {lang === 'hi' ? 'विंग्स व पद CRUD' : 'Wings & Posts CRUD'}
                </button>
              )}
              {currentUser.role !== 'public' ? (
                <button
                  onClick={() => setActiveTab('role-management')}
                  className="hover:text-emerald-800 transition-colors font-bold text-stone-900"
                >
                  {lang === 'hi' ? 'भूमिका प्रबंधन' : 'Role Management'}
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('login')}
                  className="hover:text-emerald-800 transition-colors font-semibold text-emerald-700"
                >
                  {lang === 'hi' ? 'पासवर्ड लॉगिन' : 'Password Login'}
                </button>
              )}
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
