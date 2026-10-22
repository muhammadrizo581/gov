import React, { useState } from 'react';
import { Screen } from '../types';

interface IdCardScreenProps {
  onNavigate: (screen: Screen) => void;
  onOpenVerificationSheet: () => void;
  onOpenPdfModal: () => void;
  onShowToast: (msg: string) => void;
  onBack?: () => void;
}

export const IdCardScreen: React.FC<IdCardScreenProps> = ({
  onNavigate,
  onOpenVerificationSheet,
  onOpenPdfModal,
  onShowToast,
  onBack,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncDate, setSyncDate] = useState('17 oktabr 2026');

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onShowToast(!isFlipped ? "Karta orqa tomoni ko'rsatilmoqda" : "Karta old tomoni ko'rsatilmoqda");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
      setSyncDate(`Bugun, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
      onShowToast("Ma'lumotlar muvaffaqiyatli yangilandi");
    }, 700);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Abdulxakimov Muhammadrizo - ID Karta',
        text: 'my.gov.uz elektron ID-karta hujjati',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Hujjat havolasi nusxalandi');
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-4">
      {/* Top Navigation Bar */}
      <nav className="px-5 pt-3 pb-2 flex items-center justify-between z-20 shrink-0" data-purpose="screen-navigation">
        {/* Back Button */}
        <button
          onClick={() => (onBack ? onBack() : onNavigate('docs'))}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-[#24262b] text-neutral-200 flex items-center justify-center hover:bg-[#2e3137] active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* Screen Title */}
        <h1 className="text-[17px] font-bold text-white tracking-tight">ID karta / pasport</h1>

        {/* Action Buttons (Refresh & Share) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            aria-label="Refresh"
            className="w-10 h-10 rounded-full bg-[#24262b] text-neutral-200 flex items-center justify-center hover:bg-[#2e3137] active:scale-95 transition-all"
          >
            <svg
              className={`w-5 h-5 stroke-[2] transition-transform duration-700 ${isRefreshing ? 'rotate-[360deg]' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <button
            onClick={handleShare}
            aria-label="Share"
            className="w-10 h-10 rounded-full bg-[#24262b] text-neutral-200 flex items-center justify-center hover:bg-[#2e3137] active:scale-95 transition-all"
          >
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Sync Info Pill */}
      <div className="flex justify-center mt-1 mb-2 z-10 shrink-0" data-purpose="last-sync-indicator">
        <div className="bg-[#24272e]/90 backdrop-blur border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-inner">
          <svg className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <p className="text-[11px] text-neutral-300 font-normal">
            Oxirgi yangilanish: <span className="text-[#e29338] font-medium ml-0.5">{syncDate}</span>
          </p>
        </div>
      </div>

      {/* ID Card Center Showcase (3D Flippable Container) */}
      <section className="flex-1 px-4 py-1 flex items-center justify-center relative overflow-hidden select-none perspective-1000">
        <div
          onClick={handleFlip}
          className="relative w-[320px] h-[510px] transform-style-3d transition-transform duration-700 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-[22px]"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* FRONT SIDE (Rotated portrait layout matching real screenshot) */}
          <div className="absolute inset-0 backface-hidden rounded-[22px] overflow-hidden border border-white/20 bg-neutral-900">
            <img
              src="/assets/id_card_rotated.png"
              alt="ID Karta Abdulxakimov Muhammadrizo"
              className="w-full h-full object-cover select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
          </div>

          {/* BACK SIDE (Realistic e-ID with chip, PINFL, residence and MRZ) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[22px] overflow-hidden border border-sky-400/30 id-guilloche-bg p-4 flex flex-col justify-between text-neutral-800 shadow-2xl">
            {/* Header: Republic & Smart Chip */}
            <div className="flex justify-between items-start border-b border-sky-200 pb-2">
              <div>
                <h3 className="text-[11px] font-black uppercase text-[#0d4f7c] tracking-tight">O'ZBEKISTON RESPUBLIKASI</h3>
                <p className="text-[7px] text-neutral-500 uppercase tracking-wider font-semibold">REPUBLIC OF UZBEKISTAN</p>
              </div>
              {/* Metallic Chip */}
              <div className="w-14 h-11 bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-200 rounded-md border border-amber-600/70 p-1 flex items-center justify-center relative shadow-sm">
                <div className="w-full h-full border border-amber-700/60 rounded flex items-center justify-center">
                  <div className="w-5 h-5 border-l border-r border-amber-800/60"></div>
                </div>
              </div>
            </div>

            {/* Back Details */}
            <div className="space-y-2 text-[9px] my-auto">
              <div>
                <span className="text-[6.5px] uppercase text-neutral-500 block font-semibold">JSHSHIR / Personal PINFL</span>
                <span className="font-mono font-bold text-xs text-neutral-900 tracking-wider">50404095430026</span>
              </div>
              <div>
                <span className="text-[6.5px] uppercase text-neutral-500 block font-semibold">Doimiy ro'yxatdan o'tgan joyi / Address</span>
                <span className="font-bold text-[10px] text-neutral-900 leading-tight block">TOSHKENT SHAHAR, YUNUSOBOD TUMANI, BOG'ISHAMOL KO'CHASI, 45-UY</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[6.5px] uppercase text-neutral-500 block font-semibold">Bergan organ / Authority</span>
                  <span className="font-bold text-[9.5px] text-neutral-900 leading-tight block">TOSHKENT SH. IIBB XATTB</span>
                </div>
                <div>
                  <span className="text-[6.5px] uppercase text-neutral-500 block font-semibold">Hujjat turi / Document type</span>
                  <span className="font-bold text-[9.5px] text-neutral-900 leading-tight block">I / IDENTITY CARD</span>
                </div>
              </div>
            </div>

            {/* MRZ Lines */}
            <div className="pt-2 border-t border-sky-200/80 font-mono text-[8px] text-neutral-800 leading-tight tracking-wider bg-white/50 p-1.5 rounded">
              <p>I&lt;UZBAE4451634&lt;6&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
              <p>0904047M3510025UZB&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</p>
              <p>ABDULXAKIMOV&lt;&lt;MUHAMMADRIZO&lt;&lt;&lt;&lt;&lt;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Area */}
      <footer className="px-5 pt-1 pb-4 flex flex-col gap-2.5 z-20 shrink-0" data-purpose="card-actions">
        <div className="flex items-center space-x-3 w-full">
          {/* Flip Button */}
          <button
            onClick={handleFlip}
            aria-label="Aylantirish / Flip card"
            className="w-12 h-12 rounded-2xl bg-[#24262b] text-neutral-300 flex items-center justify-center hover:bg-[#2d3036] active:scale-95 transition-all shadow-md shrink-0"
          >
            <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>

          {/* "Ko'rsatish" Button */}
          <button
            onClick={onOpenVerificationSheet}
            aria-label="Ko'rsatish"
            className="flex-1 h-12 bg-[#92bcf4] hover:bg-[#a1c6fa] text-[#0d1c33] font-semibold text-[15px] rounded-2xl flex items-center justify-center space-x-2 active:scale-[0.98] transition-all shadow-lg shadow-sky-950/20"
          >
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="tracking-tight">Ko'rsatish</span>
          </button>

          {/* PDF Icon Button */}
          <button
            onClick={onOpenPdfModal}
            aria-label="PDF shaklida yuklab olish"
            className="w-12 h-12 rounded-2xl bg-[#24262b] text-neutral-300 hover:text-white flex items-center justify-center hover:bg-[#2d3036] active:scale-95 transition-all shadow-md shrink-0 relative group"
          >
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-900 text-[8px] font-black px-1 py-0.5 rounded leading-none">PDF</span>
          </button>
        </div>

        {/* PDF Banner Button */}
        <button
          onClick={onOpenPdfModal}
          className="w-full py-2.5 px-3 bg-[#1e2025] hover:bg-[#25282f] active:scale-[0.99] border border-white/5 rounded-2xl flex items-center justify-between text-neutral-300 text-xs transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#ce1126]/20 text-[#ce1126] flex items-center justify-center font-bold text-[10px]">PDF</div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-semibold text-neutral-200 leading-tight">PDF shaklida yuklab olish</span>
              <span className="text-[9.5px] text-neutral-400 leading-none mt-0.5">QR kodli rasmiy nusxa • Yuridik kuchga ega</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#92bcf4]">
            <span>Yuklab olish</span>
            <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5m-5-7v12" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </button>
      </footer>
    </div>
  );
};
