import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  ArrowRight,
  UserCheck,
  Building2,
  Users
} from 'lucide-react';
import { AuthUser, Language } from '../types';
import { storageService, DEMO_USERS } from '../services/storageService';
import { LadderSymbolIcon } from './PartySymbol';

interface Props {
  lang: Language;
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<Props> = ({ 
  lang, 
  onLoginSuccess, 
  onNavigateHome 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!identifier.trim() || !password) {
      setErrorMsg(lang === 'hi' ? 'कृपया ईमेल/फोन और पासवर्ड दर्ज करें।' : 'Please enter your email/phone and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = storageService.authenticateWithPassword(identifier.trim(), password);
      setIsLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMsg(result.error || (lang === 'hi' ? 'अमान्य क्रेडेंशियल्स।' : 'Invalid credentials.'));
      }
    }, 300);
  };

  const handleQuickPresetLogin = (user: AuthUser) => {
    setIdentifier(user.email || user.phone);
    setPassword(user.password || 'admin123');
    setErrorMsg(null);
    
    // Auto submit after a brief animation
    setIsLoading(true);
    setTimeout(() => {
      const result = storageService.authenticateWithPassword(user.email || user.phone, user.password || 'admin123');
      setIsLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      }
    }, 250);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl shadow-xl p-8 space-y-6">
        {/* Brand Header with Ladder Symbol */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs mb-1">
            <LadderSymbolIcon size={42} />
          </div>
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            {lang === 'hi' ? 'मुस्लिम यूथ लीग उत्तर प्रदेश' : 'Muslim Youth League (MYL) UP'}
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {lang === 'hi' ? 'पदाधिकारी एवं कैडर पासवर्ड लॉगिन' : 'Cadre & In-Charge Password Login'}
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {lang === 'hi' 
              ? 'सुरक्षित पासवर्ड प्रमाणीकरण। किसी सशुल्क OTP की आवश्यकता नहीं है।' 
              : 'Secure password authentication. Zero SMS costs or paid OTP requirements.'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {lang === 'hi' ? 'ईमेल आईडी या पंजीकृत मोबाइल नंबर' : 'Email Address or Mobile Phone'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. admin@mylup.org or +91 98370 00112"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:border-emerald-700 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700">
                {lang === 'hi' ? 'खाता पासवर्ड' : 'Account Password'}
              </label>
              <span className="text-[10px] text-stone-400">
                {lang === 'hi' ? 'डिफ़ॉल्ट पासवर्ड नीचे दिए गए हैं' : 'Standard passwords available below'}
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-stone-300 rounded-xl focus:border-emerald-700 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>{lang === 'hi' ? 'सत्यापित हो रहा है...' : 'Authenticating...'}</span>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>{lang === 'hi' ? 'लॉगिन करें (Sign In With Password)' : 'Sign In With Password'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Panel (For immediate testing) */}
        <div className="pt-2 border-t border-stone-100 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center">
            {lang === 'hi' ? 'त्वरित 1-क्लिक परीक्षण खाते (Quick Preset Logins)' : 'Instant 1-Click Role Accounts (No OTP)'}
          </div>

          <div className="space-y-1.5 text-xs">
            {DEMO_USERS.filter((u) => u.role !== 'public').map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickPresetLogin(u)}
                className="w-full p-2.5 bg-stone-50 hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-500 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-stone-900 group-hover:text-emerald-900 flex items-center gap-1.5">
                    <span>{u.name}</span>
                    <span className="text-[9px] font-mono text-stone-500 bg-stone-200/80 px-1.5 py-0.2 rounded">
                      {u.password}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {u.designation} {u.district && `· ${u.district}`}
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  u.role === 'state_admin' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : u.role === 'district_incharge'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-stone-200 text-stone-800'
                }`}>
                  {u.role === 'state_admin' ? 'STATE ADMIN' : u.role === 'district_incharge' ? 'DISTRICT' : 'CADRE'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-stone-500 hover:text-emerald-800 font-semibold"
          >
            ← {lang === 'hi' ? 'होमपेज पर वापस जाएं' : 'Return to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};
