import React from 'react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    onShowToast('PDF rasmiy hujjati yuklab olinmoqda...');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="sheet-backdrop absolute inset-0"></div>
      <div className="relative w-full max-w-[390px] bg-white text-neutral-900 rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-800 font-bold text-xs">
              UZB
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-neutral-800">O'ZBEKISTON RESPUBLIKASI</h3>
              <p className="text-[9px] text-neutral-500">Yagona interaktiv davlat xizmatlari portali</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Certificate Body */}
        <div className="my-4 space-y-3 text-xs">
          <div className="text-center py-1">
            <h4 className="font-bold text-sm text-neutral-900">ELEKTRON HUJJAT NUSXASI</h4>
            <p className="text-[10px] text-neutral-500">№ DG-2026-AE4451634</p>
          </div>

          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-neutral-500">F.I.SH.:</span>
              <span className="font-bold text-neutral-800">ABDULXAKIMOV MUHAMMADRIZO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tug'ilgan sanasi:</span>
              <span className="font-semibold text-neutral-800">04.04.2009</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ID Karta raqami:</span>
              <span className="font-mono font-bold text-sky-700">AE4451634</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Amal qilish muddati:</span>
              <span className="font-semibold text-neutral-800">02.10.2035</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">JSHSHIR:</span>
              <span className="font-mono font-semibold text-neutral-800">50404095430026</span>
            </div>
          </div>

          {/* Official Stamp & Legal note */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                E-IMZO bilan tasdiqlangan
              </span>
              <span className="text-[8px] text-neutral-400 mt-0.5">Yuridik kuchga ega rasmiy nusxa</span>
            </div>
            {/* Stamp Icon */}
            <div className="w-12 h-12 rounded-full border-2 border-emerald-600 border-dashed flex items-center justify-center text-emerald-700 text-[7px] font-black uppercase text-center rotate-12">
              MY.GOV<br />TASDIQ
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3 bg-[#198754] hover:bg-[#157347] active:scale-95 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>PDF faylini yuklab olish</span>
        </button>
      </div>
    </div>
  );
};
