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
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#161616]">
      {/* Top Navigation Bar */}
      <nav
        className="px-4 pb-2 flex items-center justify-between z-20 shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
        data-purpose="screen-navigation"
      >
        {/* Back Button */}
        <button
          onClick={() => (onBack ? onBack() : onNavigate('docs'))}
          aria-label="Orqaga"
          className="w-[46px] h-[46px] rounded-full bg-[#262626] border border-white/[0.08] text-white flex items-center justify-center active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* Screen Title */}
        <h1 className="text-[17px] font-semibold text-white">ID karta / pasport</h1>

        {/* Action Pill (Refresh | Share) */}
        <div className="h-[46px] rounded-full bg-[#262626] border border-white/[0.08] flex items-center">
          <button
            onClick={handleRefresh}
            aria-label="Yangilash"
            className="w-[45px] h-full flex items-center justify-center text-white active:opacity-60"
          >
            <svg
              className={`w-[21px] h-[21px] stroke-[2.2] transition-transform duration-700 ${isRefreshing ? 'rotate-[360deg]' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 12a8 8 0 11-2.34-5.66M20 4v4.5h-4.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <div className="w-px h-6 bg-white/[0.15]" />
          <button
            onClick={handleShare}
            aria-label="Ulashish"
            className="w-[45px] h-full flex items-center justify-center text-white active:opacity-60"
          >
            <svg className="w-[21px] h-[21px] stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v12M8 7l4-4 4 4M8 10H6.5A1.5 1.5 0 005 11.5v8A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5v-8a1.5 1.5 0 00-1.5-1.5H16" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Sync Info Pill */}
      <div className="flex justify-center mt-2 z-10 shrink-0" data-purpose="last-sync-indicator">
        <div className="h-[35px] bg-[#262626] border border-white/[0.1] px-4 rounded-full flex items-center gap-2">
          <svg className="w-4 h-4 text-[#bdbdbd] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <p className="text-[12.5px] text-[#d0d0d0] font-normal">
            Oxirgi yangilanish sanasi: <span className="text-[#f0a030] font-semibold">{syncDate}</span>
          </p>
        </div>
      </div>

      {/* ID Card Center Showcase (3D Flippable Container) */}
      <section className="flex-1 min-h-0 px-4 py-6 flex items-center justify-center relative select-none perspective-1000">
        <div
          onClick={handleFlip}
          className="relative transform-style-3d transition-transform duration-700 cursor-pointer rounded-[16px]"
          style={{
            height: 'min(535px, 100%)',
            maxWidth: '78vw',
            aspectRatio: '54 / 85.6',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT SIDE (Rotated portrait layout matching real screenshot) */}
          <div className="absolute inset-0 backface-hidden rounded-[16px] overflow-hidden bg-white">
            <img
              src="/assets/id_card_rotated.png"
              alt="ID Karta Abdulxakimov Muhammadrizo"
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* BACK SIDE (Realistic e-ID with chip, PINFL, residence and MRZ) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[16px] overflow-hidden border border-sky-400/30 id-guilloche-bg p-4 flex flex-col justify-between text-neutral-800 shadow-2xl">
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
      <footer
        className="px-4 pt-2 flex items-center gap-[10px] z-20 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        data-purpose="card-actions"
      >
        {/* Flip Button */}
        <button
          onClick={handleFlip}
          aria-label="Aylantirish"
          className="w-[46px] h-[46px] rounded-[13px] bg-[#262626] border border-white/[0.08] text-white flex items-center justify-center active:scale-95 transition-all shrink-0"
        >
          <svg className="w-[22px] h-[22px] stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M7 14.5C4.6 13.9 3 12.8 3 11.5 3 9.6 7 8 12 8s9 1.6 9 3.5c0 1.6-2.7 2.9-6.5 3.4M10 12.5l3 2.5-3 2.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* "Ko'rsatish" Button */}
        <button
          onClick={onOpenVerificationSheet}
          aria-label="Ko'rsatish"
          className="flex-1 h-[50px] bg-[#a6c8f6] text-[#1b2a3d] font-semibold text-[16px] rounded-[16px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <svg className="w-[26px] h-[26px] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" strokeLinecap="round" strokeLinejoin="round"></path>
            <rect x="7" y="7" width="4" height="4" rx="1"></rect>
            <rect x="13" y="7" width="4" height="4" rx="1"></rect>
            <rect x="7" y="13" width="4" height="4" rx="1"></rect>
            <rect x="13" y="13" width="4" height="4" rx="1"></rect>
          </svg>
          <span>Ko‘rsatish</span>
        </button>
      </footer>
    </div>
  );
};
