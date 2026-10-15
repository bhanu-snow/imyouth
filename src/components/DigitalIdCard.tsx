import React, { useRef, useState } from 'react';
import { Download, Printer, Share2, Check, ShieldCheck, QrCode } from 'lucide-react';
import { Member, Language } from '../types';
import { LadderSymbolIcon } from './PartySymbol';
import confetti from 'canvas-confetti';

interface Props {
  member: Member;
  lang: Language;
}

export const DigitalIdCard: React.FC<Props> = ({ member, lang }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPNG = () => {
    setDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 620;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Card Base Gradient - Pure White with subtle crisp texture
    const grad = ctx.createLinearGradient(0, 0, 1000, 620);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 1000, 620, 24);
    ctx.fill();

    // Dual-tone Outer Border: Left Half Constitutional Blue, Right Half IUML Green
    ctx.strokeStyle = '#1e3a8a'; // Constitutional Blue
    ctx.lineWidth = 4;
    ctx.stroke();

    // TOP BANNER STRIP: Balanced Dual Ribbon (Constitutional Blue + White + IUML Green)
    // Left ribbon: Deep Blue (Ambedkarite Social Justice)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 480, 26);
    // Center divider: White
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(480, 0, 40, 26);
    // Right ribbon: IUML Emerald Green
    ctx.fillStyle = '#047857';
    ctx.fillRect(520, 0, 480, 26);

    // Secondary sub-strip
    ctx.fillStyle = '#2563eb'; // Bright Blue
    ctx.fillRect(0, 26, 480, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(480, 26, 40, 8);
    ctx.fillStyle = '#10b981'; // Mint Green
    ctx.fillRect(520, 26, 480, 8);

    // Organization Header Text
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('MUSLIM YOUTH LEAGUE (MYL) · मुस्लिम यूथ लीग', 50, 92);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('INDIAN UNION MUSLIM LEAGUE · UTTAR PRADESH STATE COMMITTEE', 50, 122);

    // Multi-Community Inclusivity Strip (Dalit + Alpsankhyak Front)
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(50, 138, 900, 30);
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('★ दलित + अल्पसंख्यक सर्वसमाज मोर्चा (Dalit, Sikh, Christian, Buddhist & Muslim Fraternity)', 65, 158);

    // Member Photo Box (Framed with Constitutional Blue & Green)
    ctx.fillStyle = '#f1f5f9';
    ctx.roundRect(50, 185, 210, 255, 16);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fallback Initial
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 64px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(member.fullName.charAt(0), 155, 320);
    ctx.textAlign = 'left';

    // Member Details Text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.fillText(member.fullName, 290, 225);

    if (member.fullNameHi) {
      ctx.fillStyle = '#047857';
      ctx.font = '600 23px system-ui, sans-serif';
      ctx.fillText(member.fullNameHi, 290, 258);
    }

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 21px system-ui, sans-serif';
    ctx.fillText(`Cadre ID: ${member.id}`, 290, 300);

    ctx.fillStyle = '#334155';
    ctx.font = '500 19px system-ui, sans-serif';
    ctx.fillText(`Post / Designation: ${member.designation}`, 290, 335);
    ctx.fillText(`Wing: ${member.wing.toUpperCase()} (Uttar Pradesh)`, 290, 368);
    ctx.fillText(`District / Tehsil: ${member.district} (${member.subDistrict})`, 290, 401);
    ctx.fillText(`State: Uttar Pradesh | Blood: ${member.bloodGroup || 'N/A'}`, 290, 434);

    // QR Code Box (Framed in Constitutional Blue)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(770, 195, 160, 160);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 3;
    ctx.strokeRect(770, 195, 160, 160);

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(785, 210, 40, 40);
    ctx.fillRect(875, 210, 40, 40);
    ctx.fillRect(785, 300, 40, 40);
    ctx.fillRect(840, 265, 25, 25);
    ctx.fillRect(875, 300, 30, 30);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('SCAN TO VERIFY', 805, 380);

    // BOTTOM FOOTER: Balanced Blue & Green
    const footerGrad = ctx.createLinearGradient(0, 520, 1000, 620);
    footerGrad.addColorStop(0, '#1e3a8a'); // Blue
    footerGrad.addColorStop(0.5, '#0f172a'); // Midnight
    footerGrad.addColorStop(1, '#047857'); // Emerald Green
    ctx.fillStyle = footerGrad;
    ctx.fillRect(0, 520, 1000, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.fillText('हक़, इंसाफ़, तालीम व भाईचारा · Baba Saheb Ambedkar & Quaid-e-Millath Legacy', 50, 575);

    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('OFFICIAL VERIFIED CADRE', 740, 575);

    const link = document.createElement('a');
    link.download = `MYL_UP_Cadre_${member.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloading(false);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}
  };

  const handleShareId = () => {
    const text = `🇮🇳 I am an officially verified cadre member of Muslim Youth League (MYL) & MSF Uttar Pradesh!\n\nName: ${member.fullName}\nCadre ID: ${member.id}\nDistrict: ${member.district} (${member.subDistrict})\nWing: ${member.wing.toUpperCase()}\nDesignation: ${member.designation}\n\nUniting Dalits, Sikhs, Christians, Buddhists, and minorities for constitutional education & justice!\nVerify publicly: ${window.location.origin}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  const isPending = member.status === 'pending';

  return (
    <div className="space-y-4">
      {/* Printable ID Card Container */}
      <div 
        id="printable-id-card"
        ref={cardRef}
        className="relative bg-white border-2 border-blue-900 rounded-2xl overflow-hidden shadow-sm max-w-lg mx-auto"
      >
        {/* Balanced Dual-Tone Top Ribbon: Blue (Social Justice) + White + Green (IUML) */}
        <div className="h-3 w-full flex">
          <div className="h-full w-1/2 bg-blue-800" title="Constitutional Social Justice (Dalit, Alpsankhyak, Sikh, Christian, Buddhist)" />
          <div className="h-full w-8 bg-white border-x border-stone-200" />
          <div className="h-full w-1/2 bg-emerald-700" title="IUML / Muslim Youth League" />
        </div>

        {/* Card Header */}
        <div className="px-6 pt-3.5 pb-2.5 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-emerald-50 border border-emerald-200 rounded-lg">
              <LadderSymbolIcon size={26} />
            </div>
            <div>
              <div className="text-sm font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>MUSLIM YOUTH LEAGUE (MYL)</span>
                <span className="text-xs text-stone-500 font-bold">· उत्तर प्रदेश</span>
              </div>
              <div className="text-[10px] text-blue-900 font-bold flex items-center gap-1">
                <span>Indian Union Muslim League · Official Cadre Token</span>
              </div>
            </div>
          </div>

          <div>
            {isPending ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                PENDING DISTRICT APPROVAL
              </span>
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>VERIFIED CADRE</span>
              </div>
            )}
          </div>
        </div>

        {/* Inclusivity Ribbon */}
        <div className="bg-blue-50/80 px-6 py-1 border-b border-blue-100 text-[10px] font-bold text-blue-900 flex items-center justify-between">
          <span>दलित, अल्पसंख्यक एवं सर्वसमाज एकता (Dalit, Sikh, Christian, Buddhist & Muslim Front)</span>
          <span className="text-emerald-800">UP UNIT</span>
        </div>

        {/* Card Body */}
        <div className="p-6 grid grid-cols-12 gap-5 items-center">
          {/* Photo */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-blue-900 bg-stone-100 flex items-center justify-center shadow-inner">
              {member.avatarUrl ? (
                <img 
                  src={member.avatarUrl} 
                  alt={member.fullName} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-3xl font-extrabold text-blue-900">
                  {member.fullName.charAt(0)}
                </span>
              )}
            </div>
            <div className="mt-2 text-[10px] font-mono font-bold text-blue-950 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              {member.id}
            </div>
          </div>

          {/* Details */}
          <div className="col-span-8 space-y-1.5 text-xs">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 leading-tight">
                {member.fullName}
              </h3>
              {member.fullNameHi && (
                <span className="text-xs font-semibold text-emerald-800">
                  {member.fullNameHi}
                </span>
              )}
            </div>

            <div className="text-stone-600 space-y-0.5 pt-1 text-[11px]">
              <div>
                <span className="text-stone-400 font-medium">Post: </span>
                <strong className="text-stone-800">{member.designation}</strong>
              </div>
              <div>
                <span className="text-stone-400 font-medium">Wing: </span>
                <span className="text-blue-900 font-bold">{member.wing.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">District: </span>
                <span className="text-stone-800 font-medium">{member.district} ({member.subDistrict})</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">State: </span>
                <span className="text-stone-700">{member.state}</span>
                {member.bloodGroup && (
                  <span className="ml-2 text-rose-700 font-bold">Blood: {member.bloodGroup}</span>
                )}
              </div>
              <div className="text-[10px] text-stone-400 pt-0.5">
                Joined: {member.joinedAt} · Approver: {member.approvedBy || 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Bar: Dual Blue + Green theme */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-900 text-white px-6 py-2.5 flex items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-1.5 text-blue-200">
            <QrCode className="w-4 h-4 text-blue-300" />
            <span>Official Cadre Token</span>
          </div>
          <span className="text-emerald-200 font-semibold">हक़, इंसाफ़, तालीम व भाईचारा</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleExportPNG}
          disabled={downloading}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'Generating...' : lang === 'hi' ? 'पहचान पत्र डाउनलोड करें (PNG)' : 'Download ID Card (PNG)'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'प्रिंट करें' : 'Print Card'}</span>
        </button>

        <button
          type="button"
          onClick={handleShareId}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          {shared ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share ID to WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};
