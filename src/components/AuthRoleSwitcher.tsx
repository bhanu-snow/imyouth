import React, { useState } from 'react';
import { LogIn, LogOut, ChevronDown, Lock, Key, Settings, User } from 'lucide-react';
import { AuthUser, Language } from '../types';
import { PUBLIC_USER } from '../services/storageService';
import { authService } from '../services/authService';

interface Props {
  currentUser: AuthUser;
  onUserChange: (user: AuthUser) => void;
  lang: Language;
  onNavigateLogin: () => void;
  onNavigateRoleManagement: () => void;
}

export const AuthRoleSwitcher: React.FC<Props> = ({ 
  currentUser, 
  onUserChange, 
  lang,
  onNavigateLogin,
  onNavigateRoleManagement
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isPublic = currentUser.role === 'public';

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } finally {
      onUserChange(PUBLIC_USER);
      setDropdownOpen(false);
    }
  };

  const getRoleBadge = (role: AuthUser['role']) => {
    switch (role) {
      case 'superadmin':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-300">SUPER ADMIN</span>;
      case 'state_president':
        return <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-purple-300">STATE PRESIDENT</span>;
      case 'press_release':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-300">PRESS RELEASE</span>;
      case 'content_manager':
        return <span className="bg-cyan-100 text-cyan-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-cyan-300">CONTENT MGR</span>;
      case 'state_admin':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded">STATE ADMIN</span>;
      case 'district_incharge':
        return <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded">DISTRICT IN-CHARGE</span>;
      case 'cadre_volunteer':
        return <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-1.5 py-0.5 rounded">CADRE VOLUNTEER</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-1.5 py-0.5 rounded">PUBLIC</span>;
    }
  };

  // Requirement 3: Default website opens with public role, no username/rolename list visible publicly
  if (isPublic) {
    return (
      <button
        type="button"
        onClick={onNavigateLogin}
        className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        title="Cadre / Officer Login"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button for Logged-In User */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors cursor-pointer"
        title="Active Account Menu"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
        <span className="max-w-[80px] sm:max-w-[130px] truncate font-bold text-stone-900">
          {currentUser.name}
        </span>
        <span className="hidden sm:inline">{getRoleBadge(currentUser.role)}</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
      </button>

      {/* Authenticated User Menu Dropdown (Private, no public user list) */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 space-y-2 animate-fade-in text-xs">
          <div className="px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {lang === 'hi' ? 'सक्रिय लॉगिन सत्र' : 'Active Session'}
              </span>
              {getRoleBadge(currentUser.role)}
            </div>
            <div className="font-extrabold text-stone-900 text-sm mt-1 truncate">{currentUser.name}</div>
            <div className="text-[11px] text-stone-500 truncate">
              {currentUser.designation} {currentUser.district && `· ${currentUser.district}`}
            </div>
            {currentUser.email && (
              <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                {currentUser.email}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {currentUser.role === 'superadmin' ? (
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onNavigateRoleManagement();
                }}
                className="w-full text-left p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'hi' ? 'भूमिका व सुरक्षा प्रबंधन' : 'Role & Security Desk'}</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">OPEN</span>
              </button>
            ) : (
              <p className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-[11px] text-stone-600">
                {lang === 'hi' ? 'पासवर्ड Supabase Auth द्वारा प्रबंधित हैं।' : 'Passwords are managed by Supabase Auth.'}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onNavigateLogin();
              }}
              className="w-full text-left p-2 hover:bg-stone-50 text-stone-700 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-stone-400" />
              <span>{lang === 'hi' ? 'दूसरे खाते में लॉगिन करें' : 'Login with Another Account'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left p-2 hover:bg-rose-50 text-rose-700 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'लॉगआउट (सार्वजनिक मोड)' : 'Logout (Return to Public)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
