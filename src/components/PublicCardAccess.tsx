import React, { useState } from 'react';
import { CheckCircle2, QrCode, Search, ShieldCheck } from 'lucide-react';
import type { Language, Member } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import { memberService } from '../services/memberService';

interface Props {
  lang: Language;
  mode: 'verification' | 'download';
}

export const PublicCardAccess: React.FC<Props> = ({ lang, mode }) => {
  const [cadreId, setCadreId] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cadreId.trim()) {
      setError(lang === 'hi' ? 'कृपया कैडर आईडी दर्ज करें।' : 'Enter a cadre ID to continue.');
      return;
    }
    setLoading(true);
    setError('');
    setMember(null);
    try {
      const verifiedMember = await memberService.verifyPublic(cadreId.trim());
      if (!verifiedMember || !verifiedMember.verified || verifiedMember.status !== 'approved') {
        setError(lang === 'hi' ? 'यह आईडी नहीं मिली या सक्रिय सदस्यता सत्यापित नहीं है।' : 'No verified active member was found for that ID.');
        return;
      }
      setMember(verifiedMember);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Could not verify this cadre ID.');
    } finally {
      setLoading(false);
    }
  };

  const isDownload = mode === 'download';
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800">
          {isDownload ? <ShieldCheck className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
          <span>{isDownload ? (lang === 'hi' ? 'डिजिटल सदस्य कार्ड' : 'Digital Member Card') : (lang === 'hi' ? 'सदस्य सत्यापन' : 'Member Verification')}</span>
        </div>
        <h1 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
          {isDownload
            ? (lang === 'hi' ? 'सत्यापित कार्ड डाउनलोड करें' : 'Download a Verified Member Card')
            : (lang === 'hi' ? 'सार्वजनिक सदस्य सत्यापन' : 'Public Member Verification')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
          {lang === 'hi'
            ? 'केवल स्वीकृत और सत्यापित सदस्य की आईडी दर्ज करें। सार्वजनिक परिणाम में सीमित पहचान जानकारी दिखाई जाती है।'
            : 'Enter the ID of an approved member. Only limited identity details are shown publicly, and a card is available only after successful verification.'}
        </p>
        <form onSubmit={handleVerify} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="public-cadre-id">Cadre ID</label>
          <input
            id="public-cadre-id"
            autoComplete="off"
            value={cadreId}
            onChange={(event) => setCadreId(event.target.value)}
            placeholder="MYL-UP-YYYY-XXXXXXXX"
            className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2.5 font-mono text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {loading ? (lang === 'hi' ? 'जांच जारी…' : 'Checking…') : (lang === 'hi' ? 'सत्यापित करें' : 'Verify ID')}
          </button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      </header>
      {member && (
        <div className="space-y-4">
          <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {lang === 'hi' ? 'सदस्यता सत्यापित है।' : 'Membership verified.'}
          </div>
          <DigitalIdCard member={member} lang={lang} />
        </div>
      )}
    </section>
  );
};
