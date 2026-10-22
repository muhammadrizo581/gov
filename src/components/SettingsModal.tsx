import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div onClick={onClose} className="sheet-backdrop absolute inset-0"></div>
      <div className="sheet-enter relative w-full max-w-[430px] mx-auto bg-[#181B20] border-t border-white/10 rounded-t-[32px] p-6 text-white shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-neutral-600 rounded-full mx-auto mb-4"></div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white">Sozlamalar</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="my-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl">
            <span className="text-neutral-300">Ilova tili</span>
            <span className="text-sky-400 font-semibold">O'zbekcha</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl">
            <span className="text-neutral-300">Mavzu (Theme)</span>
            <span className="text-neutral-400 font-semibold">To'q (Dark Mode)</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl">
            <span className="text-neutral-300">Biometriya (Face ID)</span>
            <span className="text-emerald-400 font-semibold">Yoqilgan</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl">
            <span className="text-neutral-300">Versiya</span>
            <span className="text-neutral-500 font-mono">v2.4.1 (React Build)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#24272E] hover:bg-[#2e323b] active:scale-95 rounded-2xl text-xs font-semibold text-white transition"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
};
