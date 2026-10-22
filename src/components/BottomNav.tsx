import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onOpenQrScanner: () => void;
  onOpenNavTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenQrScanner,
  onOpenNavTab,
}) => {
  return (
    <nav
      className="absolute left-4 right-4 h-[64px] bg-[#1a1c22]/95 backdrop-blur-xl rounded-[32px] px-2.5 flex items-center justify-between border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.6)] z-40 select-none"
      style={{ bottom: 'max(10px, calc(env(safe-area-inset-bottom, 34px) - 8px))' }}
      data-purpose="bottom-tab-bar"
    >
      {/* Tab 1: Asosiy (Home) */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            currentScreen === 'home'
              ? 'bg-[#2a2a2a] border border-[#3a3a3a] text-white px-3.5 py-1 rounded-[20px] shadow-sm'
              : 'text-[#bdbdbd] hover:text-white px-3 py-1'
          }`}
        >
          {/* Authentic Home Icon with Smile */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3.172l7.707 6.423a1 1 0 01.363.768V19a2 2 0 01-2 2h-3.5a1 1 0 01-1-1v-2.5a1.5 1.5 0 00-3 0V20a1 1 0 01-1 1H6a2 2 0 01-2-2v-8.637a1 1 0 01.363-.768L12 3.172z" />
            </svg>
            <div className="absolute bottom-[5px] w-2 h-1 border-b-[1.8px] border-[#2a2a2a] rounded-full"></div>
          </div>
          <span className="text-[11px] font-medium tracking-normal mt-0.5">Asosiy</span>
        </button>
      </div>

      {/* Tab 2: Xizmatlar */}
      <button
        onClick={() => onOpenNavTab('xizmatlar')}
        className="flex flex-col items-center justify-center text-[#bdbdbd] hover:text-white transition px-2.5 py-1 cursor-pointer"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <rect height="5.5" rx="1.5" width="5.5" x="4" y="4"></rect>
          <rect height="5.5" rx="1.5" width="5.5" x="14.5" y="4"></rect>
          <rect height="5.5" rx="1.5" width="5.5" x="4" y="14.5"></rect>
          <rect height="5.5" rx="1.5" width="5.5" x="14.5" y="14.5"></rect>
        </svg>
        <span className="text-[11px] font-normal tracking-normal mt-0.5 text-[#bdbdbd]">Xizmatlar</span>
      </button>

      {/* Center Action: QR Scanner Light Blue Circle Button */}
      <div className="flex items-center justify-center px-0.5">
        <button
          onClick={onOpenQrScanner}
          aria-label="QR Scanner"
          className="w-[46px] h-[46px] rounded-full bg-[#a9c4f5] active:scale-95 flex items-center justify-center text-[#12161f] shadow-lg transition-transform cursor-pointer"
        >
          {/* Authentic QR Icon */}
          <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5V5.25A1.5 1.5 0 015.25 3.75h2.25m9 0h2.25a1.5 1.5 0 011.5 1.5V7.5m0 9v2.25a1.5 1.5 0 01-1.5 1.5h-2.25m-9 0H5.25a1.5 1.5 0 01-1.5-1.5V16.5" />
            <rect className="fill-current" height="3" rx="0.6" width="3" x="7" y="7"></rect>
            <rect className="fill-current" height="3" rx="0.6" width="3" x="14" y="7"></rect>
            <rect className="fill-current" height="3" rx="0.6" width="3" x="7" y="14"></rect>
            <rect className="fill-current" height="3" rx="0.6" width="3" x="14" y="14"></rect>
          </svg>
        </button>
      </div>

      {/* Tab 4: To'lovlar */}
      <button
        onClick={() => onOpenNavTab('tolovlar')}
        className="flex flex-col items-center justify-center text-[#bdbdbd] hover:text-white transition px-2.5 py-1 cursor-pointer"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M20 7h-1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2zm-3-2v2H5V5h12zm3 9h-4a2 2 0 01-2-2 2 2 0 012-2h4v4z" />
          <circle cx="16" cy="12" r="1" fill="#1a1c22" />
        </svg>
        <span className="text-[11px] font-normal tracking-normal mt-0.5 text-[#bdbdbd]">To'lovlar</span>
      </button>

      {/* Tab 5: Profilim */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            currentScreen === 'profile'
              ? 'bg-[#2a2a2a] border border-[#3a3a3a] text-white px-3.5 py-1 rounded-[20px] shadow-sm'
              : 'text-[#bdbdbd] hover:text-white px-2.5 py-1'
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path clipRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" fillRule="evenodd"></path>
          </svg>
          <span className="text-[11px] font-medium tracking-normal mt-0.5">Profilim</span>
        </button>
      </div>
    </nav>
  );
};
