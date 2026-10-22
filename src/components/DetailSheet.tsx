import React from 'react';
import { SheetData } from '../types';

interface DetailSheetProps {
  data: SheetData | null;
  onClose: () => void;
}

export const DetailSheet: React.FC<DetailSheetProps> = ({ data, onClose }) => {
  if (!data) return null;

  const renderContent = () => {
    switch (data.type) {
      case 'applications':
        return (
          <div className="space-y-2">
            <div className="p-3 bg-neutral-900/80 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">ID-karta rasmiylashtirish</p>
                <p className="text-[10px] text-neutral-400">Ariza № 842109 • 03.10.2025</p>
              </div>
              <span className="bg-emerald-900/70 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">Bajarilgan</span>
            </div>
            <div className="p-3 bg-neutral-900/80 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Yashash joyidan ma'lumotnoma</p>
                <p className="text-[10px] text-neutral-400">Ariza № 540112 • 12.09.2026</p>
              </div>
              <span className="bg-emerald-900/70 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">Berilgan</span>
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-400">Biriktirilgan poliklinika:</span><span className="font-medium text-white">52-sonli oilaviy poliklinika</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Qon guruhi:</span><span className="font-bold text-sky-400">O (I) Rh+</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Emlash holati:</span><span className="font-medium text-emerald-400">To'liq emlangan</span></div>
          </div>
        );
      case 'family':
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-400">Otasi:</span><span className="font-medium text-white">Abdulxakimov Abdulvosid</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Oilaviy holati:</span><span className="font-medium text-white">Turmush qurmagan</span></div>
          </div>
        );
      case 'house':
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-400">Doimiy ro'yxat:</span><span className="font-medium text-white">Toshkent shahar, Yunusobod tumani</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Mulk huquqi:</span><span className="font-medium text-emerald-400">Ro'yxatga olingan</span></div>
          </div>
        );
      case 'work':
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-400">Elektron mehnat daftarchasi:</span><span className="font-medium text-white">Faol</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Mehnat staji:</span><span className="font-medium text-white">O'z-o'zini band qilgan (IT)</span></div>
          </div>
        );
      case 'transport':
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-400">Avtotransport:</span><span className="font-medium text-neutral-400">Nomida mavjud emas</span></div>
          </div>
        );
      case 'taxes':
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-400">Soliq qarzdorligi:</span><span className="font-bold text-emerald-400">0.00 so'm (Qarz yo'q)</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">MIB ijro ishi:</span><span className="font-bold text-emerald-400">Mavjud emas</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Chetga chiqishga ta'qiq:</span><span class="font-bold text-emerald-400">Ta'qiq yo'q</span></div>
          </div>
        );
      case 'doc-detail':
        return (
          <div className="bg-neutral-900/80 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Holati:</span>
              <span className="font-semibold text-emerald-400">Faol reyestrda</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Tafsilot:</span>
              <span className="font-medium text-white">{data.detail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">E-Imzo:</span>
              <span className="font-mono text-[10px] text-sky-400">TASDIQLANGAN</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-3.5 bg-neutral-900/80 rounded-xl border border-white/5">
            <p className="text-white">{data.detail || "Ma'lumotlar yuklanmoqda..."}</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div onClick={onClose} className="sheet-backdrop absolute inset-0"></div>
      <div className="sheet-enter relative w-full max-w-[430px] mx-auto bg-[#181B20] border-t border-white/10 rounded-t-[32px] p-6 text-white shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-neutral-600 rounded-full mx-auto mb-4"></div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white">{data.title}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="my-4 text-xs space-y-3">
          {renderContent()}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#24272E] hover:bg-[#2e323b] active:scale-95 rounded-2xl text-xs font-semibold text-white transition"
        >
          Yopish
        </button>
      </div>
    </div>
  );
};
