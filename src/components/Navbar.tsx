import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, Globe, Menu, X } from 'lucide-react';
import type { AuthUser, Language, MemberNotification } from '../types';
import { AuthRoleSwitcher } from './AuthRoleSwitcher';
import { LadderSymbolIcon } from './PartySymbol';
import { memberNotificationService } from '../services/memberNotificationService';

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AuthUser;
  onUserChange: (user: AuthUser) => void;
}

interface NavLinkItem {
  key: string;
  label: { en: string; hi: string };
  badge?: number;
}

interface NavGroup {
  key: string;
  label: { en: string; hi: string };
  links: NavLinkItem[];
}

const canReviewRequests = (role: AuthUser['role']) =>
  ['superadmin', 'state_admin', 'district_incharge'].includes(role);

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const Navbar: React.FC<Props> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  currentUser,
  onUserChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<MemberNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationError, setNotificationError] = useState('');

  const isLoggedIn = currentUser.role !== 'public';
  const canReview = canReviewRequests(currentUser.role);
  const canManageOrganization = ['superadmin', 'state_admin', 'district_incharge'].includes(currentUser.role);

  useEffect(() => {
    if (!canReview) {
      setNotifications([]);
      setUnreadCount(0);
      setNotificationError('');
      return;
    }
    setNotifications([]);
    setUnreadCount(0);
    if (!isUuid(currentUser.id)) {
      setNotificationError('Sign in with an authorized Supabase account to load notifications.');
      return;
    }

    let mounted = true;
    const refreshNotifications = async () => {
      try {
        const [rows, count] = await Promise.all([
          memberNotificationService.listRecent(),
          memberNotificationService.unreadCount(),
        ]);
        if (mounted) {
          setNotifications(rows);
          setUnreadCount(count);
          setNotificationError('');
        }
      } catch (error) {
        if (mounted) setNotificationError(error instanceof Error ? error.message : 'Could not load notifications.');
      }
    };

    void refreshNotifications();
    const unsubscribe = memberNotificationService.subscribe(currentUser.id, () => { void refreshNotifications(); });
    const interval = window.setInterval(() => { void refreshNotifications(); }, 45_000);
    const handleFocus = () => { void refreshNotifications(); };
    window.addEventListener('focus', handleFocus);
    return () => {
      mounted = false;
      unsubscribe();
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [canReview, currentUser.id]);

  const navGroups: NavGroup[] = [
    {
      key: 'explore',
      label: { en: 'Explore', hi: 'जानें' },
      links: [
        { key: 'home', label: { en: 'Main', hi: 'मुख्य पृष्ठ' } },
        { key: 'parliamentary', label: { en: 'Leaders & Evidence', hi: 'नेता व साक्ष्य' } },
        { key: 'faq', label: { en: 'FAQ', hi: 'सामान्य प्रश्न' } },
      ],
    },
    {
      key: 'public-services',
      label: { en: 'Updates & Membership', hi: 'समाचार व सदस्यता' },
      links: [
        { key: 'events', label: { en: 'Events & Press', hi: 'कार्यक्रम व प्रेस' } },
        { key: 'membership', label: { en: 'Membership Request', hi: 'सदस्यता अनुरोध' } },
        { key: 'verification', label: { en: 'Verification', hi: 'सत्यापन' } },
        { key: 'download-card', label: { en: 'Download Card', hi: 'कार्ड डाउनलोड' } },
      ],
    },
    ...(isLoggedIn ? [{
      key: 'work',
      label: { en: 'My Work', hi: 'मेरा कार्य' },
      links: [
        { key: 'workflow', label: { en: 'Cadre Workflow', hi: 'कार्यकर्ता मार्गदर्शिका' } },
        { key: 'districts', label: { en: 'Organization Directory', hi: 'संगठन निर्देशिका' } },
        { key: 'broadcast', label: { en: 'Social Studio', hi: 'सोशल स्टूडियो' } },
      ],
    }] : []),
    ...(canReview ? [{
      key: 'member-operations',
      label: { en: 'Member Operations', hi: 'सदस्य प्रबंधन' },
      links: [
        { key: 'approvals', label: { en: 'Request Approvals', hi: 'अनुरोध अनुमोदन' }, badge: unreadCount },
        { key: 'organization-admin', label: { en: 'Membership & Committees', hi: 'सदस्यता व समितियां' } },
      ],
    }] : []),
    ...(canManageOrganization ? [{
      key: 'organization-admin-tools',
      label: { en: 'Organization Admin', hi: 'संगठन प्रशासन' },
      links: [
        { key: 'structure', label: { en: 'Wings & Designations', hi: 'विंग व पद' } },
      ],
    }] : []),
    ...(currentUser.role === 'superadmin' ? [{
      key: 'platform-admin',
      label: { en: 'Platform Admin', hi: 'प्लेटफ़ॉर्म प्रशासन' },
      links: [
        { key: 'role-management', label: { en: 'Roles & Accounts', hi: 'भूमिकाएं व खाते' } },
      ],
    }] : []),
  ];

  const navigate = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setNotificationOpen(false);
  };

  const openNotification = async (notification: MemberNotification) => {
    if (!notification.readAt) {
      try {
        await memberNotificationService.markRead(notification.id);
        setNotifications((rows) => rows.map((row) => row.id === notification.id ? { ...row, readAt: new Date().toISOString() } : row));
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (error) {
        setNotificationError(error instanceof Error ? error.message : 'Could not mark notification as read.');
      }
    }
    navigate('approvals');
  };

  const renderLinks = (group: NavGroup) => group.links.map((link) => (
    <button
      type="button"
      key={link.key}
      onClick={() => navigate(link.key)}
      aria-current={activeTab === link.key ? 'page' : undefined}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        activeTab === link.key
          ? 'bg-emerald-50 font-bold text-emerald-900'
          : 'text-stone-700 hover:bg-stone-50 hover:text-emerald-900'
      }`}
    >
      <span className="flex items-center justify-between gap-4">
        <span>{link.label[lang]}</span>
        {link.badge ? <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">{link.badge}</span> : null}
      </span>
    </button>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex shrink-0 items-center gap-2 text-left text-sm font-black tracking-tight text-emerald-950 transition-colors hover:text-emerald-800 sm:gap-2.5 sm:text-base"
        >
          <span className="flex items-center justify-center rounded-lg border border-emerald-300 bg-emerald-100/70 p-1.5">
            <LadderSymbolIcon size={18} />
          </span>
          <span className="flex flex-col">
            <span className="flex items-center gap-1.5">
              <span>MYL UP</span><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-stone-700">मुस्लिम यूथ लीग</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-blue-900 sm:text-[9px]">Indian Union Muslim League</span>
          </span>
        </button>

        <nav aria-label={lang === 'hi' ? 'मुख्य नेविगेशन' : 'Main navigation'} className="hidden min-w-0 flex-1 justify-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <details key={group.key} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 hover:text-emerald-900">
                {group.label[lang]}<ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
                {renderLinks(group)}
              </div>
            </details>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {canReview && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen((open) => !open)}
                aria-label={lang === 'hi' ? `सूचनाएं, ${unreadCount} अपठित` : `Notifications, ${unreadCount} unread`}
                aria-expanded={notificationOpen}
                className="relative rounded-lg border border-stone-200 bg-white p-2 text-stone-700 hover:bg-stone-50"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-600 px-1 text-center text-[9px] font-bold leading-4 text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-1rem))] rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-extrabold text-stone-900">{lang === 'hi' ? 'सदस्य अनुरोध सूचनाएं' : 'Membership request alerts'}</h2>
                    {unreadCount > 0 && <span className="text-[11px] font-bold text-rose-700">{unreadCount} {lang === 'hi' ? 'अपठित' : 'unread'}</span>}
                  </div>
                  {notificationError && <p role="alert" className="mb-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-800">{notificationError}</p>}
                  {!notificationError && notifications.length === 0 && <p className="py-4 text-center text-xs text-stone-500">{lang === 'hi' ? 'कोई नया अनुरोध नहीं है।' : 'No membership requests yet.'}</p>}
                  <div className="max-h-72 space-y-1 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={() => { void openNotification(notification); }}
                        className={`w-full rounded-lg p-2.5 text-left transition-colors hover:bg-emerald-50 ${notification.readAt ? 'text-stone-600' : 'bg-emerald-50/70 text-stone-900'}`}
                      >
                        <span className="block text-xs font-bold">{lang === 'hi' ? 'नया सदस्यता अनुरोध' : 'New membership request'}</span>
                        <span className="mt-0.5 block truncate font-mono text-[10px]">{notification.memberId}</span>
                        <time className="mt-1 block text-[10px] text-stone-500">{new Date(notification.createdAt).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN')}</time>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <AuthRoleSwitcher
            currentUser={currentUser}
            onUserChange={onUserChange}
            lang={lang}
            onNavigateLogin={() => navigate('login')}
            onNavigateRoleManagement={() => navigate('role-management')}
          />
          <button
            type="button"
            onClick={() => onLanguageChange(lang === 'en' ? 'hi' : 'en')}
            aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-100 px-2 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200 sm:px-2.5"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-700" />
            <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav aria-label={lang === 'hi' ? 'मुख्य नेविगेशन' : 'Main navigation'} className="max-h-[80vh] space-y-2 overflow-y-auto border-t border-stone-200 bg-white px-4 py-3 shadow-xl lg:hidden">
          {navGroups.map((group) => (
            <details key={group.key} className="rounded-xl border border-stone-100 bg-stone-50">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-sm font-extrabold text-stone-800">
                {group.label[lang]}<ChevronDown className="h-4 w-4" />
              </summary>
              <div className="space-y-1 border-t border-stone-100 p-2">{renderLinks(group)}</div>
            </details>
          ))}
        </nav>
      )}
    </header>
  );
};
