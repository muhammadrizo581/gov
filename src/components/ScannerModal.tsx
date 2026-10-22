import React, { useState } from 'react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [torchOn, setTorchOn] = useState(false);

  if (!isOpen) return null;

  const handleToggleTorch = () => {
    setTorchOn(!torchOn);
    onShowToast(!torchOn ? "Chiroq yoqildi" : "Chiroq o'chirildi");
  };

  const handleSimulateScan = () => {
    onClose();
    onShowToast("QR kod tasdiqlandi: Davlat xizmati ma'lumotnomasi № 41209");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-sm font-semibold tracking-wide">QR Kod Skaneri</span>
        <button
          onClick={handleToggleTorch}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            torchOn ? 'bg-amber-400 text-black' : 'bg-white/10 text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Reticle Frame */}
      <div className="relative w-64 h-64 mx-auto border-2 border-sky-400 rounded-3xl flex items-center justify-center overflow-hidden">
        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-lg"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-lg"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-lg"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-lg"></div>

        <div className="scanner-line absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_12px_#ef4444]"></div>
        <span className="text-xs text-white/60 tracking-wider font-mono">QR kodni joylang</span>
      </div>

      <div className="text-center pb-6">
        <p className="text-xs text-neutral-400">my.gov.uz yoki davlat xizmatlari QR kodini skanerlang</p>
        <button
          onClick={handleSimulateScan}
          className="mt-4 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 rounded-full text-xs font-bold text-white shadow-lg active:scale-95 transition"
        >
          Sinov skanerlash (Test Scan)
        </button>
      </div>
    </div>
  );
};
