import React, { useState } from 'react';
import { Menu, X, Globe, Lock, Settings } from 'lucide-react';
import { Language, AuthUser } from '../types';
import { AuthRoleSwitcher } from './AuthRoleSwitcher';
import { LadderSymbolIcon } from './PartySymbol';

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AuthUser;
  onUserChange: (user: AuthUser) => void;
  pendingCadresCount: number;
}

export const Navbar: React.FC<Props> = ({ 
  lang, 
  onLanguageChange, 
  activeTab, 
  onTabChange,
  currentUser,
  onUserChange,
  pendingCadresCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = currentUser.role !== 'public';
  const isSuperOrPresident = currentUser.role === 'superadmin' || currentUser.role === 'state_president';
  const canApprove = ['superadmin', 'state_president', 'state_admin', 'district_incharge'].includes(currentUser.role);

  interface NavLinkItem {
    key: string;
    label: { en: string; hi: string };
    badge?: number;
  }

  // Requirement 4: Public pages menus should be visible to everyone; private ones ONLY for appropriate roles.
  const publicNavLinks: NavLinkItem[] = [
    { key: 'home', label: { en: 'Home', hi: 'मुख्य' } },
    { key: 'parliamentary', label: { en: 'Leaders & Evidence', hi: 'संसदीय साक्ष्य' } },
    { key: 'faq', label: { en: 'Myths & Facts (FAQ)', hi: 'तथ्य व भ्रम (FAQ)' } },
    { key: 'districts', label: { en: 'UP Districts', hi: 'यूपी ज़िले' } },
    { key: 'events', label: { en: 'Events & Press', hi: 'कार्यक्रम व प्रेस' } },
    { key: 'membership', label: { en: 'Membership Request', hi: 'सदस्यता' } },
  ];

  const privateNavLinks: NavLinkItem[] = [
    ...(isLoggedIn ? [
      { key: 'workflow', label: { en: 'Cadre Workflow', hi: 'कार्यकर्ता वर्कफ़्लो' } },
      { key: 'broadcast', label: { en: 'Social Studio', hi: 'सोशल स्टूडियो' } },
    ] : []),
    ...(canApprove ? [
      { key: 'approvals', label: { en: 'Approvals & Verify', hi: 'सत्यापन व अनुमोदन' }, badge: pendingCadresCount },
    ] : []),
    ...(isSuperOrPresident ? [
      { key: 'structure', label: { en: 'Wings & Posts CRUD', hi: 'विंग्स व पद CRUD' } },
    ] : []),
    ...(isLoggedIn ? [
      { key: 'role-management', label: { en: 'Role Management', hi: 'भूमिका प्रबंधन' } },
    ] : []),
  ];

  const allVisibleLinks = [...publicNavLinks, ...privateNavLinks];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand wordmark with Official Ladder Symbol */}
        <button
          onClick={() => onTabChange('home')}
          className="text-sm sm:text-base md:text-lg font-black tracking-tight text-emerald-950 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors flex items-center gap-2 sm:gap-2.5 cursor-pointer"
        >
          <div className="p-1 sm:p-1.5 bg-emerald-100/70 border border-emerald-300 rounded-lg shadow-xs flex items-center justify-center">
            <LadderSymbolIcon size={18} />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span>MYL UP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-stone-700 text-xs sm:text-sm font-bold">मुस्लिम यूथ लीग</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold text-blue-900 tracking-wider uppercase">
              Indian Union Muslim League
            </span>
          </div>
        </button>

        {/* Zone 2: Responsive Desktop Nav links (visible on lg screens and up) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-semibold text-stone-600 overflow-x-auto py-1 scrollbar-none">
          {allVisibleLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => onTabChange(link.key)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 rounded-lg hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer ${
                activeTab === link.key
                  ? 'text-emerald-800 font-extrabold bg-emerald-50 border-b-2 border-emerald-700'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{link.label[lang]}</span>
              {link.badge && link.badge > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {link.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Zone 3: Auth Role Switcher + Language Selector + Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Post-login Role Management quick shortcut (if logged in on tablet/desktop) */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onTabChange('role-management')}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'role-management'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="Role & Permissions Management Desk"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden xl:inline">{lang === 'hi' ? 'भूमिका डेस्क' : 'Roles'}</span>
            </button>
          )}

          {/* Auth & Role Switcher */}
          <AuthRoleSwitcher
            currentUser={currentUser}
            onUserChange={onUserChange}
            lang={lang}
            onNavigateLogin={() => onTabChange('login')}
            onNavigateRoleManagement={() => onTabChange('role-management')}
          />

          {/* Bilingual Toggle Button */}
          <button
            onClick={() => onLanguageChange(lang === 'en' ? 'hi' : 'en')}
            className="px-2 sm:px-2.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Switch Language (भाषा बदलें)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] sm:text-xs">{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Mobile hamburger - visible on < lg screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none cursor-pointer rounded-lg hover:bg-stone-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (visible on < lg screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in max-h-[85vh] overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
            {lang === 'hi' ? 'नेविगेशन मेनू' : 'Main Menu'}
          </div>
          {allVisibleLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                onTabChange(link.key);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === link.key
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{link.label[lang]}</span>
              {link.badge && link.badge > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {link.badge} pending
                </span>
              ) : null}
            </button>
          ))}

          {!isLoggedIn && (
            <div className="pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onTabChange('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'पदाधिकारी / कैडर लॉगिन' : 'Officer / Cadre Login'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
