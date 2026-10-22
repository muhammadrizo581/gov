import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  onDynamicIslandClick?: () => void;
  batteryLevel?: number;
  islandType?: 'airpods' | 'hotspot';
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  onDynamicIslandClick,
  batteryLevel = 24,
  islandType = 'airpods'
}) => {
  const [timeStr, setTimeStr] = useState('00:44');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full pt-3.5 pb-2 px-6 flex justify-between items-center z-30 text-white select-none shrink-0" data-purpose="ios-status-bar">
      {/* Time & Silent Indicator */}
      <div className="flex items-center space-x-1.5 min-w-[70px]">
        <span className="text-[16px] font-bold tracking-tight text-white">{timeStr}</span>
        {/* Silent Bell Icon with Diagonal Slash */}
        <svg className="w-3.5 h-3.5 fill-current text-white/90" viewBox="0 0 24 24">
          <path d="M19.36 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v1.68l2 2V10.04zM3.41 1.86L2 3.27l4.05 4.05C6.02 7.71 6 8.05 6 8.4V13l-2 2v2h13.73l2.86 2.86 1.41-1.41L3.41 1.86zM12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
        </svg>
      </div>

      {/* Dynamic Island Capsule */}
      <div 
        onClick={onDynamicIslandClick}
        className="h-[30px] w-[148px] bg-black rounded-full flex items-center px-3 justify-between shadow-2xl cursor-pointer hover:scale-[1.02] transition mx-auto"
      >
        {islandType === 'hotspot' ? (
          <>
            {/* Green Hotspot Chain Icon */}
            <div className="flex items-center text-[#30D158]">
              <svg className="w-4 h-4 stroke-current fill-none stroke-[2.2]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-3.35l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <div></div>
          </>
        ) : (
          <>
            {/* AirPods Icon */}
            <div className="flex items-center text-white/95">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 3a3 3 0 00-3 3v4a3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3zm0 8a1 1 0 01-1-1V6a1 1 0 012 0v4a1 1 0 01-1 1zm8-8a3 3 0 00-3 3v4a3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3zm0 8a1 1 0 01-1-1V6a1 1 0 012 0v4a1 1 0 01-1 1z" />
                <path d="M8 12v7a1.5 1.5 0 01-3 0v-2H3v2a3.5 3.5 0 007 0v-7H8zm8 0v7a1.5 1.5 0 01-3 0v-2h-2v2a3.5 3.5 0 007 0v-7h-2z" />
              </svg>
            </div>

            {/* Green Recording / Indicator Ring */}
            <div className="w-4 h-4 rounded-full border-[2.2px] border-[#30D158] flex items-center justify-center"></div>
          </>
        )}
      </div>

      {/* Signal, 5G, Battery */}
      <div className="flex items-center justify-end space-x-1.5 min-w-[70px]">
        {/* Cellular Dots */}
        <div className="flex items-center space-x-[2.5px]">
          <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
          <span className="w-[3.5px] h-[6px] bg-white rounded-xs"></span>
          <span className="w-[3.5px] h-[9px] bg-white rounded-xs"></span>
          <span className="w-[3.5px] h-[11px] bg-white/40 rounded-xs"></span>
        </div>

        {/* 5G */}
        <span className="text-[13px] font-bold text-white tracking-tight ml-0.5">5G</span>

        {/* Battery with Green Fill, percentage, Lightning */}
        <div className="flex items-center ml-0.5">
          <div className="border border-white/70 rounded-[5px] px-[2px] py-[1px] flex items-center h-[14px] w-[27px] relative bg-black/40 overflow-hidden">
            <div className="bg-[#30D158] absolute left-0 top-0 bottom-0 rounded-l-[3px]" style={{ width: `${Math.min(100, Math.max(10, batteryLevel))}%` }}></div>
            <span className="text-[9px] font-black text-white relative z-10 leading-none pl-0.5">{batteryLevel}</span>
            {/* Lightning bolt */}
            <svg className="w-2.5 h-2.5 fill-white relative z-10 ml-auto" viewBox="0 0 24 24">
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
          </div>
          <div className="w-[1.5px] h-[4px] bg-white/60 rounded-r-xs ml-[1px]"></div>
        </div>
      </div>
    </header>
  );
};
