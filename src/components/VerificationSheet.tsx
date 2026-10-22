import React, { useState, useEffect } from 'react';

interface VerificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const VerificationSheet: React.FC<VerificationSheetProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(179);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsRemaining(179);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 179));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleReset = () => {
    setSecondsRemaining(179);
    onShowToast('QR kod yangilandi');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div onClick={onClose} className="sheet-backdrop absolute inset-0"></div>
      <div className="sheet-enter relative w-full max-w-[430px] mx-auto bg-[#181B20] border-t border-white/10 rounded-t-[32px] p-6 text-white shadow-2xl flex flex-col items-center z-10 max-h-[90vh] overflow-y-auto">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-neutral-600 rounded-full mb-4"></div>

        {/* Header */}
        <h2 className="text-lg font-bold tracking-tight text-center">Hujjatni tekshirish uchun QR kod</h2>
        <p className="text-xs text-neutral-400 mt-1 text-center">Tashkilot xodimi tekshirishi uchun ushbu QR kodni ko'rsating</p>

        {/* QR Code Container */}
        <div className="relative mt-5 p-4 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="relative w-[190px] h-[190px] bg-white flex items-center justify-center overflow-hidden rounded-xl">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              {/* Position markers */}
              <rect x="5" y="5" width="24" height="24" rx="4" fill="#000" />
              <rect x="9" y="9" width="16" height="16" rx="2" fill="#fff" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#000" />

              <rect x="71" y="5" width="24" height="24" rx="4" fill="#000" />
              <rect x="75" y="9" width="16" height="16" rx="2" fill="#fff" />
              <rect x="79" y="13" width="8" height="8" rx="1.5" fill="#000" />

              <rect x="5" y="71" width="24" height="24" rx="4" fill="#000" />
              <rect x="9" y="75" width="16" height="16" rx="2" fill="#fff" />
              <rect x="13" y="79" width="8" height="8" rx="1.5" fill="#000" />

              {/* Data modules */}
              <rect x="35" y="8" width="5" height="5" fill="#000" />
              <rect x="45" y="8" width="5" height="5" fill="#000" />
              <rect x="55" y="8" width="5" height="5" fill="#000" />
              <rect x="35" y="18" width="5" height="5" fill="#000" />
              <rect x="50" y="18" width="5" height="5" fill="#000" />

              <rect x="8" y="35" width="5" height="5" fill="#000" />
              <rect x="18" y="35" width="5" height="5" fill="#000" />
              <rect x="8" y="45" width="5" height="5" fill="#000" />
              <rect x="23" y="45" width="5" height="5" fill="#000" />
              <rect x="13" y="55" width="5" height="5" fill="#000" />

              <rect x="75" y="35" width="5" height="5" fill="#000" />
              <rect x="85" y="35" width="5" height="5" fill="#000" />
              <rect x="80" y="45" width="5" height="5" fill="#000" />
              <rect x="75" y="55" width="5" height="5" fill="#000" />
              <rect x="85" y="55" width="5" height="5" fill="#000" />

              <rect x="35" y="75" width="5" height="5" fill="#000" />
              <rect x="45" y="75" width="5" height="5" fill="#000" />
              <rect x="55" y="75" width="5" height="5" fill="#000" />
              <rect x="40" y="85" width="5" height="5" fill="#000" />
              <rect x="50" y="85" width="5" height="5" fill="#000" />
              <rect x="60" y="85" width="5" height="5" fill="#000" />

              {/* Center Verified Icon */}
              <rect x="33" y="33" width="34" height="34" rx="4" fill="#f8fafc" />
              <circle cx="50" cy="50" r="14" fill="#0ea5e9" />
              <path d="M44 50l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Sweep Animation Laser */}
            <div className="scanner-line absolute left-0 right-0 h-0.5 bg-sky-500 shadow-[0_0_10px_#0ea5e9] pointer-events-none"></div>
          </div>

          {/* Countdown Pill */}
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-neutral-800 font-semibold bg-neutral-100 px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Amal qilish muddati: <span className="text-sky-700 font-bold">{timeFormatted}</span></span>
          </div>
        </div>

        {/* Verification Info */}
        <div className="w-full mt-4 bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-400">Fuqaro:</span>
            <span className="font-bold text-white uppercase">Abdulxakimov Muhammadrizo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Karta raqami:</span>
            <span className="font-mono font-bold text-sky-400">AE4451634</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Holati:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Haqiqiy (Davlat reyestrida faol)
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full mt-5 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-[#24272E] hover:bg-[#2d313a] active:scale-95 rounded-2xl text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yangilash
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#92BCF4] hover:bg-[#a3c9fa] active:scale-95 rounded-2xl text-xs font-bold text-[#0D1C33] transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
