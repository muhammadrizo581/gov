import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#22252B]/95 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center space-x-2 pointer-events-none backdrop-blur-md transition-all duration-300">
      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span>{message}</span>
    </div>
  );
};
