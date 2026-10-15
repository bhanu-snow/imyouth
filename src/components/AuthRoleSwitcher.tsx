import React, { useState } from 'react';
import { User, LogIn, LogOut, ShieldCheck, ChevronDown, Check, Lock, Key, Settings, UserCheck } from 'lucide-react';
import { AuthUser, Language } from '../types';
import { DEMO_USERS, storageService } from '../services/storageService';
import { LadderSymbolIcon } from './PartySymbol';

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
  const [showPasswordSwitchModal, setShowPasswordSwitchModal] = useState<AuthUser | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isPublic = currentUser.role === 'public';

  const handleSelectRole = (user: AuthUser) => {
    if (user.role === 'public') {
      storageService.setCurrentUser(user);
      onUserChange(user);
      setDropdownOpen(false);
      return;
    }
    // Prompt for password if switching account
    setShowPasswordSwitchModal(user);
    setPasswordInput(user.password || '');
    setPasswordError(null);
    setDropdownOpen(false);
  };

  const handleConfirmPasswordSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordSwitchModal) return;

    const res = storageService.authenticateWithPassword(
      showPasswordSwitchModal.email || showPasswordSwitchModal.phone, 
      passwordInput
    );

    if (res.success && res.user) {
      onUserChange(res.user);
      setShowPasswordSwitchModal(null);
      setPasswordInput('');
    } else {
      setPasswordError(res.error || 'Incorrect password.');
    }
  };

  const handleLogout = () => {
    const guestUser = DEMO_USERS.find((u) => u.role === 'public') || DEMO_USERS[3];
    storageService.setCurrentUser(guestUser);
    onUserChange(guestUser);
    setDropdownOpen(false);
  };

  const getRoleBadge = (role: AuthUser['role']) => {
    switch (role) {
      case 'state_admin':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded">STATE ADMIN</span>;
      case 'district_incharge':
        return <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded">DISTRICT IN-CHARGE</span>;
      case 'cadre_volunteer':
        return <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-1.5 py-0.5 rounded">CADRE VOLUNTEER</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-1.5 py-0.5 rounded">GUEST (PUBLIC)</span>;
    }
  };

  if (isPublic) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button for Logged-In User */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors cursor-pointer"
        title="Account & Role Management"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span className="max-w-[110px] sm:max-w-[150px] truncate font-bold text-stone-900">
          {currentUser.name}
        </span>
        {getRoleBadge(currentUser.role)}
        <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
      </button>

      {/* Role Switcher & Management Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-fade-in text-xs">
          <div className="px-3 py-2.5 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {lang === 'hi' ? 'सक्रिय लॉगिन सत्र' : 'Active Authenticated Session'}
              </span>
              <span className="font-mono text-[10px] text-stone-400">POST-AUTH</span>
            </div>
            <div className="font-extrabold text-stone-900 text-sm mt-1">{currentUser.name}</div>
            <div className="text-[11px] text-stone-500">{currentUser.designation} {currentUser.district && `(${currentUser.district})`}</div>
          </div>

          {/* Quick link to Role Management Page */}
          <div className="p-1">
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
                <span>{lang === 'hi' ? 'भूमिका एवं अधिकार प्रबंधन' : 'Role & Permissions Desk'}</span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">OPEN</span>
            </button>
          </div>

          <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {lang === 'hi' ? 'खाता बदलें (Switch Account)' : 'Switch Operating Account'}
          </div>

          <div className="space-y-1 py-1">
            {DEMO_USERS.filter((u) => u.role !== 'public').map((user) => {
              const isSelected = currentUser.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectRole(user)}
                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-stone-100 text-emerald-950 font-bold' : 'hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {user.designation} {user.district && `(${user.district})`}
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between px-2 py-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                onNavigateLogin();
              }}
              className="text-[11px] font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3 h-3" />
              <span>{lang === 'hi' ? 'अन्य पासवर्ड लॉगिन' : 'Other Password Login'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-[11px] text-rose-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Switch Account Password Prompt Modal */}
      {showPasswordSwitchModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Lock className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-stone-900 text-sm">
                Switch to {showPasswordSwitchModal.name}
              </h3>
            </div>

            {passwordError && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleConfirmPasswordSwitch} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Enter Password for {showPasswordSwitchModal.email || showPasswordSwitchModal.name}
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-mono focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordSwitchModal(null)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer"
                >
                  Confirm & Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
