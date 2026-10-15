import React, { useState } from 'react';
import { Menu, X, Globe, UserCheck, Compass, ShieldCheck, Scale, Lock, Settings } from 'lucide-react';
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

  const navLinks = [
    { key: 'home', label: { en: 'Home', hi: 'मुख्य' } },
    { key: 'workflow', label: { en: 'Cadre Workflow', hi: 'कार्यकर्ता वर्कफ़्लो' } },
    { key: 'approvals', label: { en: 'Approvals & Verify', hi: 'सत्यापन व अनुमोदन' }, badge: pendingCadresCount },
    { key: 'parliamentary', label: { en: 'Leaders & Evidence', hi: 'संसदीय साक्ष्य व नेतृत्व' } },
    { key: 'faq', label: { en: 'Myths & Facts (FAQ)', hi: 'मिथक व तथ्य (FAQ)' } },
    { key: 'broadcast', label: { en: 'Social Studio', hi: 'सोशल स्टूडियो' } },
    { key: 'membership', label: { en: 'Membership Request', hi: 'सदस्यता आवेदन' } },
    { key: 'districts', label: { en: 'UP Districts', hi: 'यूपी ज़िले' } },
    { key: 'events', label: { en: 'Events & News', hi: 'कार्यक्रम व प्रेस' } },
    ...(currentUser.role === 'superadmin' || currentUser.role === 'state_president' ? [
      { key: 'structure', label: { en: 'Wings & Posts CRUD', hi: 'विंग्स व पद CRUD' } }
    ] : []),
    ...(isLoggedIn ? [
      { key: 'role-management', label: { en: 'Role Management', hi: 'भूमिका प्रबंधन' } }
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark with Official Ladder Symbol */}
        <button
          onClick={() => onTabChange('home')}
          className="text-base sm:text-lg font-black tracking-tight text-emerald-950 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors flex items-center gap-2.5 cursor-pointer"
        >
          <div className="p-1.5 bg-emerald-100/70 border border-emerald-300 rounded-lg shadow-xs flex items-center justify-center">
            <LadderSymbolIcon size={20} />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span>MYL UP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-stone-700 text-xs sm:text-sm font-bold">मुस्लिम यूथ लीग</span>
            </div>
            <span className="text-[9px] font-bold text-blue-900 tracking-wider uppercase">
              Indian Union Muslim League
            </span>
          </div>
        </button>

        {/* Zone 2: Nav links */}
        <nav className="hidden 2xl:flex items-center gap-3.5 text-xs font-semibold text-stone-600">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => onTabChange(link.key)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer ${
                activeTab === link.key
                  ? 'text-emerald-800 font-extrabold border-b-2 border-emerald-700'
                  : 'text-stone-600'
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

        {/* Zone 3: Auth Role Switcher + Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Post-login Role Management quick shortcut (if logged in on tablet/desktop) */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onTabChange('role-management')}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'role-management'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="Role & Permissions Management Desk"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">{lang === 'hi' ? 'भूमिका डेस्क' : 'Roles'}</span>
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
            className="px-2.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Switch Language (भाषा बदलें)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="2xl:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in max-h-[85vh] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                onTabChange(link.key);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                activeTab === link.key
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{link.label[lang]}</span>
              {link.badge && link.badge > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {link.badge} pending
                </span>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
