import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Check, 
  X, 
  Search, 
  AlertCircle, 
  UserCheck, 
  QrCode, 
  Filter,
  Lock,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { Member, AuthUser, Language } from '../types';
import { storageService } from '../services/storageService';
import { DigitalIdCard } from './DigitalIdCard';

interface Props {
  lang: Language;
  currentUser: AuthUser;
  onRefreshMembers: () => void;
}

export const CadreApprovalsQueue: React.FC<Props> = ({ 
  lang, 
  currentUser, 
  onRefreshMembers 
}) => {
  const [members, setMembers] = useState<Member[]>(storageService.getMembers());
  const [activeTab, setActiveTab] = useState<'approvals' | 'public_verify'>('approvals');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [verifyIdInput, setVerifyIdInput] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<Member | null | 'not_found'>(null);
  const [viewingApprovedCard, setViewingApprovedCard] = useState<Member | null>(null);

  const isAuthorized = currentUser.role === 'state_admin' || currentUser.role === 'district_incharge';

  const handleApprove = (requestId: string) => {
    const updated = storageService.approveCadre(requestId, currentUser);
    setMembers(updated);
    onRefreshMembers();
  };

  const handleReject = (requestId: string) => {
    const updated = storageService.rejectCadre(requestId);
    setMembers(updated);
    onRefreshMembers();
  };

  const handlePublicVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdInput.trim()) return;
    const result = storageService.verifyCadreById(verifyIdInput.trim());
    setVerifyResult(result ? result : 'not_found');
  };

  const pendingMembers = members.filter((m) => {
    const isPending = m.status === 'pending';
    const matchesDistrict = 
      currentUser.role === 'state_admin' 
        ? selectedDistrict === 'all' || m.district === selectedDistrict
        : m.district === currentUser.district;
    return isPending && matchesDistrict;
  });

  const approvedMembers = members.filter((m) => m.status === 'approved');

  const uniqueDistricts = Array.from(new Set(members.map((m) => m.district)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <span>{lang === 'hi' ? 'कैडर सत्यापन एवं अनुमोदन डेस्क' : 'Cadre Verification & Approvals Desk'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'उत्तर प्रदेश समिति' : 'Uttar Pradesh Committee'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' 
              ? 'कार्यकर्ता अनुमोदन व सार्वजनिक सत्यापन पोर्टल' 
              : 'Cadre Approvals Queue & Public Verification'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'नए कार्यकर्ताओं का आवेदन पहले "Request Pending" रहता है। केवल अधिकृत लॉगिन पदाधिकारी द्वारा अनुमोदन के पश्चात ही "Verified Cadre" डिजिटल पहचान पत्र जारी होता है।'
              : 'New member applications remain pending district review until approved by an authorized in-charge. Official identity cards are issued only post-approval.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'approvals'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'अनुमोदन कतार (Pending Queue)' : 'Approvals Queue'}
            {pendingMembers.length > 0 && (
              <span className="ml-1.5 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingMembers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('public_verify')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'public_verify'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सार्वजनिक सत्यापन (Public Verify)' : 'Public Verification'}</span>
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: CADRE APPROVALS QUEUE (PROTECTED) */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Permission State Banner */}
          {!isAuthorized ? (
            <div className="p-6 bg-stone-100 border border-stone-300 rounded-xl text-center space-y-3">
              <Lock className="w-8 h-8 text-stone-500 mx-auto" />
              <h3 className="font-bold text-stone-900 text-sm">
                {lang === 'hi' ? 'अनुमोदन केवल अधिकृत लॉगिन उपयोगकर्ता द्वारा संभव है' : 'Approvals Desk Restricted to Authorized In-Charges'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {lang === 'hi'
                  ? 'आप वर्तमान में अतिथि/कार्यकर्ता मोड में हैं। नए कार्यकर्ताओं के आवेदनों को अनुमोदित करने के लिए ऊपर दाईं ओर से "State Admin" या "District In-Charge" के रूप में लॉगिन करें।'
                  : 'You are currently in guest or volunteer mode. Please switch to State Admin or District In-Charge to review and approve pending cadre requests.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Role & Filter Bar */}
              <div className="p-4 bg-white border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-stone-600">Logged in as:</span>
                  <strong className="text-stone-900">{currentUser.name}</strong>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentUser.designation}
                  </span>
                </div>

                {currentUser.role === 'state_admin' && (
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Filter District:</span>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="px-2 py-1 border border-stone-300 rounded bg-white font-medium"
                    >
                      <option value="all">All Districts (सभी ज़िले)</option>
                      {uniqueDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Pending Queue List */}
              <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'hi' ? 'लंबित आवेदन सूची (Pending Requests)' : 'Pending Cadre Verification Requests'}</span>
                  </h3>
                  <span className="text-xs text-stone-500">
                    {pendingMembers.length} {lang === 'hi' ? 'आवेदन समीक्षाधीन' : 'applications awaiting approval'}
                  </span>
                </div>

                {pendingMembers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <div className="font-bold text-stone-700">All applications processed!</div>
                    <div>No pending cadre requests for your assigned district.</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingMembers.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-600/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden border border-stone-300 bg-white shrink-0 mt-0.5">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt={m.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center font-bold text-stone-500">
                                {m.fullName.charAt(0)}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-stone-900 text-sm">
                                {m.fullName}
                              </h4>
                              {m.fullNameHi && (
                                <span className="text-stone-500">({m.fullNameHi})</span>
                              )}
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                                PENDING REVIEW
                              </span>
                            </div>

                            <div className="text-stone-600 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                              <span><strong>App ID:</strong> {m.id}</span>
                              <span>·</span>
                              <span><strong>Phone:</strong> {m.phone}</span>
                              <span>·</span>
                              <span><strong>District:</strong> {m.district} ({m.subDistrict})</span>
                              <span>·</span>
                              <span><strong>Wing:</strong> {m.wing.toUpperCase()}</span>
                            </div>

                            {m.communityBackground && (
                              <div className="text-[11px] font-semibold text-blue-900 pt-0.5">
                                ★ {m.communityBackground}
                              </div>
                            )}

                            {m.bio && (
                              <p className="text-[11px] text-stone-500 italic mt-1 max-w-lg">
                                "{m.bio}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Approval Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => handleReject(m.id)}
                            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprove(m.id)}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{lang === 'hi' ? 'सत्यापित करें व कार्ड जारी करें' : 'Approve & Issue ID'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Already Approved Members List */}
              <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'hi' ? 'हाल में स्वीकृत सत्यापित कैडर' : 'Approved Verified Cadres'}</span>
                  </h3>
                  <span className="text-xs text-stone-500">
                    {approvedMembers.length} {lang === 'hi' ? 'सत्यापित सदस्य' : 'verified members'}
                  </span>
                </div>

                <div className="divide-y divide-stone-100 max-h-[300px] overflow-y-auto">
                  {approvedMembers.map((m) => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{m.fullName}</span>
                          <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {m.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {m.district} · {m.wing.toUpperCase()} · Approved by: {m.approvedBy || 'State Committee'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewingApprovedCard(m)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-300 transition-colors"
                      >
                        {lang === 'hi' ? 'आईडी कार्ड देखें' : 'View ID Card'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PUBLIC CADRE VERIFICATION DESK */}
      {activeTab === 'public_verify' && (
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-6 shadow-xs">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-lg font-bold text-stone-900">
              {lang === 'hi' ? 'सार्वजनिक कैडर सत्यापन पोर्टल' : 'Official Public Cadre Verification Portal'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'नागरिक, प्रशासन, या सहयोगी दल किसी भी कार्यकर्ता के डिजिटल पहचान पत्र संख्या (उदा. MYL-UP-2026-101) को दर्ज कर उसकी प्रामाणिकता व समिति अनुमोदन की तत्काल जांच कर सकते हैं।'
                : 'Enter any Member Cadre ID to instantly verify their official status, authorized district, approving officer, and active membership record.'}
            </p>
          </div>

          <form onSubmit={handlePublicVerify} className="max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="Enter Cadre ID (e.g. MYL-UP-2026-101)"
                value={verifyIdInput}
                onChange={(e) => setVerifyIdInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-900 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Verify
            </button>
          </form>

          {/* Verification Result Card */}
          {verifyResult && (
            <div className="pt-2">
              {verifyResult === 'not_found' ? (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs space-y-1">
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Cadre ID Not Found / अप्रमाणित पहचान पत्र</span>
                  </div>
                  <p>
                    No official membership or pending application was found matching this number. Please ensure the Cadre ID is entered correctly.
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-emerald-50 via-white to-blue-50 border-2 border-emerald-600 rounded-xl space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <span className="font-extrabold text-sm text-emerald-950 uppercase tracking-wide">
                        {verifyResult.status === 'approved' ? 'OFFICIAL VERIFIED CADRE' : 'APPLICATION UNDER DISTRICT REVIEW'}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {verifyResult.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Cadre Name:</span>
                      <strong className="text-stone-900 text-sm">{verifyResult.fullName}</strong>
                      {verifyResult.fullNameHi && (
                        <span className="text-emerald-800 block">{verifyResult.fullNameHi}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Designation & Wing:</span>
                      <strong className="text-stone-900">{verifyResult.designation}</strong>
                      <span className="text-blue-900 font-semibold block">{verifyResult.wing.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">District & State:</span>
                      <span className="text-stone-800 font-medium">{verifyResult.district} ({verifyResult.subDistrict}), UP</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Approval Authority:</span>
                      <span className="text-emerald-900 font-medium">{verifyResult.approvedBy || 'Pending State Approval'}</span>
                    </div>
                  </div>

                  {verifyResult.status === 'approved' && (
                    <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-stone-600">
                      <span>Verified: {verifyResult.approvedAt}</span>
                      <button
                        type="button"
                        onClick={() => setViewingApprovedCard(verifyResult)}
                        className="text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
                      >
                        View Official ID Card
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal for viewing approved card */}
      {viewingApprovedCard && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">
                Verified Cadre Card: {viewingApprovedCard.fullName}
              </h3>
              <button
                onClick={() => setViewingApprovedCard(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DigitalIdCard member={viewingApprovedCard} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
};
