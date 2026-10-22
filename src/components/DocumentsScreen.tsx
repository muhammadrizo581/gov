import React, { useState } from 'react';
import { Screen } from '../types';

interface DocumentsScreenProps {
  onNavigate: (screen: Screen) => void;
  onOpenDocumentModal: (title: string, detail: string, type: string) => void;
  onShowToast: (msg: string) => void;
  onBack?: () => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  onNavigate,
  onOpenDocumentModal,
  onShowToast,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'info'>('docs');

  // Exact 12 documents with authentic text and U+2018 for "Nikoh to‘g‘risidagi"
  const documentItems = [
    {
      id: 'id_card',
      title: 'ID karta / pasport',
      icon: '/assets/docs/id_card.png',
      action: () => onNavigate('id-card'),
    },
    {
      id: 'driver_license',
      title: 'Haydovchilik guvohnomasi',
      icon: '/assets/docs/driver_license.png',
      action: () => onOpenDocumentModal('Haydovchilik guvohnomasi', 'Haydovchilik guvohnomasi ma\'lumotlari', 'license'),
    },
    {
      id: 'foreign_passport',
      title: 'Xorijga chiqish passporti',
      icon: '/assets/docs/foreign_passport.png',
      action: () => onOpenDocumentModal('Xorijga chiqish passporti', 'Xorijga chiqish biometrik pasporti', 'foreign_pass'),
    },
    {
      id: 'birth_cert',
      title: "Tug'ilganlik guvohnomasi",
      icon: '/assets/docs/birth_cert.png',
      action: () => onOpenDocumentModal("Tug'ilganlik guvohnomasi", "Tug'ilganlik haqidagi guvohnoma", 'birth'),
    },
    {
      id: 'divorce_cert',
      title: 'Nikohdan ajralganlik haqida guvohnoma',
      icon: '/assets/docs/divorce_cert.png',
      action: () => onOpenDocumentModal('Nikohdan ajralganlik haqida guvohnoma', "Nikohdan ajralganlik to'g'risida ma'lumot", 'divorce'),
    },
    {
      id: 'pension_cert',
      title: 'Pensiya guvohnomasi',
      icon: '/assets/docs/pension_cert.png',
      action: () => onOpenDocumentModal('Pensiya guvohnomasi', "Pensiya guvohnomasi ma'lumotlari", 'pension'),
    },
    {
      id: 'self_employed',
      title: "O'z o'zini band qilgan shaxs malumotnomasi",
      icon: '/assets/docs/self_employed.png',
      action: () => onOpenDocumentModal("O'z o'zini band qilgan shaxs malumotnomasi", "O'zini o'zi band qilgan shaxs sifatida ro'yxatdan o'tganlik ma'lumotnomasi", 'self_employed'),
    },
    {
      id: 'disability_cert',
      title: 'Nogironlik guvohnomasi',
      icon: '/assets/docs/disability_cert.png',
      action: () => onOpenDocumentModal('Nogironlik guvohnomasi', "Nogironlik to'g'risidagi ma'lumotnoma", 'disability'),
    },
    {
      id: 'yatt_cert',
      title: 'YaTT guvohnomasi',
      icon: '/assets/docs/yatt_cert.png',
      action: () => onOpenDocumentModal('YaTT guvohnomasi', "Yakka tartibdagi tadbirkor davlat ro'yxatidan o'tkazilganligi to'g'risida guvohnoma", 'yatt'),
    },
    {
      id: 'marriage_cert',
      // Using authentic U+2018 ‘ character
      title: "Nikoh to\u2018g\u2018risidagi guvohnoma",
      icon: '/assets/docs/marriage_cert.png',
      action: () => onOpenDocumentModal("Nikoh to\u2018g\u2018risidagi guvohnoma", "Nikoh qayd etilganligi haqidagi guvohnoma", 'marriage'),
    },
    {
      id: 'military_cert',
      title: 'Harbiy guvohnoma',
      icon: '/assets/docs/military_cert.png',
      action: () => onOpenDocumentModal('Harbiy guvohnoma', "Harbiy xizmatga aloqadorlik to'g'risida guvohnoma", 'military'),
    },
    {
      id: 'cadastre_passport',
      title: 'Kadastr pasport',
      icon: '/assets/docs/cadastre_passport.png',
      action: () => onOpenDocumentModal('Kadastr pasport', "Ko'chmas mulk ob'ektiga bo'lgan huquqlar va kadastr ma'lumotlari", 'cadastre'),
    },
  ];

  // Info items for Ma'lumotlar tab
  const infoItems = [
    {
      id: 'pinfl',
      title: 'JShShIR (PINFL)',
      detail: '31204986540021 • Tasdiqlangan',
    },
    {
      id: 'inps',
      title: 'INPS hisob raqami',
      detail: 'Xalq banki jamg\'arib boriladigan pensiya tizimi',
    },
    {
      id: 'inn',
      title: 'Soliq to\'lovchi identifikatsiya raqami (STIR)',
      detail: 'STIR: 549 281 903 • Faol',
    },
    {
      id: 'police_clearance',
      title: 'Sudlanmaganlik to\'g\'risida ma\'lumotnoma',
      detail: 'IIV axborot tizimi orqali berilgan',
    },
    {
      id: 'address',
      title: 'Doimiy yashash joyi bo\'yicha ro\'yxat',
      detail: 'Toshkent shahar, Yunusobod tumani',
    },
  ];

  return (
    <div 
      className="flex flex-col flex-1 w-full h-full overflow-y-auto overscroll-y-none bg-[#161616] text-white select-none pb-12"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* ================= TOP NAVIGATION ================= */}
      <nav className="px-4 pt-[env(safe-area-inset-top,0px)] pb-3 flex items-center z-20 shrink-0">
        <button
          onClick={() => (onBack ? onBack() : onNavigate('profile'))}
          aria-label="Orqaga"
          className="p-1 -ml-1 text-white active:scale-90 transition flex items-center justify-center cursor-pointer"
          type="button"
        >
          <svg className="w-7 h-7 stroke-white fill-none stroke-[2.4]" viewBox="0 0 24 24">
            <path d="M15.75 19.5L8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[19px] font-semibold text-white ml-2 tracking-tight">
          Raqamli hujjatlar va ma'lumotlar
        </h1>
      </nav>

      {/* ================= SEGMENTED TAB SWITCHER ================= */}
      {/* No gray border line beneath tabs! Blue indicator left: 0, width: 50%, height: 3px */}
      <div className="w-full shrink-0 relative">
        <div className="grid grid-cols-2 relative">
          {/* Tab 1: Elektron hujjatlar */}
          <button
            onClick={() => setActiveTab('docs')}
            className="pb-3 text-center transition-colors relative cursor-pointer"
          >
            <span className={`text-[15px] font-medium tracking-normal ${activeTab === 'docs' ? 'text-[#a9c4f5]' : 'text-[#8E94A0]'}`}>
              Elektron hujjatlar
            </span>
          </button>

          {/* Tab 2: Ma'lumotlar */}
          <button
            onClick={() => setActiveTab('info')}
            className="pb-3 flex items-center justify-center space-x-1.5 transition-colors relative cursor-pointer"
          >
            <span className={`text-[15px] font-medium tracking-normal ${activeTab === 'info' ? 'text-[#a9c4f5]' : 'text-[#8E94A0]'}`}>
              Ma'lumotlar
            </span>
            <span className="w-[7px] h-[7px] bg-[#61bc68] rounded-full inline-block"></span>
          </button>
        </div>

        {/* 50% width indicator starting from left: 0, height: 3px, #a9c4f5 */}
        <div 
          className="absolute bottom-0 h-[3px] bg-[#a9c4f5] transition-all duration-300 pointer-events-none"
          style={{
            left: activeTab === 'docs' ? '0%' : '50%',
            width: '50%',
          }}
        />
      </div>

      {/* ================= TAB 1: ELEKTRON HUJJATLAR (12 ITEMS) ================= */}
      {activeTab === 'docs' ? (
        <main className="flex-1 px-4 pt-1 overflow-y-auto">
          {documentItems.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className="h-[62px] flex items-center justify-between px-0 active:bg-white/[0.06] rounded-xl transition cursor-pointer select-none"
            >
              <div className="flex items-center min-w-0 flex-1 pr-2">
                {/* 41px Squircle Icon Box, radius 12 */}
                <div className="w-[41px] h-[41px] rounded-[12px] overflow-hidden shrink-0 bg-[#a9c4f5] flex items-center justify-center shadow-sm">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>
                {/* Text: 26px to the right of icon (ml-[26px]), whitespace: nowrap, all fit 1 line */}
                <span className="ml-[26px] text-[13.5px] sm:text-[14px] text-white font-normal whitespace-nowrap tracking-tight">
                  {item.title}
                </span>
              </div>

              {/* Right Chevron > (white, stroke-width 2.5) */}
              <div className="text-white shrink-0 pl-1">
                <svg className="w-4 h-4 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))}
        </main>
      ) : (
        /* ================= TAB 2: MA'LUMOTLAR ================= */
        <main className="flex-1 px-4 pt-3 overflow-y-auto space-y-2">
          {infoItems.map((info) => (
            <div
              key={info.id}
              onClick={() => onShowToast(`"${info.title}" nusxalandi`)}
              className="p-3.5 bg-[#1b1c22] rounded-[18px] border border-white/[0.06] active:border-white/20 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-white">{info.title}</span>
                <span className="text-[11px] text-[#a9c4f5] bg-[#a9c4f5]/10 px-2 py-0.5 rounded-full font-medium">Faol</span>
              </div>
              <p className="text-[13px] text-[#8e94a0] mt-1 font-normal">{info.detail}</p>
            </div>
          ))}
        </main>
      )}
    </div>
  );
};
