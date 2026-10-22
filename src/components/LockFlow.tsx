import React, { useState, useEffect } from 'react';

interface LockFlowProps {
  onUnlock: () => void;
}

type LockStage = 'splash' | 'to-pin' | 'pin' | 'unlocking';

const CORRECT_PIN = '0000';
const PIN_LENGTH = 4;
const BRAND_TEXT = 'my.gov.uz';

// Splash timeline (ms), measured from the native app screen recording
const LOGO_DELAY = 300;
const TYPING_START = 650;
const TYPING_STEP = 45;
const STATUS_TIMELINE: { at: number; text: string; done?: boolean }[] = [
  { at: 2000, text: "Ma'lumotlarni yuklash" },
  { at: 2350, text: 'Yana biroz kuting' },
  { at: 3300, text: 'Barchasi tayyor', done: true },
];
const SPLASH_END = 3900;

// ================= ICONS =================
const BrandLogo = () => (
  <svg className="w-[46px] h-[46px]" viewBox="0 0 48 48" fill="none">
    <rect x="3" y="3" width="26" height="26" rx="5" stroke="white" strokeWidth="2.6" />
    <rect x="9.5" y="9.5" width="26" height="26" rx="5" fill="#0256d6" stroke="white" strokeWidth="2.6" />
    <rect x="16" y="16" width="29" height="29" rx="5.5" fill="white" />
    <path d="M23 30.5l5 5 10-11" stroke="#0256d6" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BackspaceIcon = () => (
  <svg className="w-[30px] h-[30px]" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.6 5h10.9A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5H8.6a1.5 1.5 0 01-1.1-.5L2.5 12l5-6.5a1.5 1.5 0 011.1-.5z" />
    <path d="M11.5 9.5l5 5M16.5 9.5l-5 5" />
  </svg>
);

const Spinner = () => (
  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
    <path d="M21 12a9 9 0 00-9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ================= COMPONENT =================
export const LockFlow: React.FC<LockFlowProps> = ({ onUnlock }) => {
  const [stage, setStage] = useState<LockStage>('splash');
  const [logoShown, setLogoShown] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [statusIndex, setStatusIndex] = useState(-1);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Splash timeline
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setLogoShown(true), LOGO_DELAY));
    for (let i = 1; i <= BRAND_TEXT.length; i++) {
      timers.push(setTimeout(() => setTypedChars(i), TYPING_START + i * TYPING_STEP));
    }
    STATUS_TIMELINE.forEach((s, i) => timers.push(setTimeout(() => setStatusIndex(i), s.at)));
    timers.push(setTimeout(() => setStage('to-pin'), SPLASH_END));
    timers.push(setTimeout(() => setStage('pin'), SPLASH_END + 260));
    return () => timers.forEach(clearTimeout);
  }, []);

  const unlock = () => {
    setStage('unlocking');
    setTimeout(onUnlock, 300);
  };

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH || stage === 'unlocking') return;
    const next = pin + digit;
    setPinError(false);
    setPin(next);
    if (next.length === PIN_LENGTH) {
      if (next === CORRECT_PIN) {
        setTimeout(unlock, 150);
      } else {
        setTimeout(() => setPinError(true), 150);
        setTimeout(() => setPin(''), 650);
      }
    }
  };

  const handleBackspace = () => {
    setPinError(false);
    setPin((prev) => prev.slice(0, -1));
  };

  const showPin = stage !== 'splash';
  const pinOnScreen = stage === 'pin' || stage === 'unlocking';
  const status = statusIndex >= 0 ? STATUS_TIMELINE[statusIndex] : null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[3000] overflow-hidden select-none transition-opacity duration-300 bg-[#1b1b1b]"
      style={{ height: 'var(--app-height, 100%)', opacity: stage === 'unlocking' ? 0 : 1 }}
    >
      {/* ================= SPLASH ================= */}
      <div
        className="absolute inset-0 bg-[#0256d6] flex flex-col items-center page-transition-anim"
        style={{
          transform: pinOnScreen ? 'translateX(-30%)' : 'translateX(0%)',
          filter: pinOnScreen ? 'brightness(0.9)' : 'brightness(1)',
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center -mt-[8%]">
          <div
            className="transition-all duration-[400ms]"
            style={{
              transform: logoShown ? 'scale(1)' : 'scale(0.1)',
              opacity: logoShown ? 1 : 0,
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <BrandLogo />
          </div>
          <div
            className="h-[32px] mt-1.5 text-white text-[23px] tracking-[0.2px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
          >
            {BRAND_TEXT.slice(0, typedChars)}
          </div>
        </div>

        {/* Footer: status line + Raqamli hukumat + UZINFOCOM, slides up on launch */}
        <div
          className="w-full flex flex-col items-center transition-transform duration-500 ease-out"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)',
            transform: logoShown ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <div className="h-5 mb-2.5 flex items-center gap-1.5 text-white/90 text-[13px] font-normal">
            {status && (
              <>
                {status.done ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <Spinner />
                )}
                <span>{status.text}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <svg className="w-8 h-6" viewBox="0 0 32 24" fill="white">
              {Array.from({ length: 24 }).map((_, i) => (
                <circle key={i} cx={2 + (i % 6) * 5 + Math.floor(i / 6) * 1.5} cy={3 + Math.floor(i / 6) * 5} r={0.9 + (i % 6) * 0.12} opacity={0.55 + (i % 6) * 0.08} />
              ))}
            </svg>
            <div className="leading-[13px]">
              <div className="text-white text-[10.5px] font-semibold">Raqamli hukumat</div>
              <div className="text-white/80 text-[10px] font-normal">loyihalarini boshqarish</div>
              <div className="text-white/80 text-[10px] font-normal">markazi</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-white text-[19px] tracking-[0.5px]" style={{ fontWeight: 600 }}>
            <svg className="w-[17px] h-[17px]" viewBox="0 0 20 20" fill="white">
              <path d="M1 1h18v18H1z M4 4v12h12V4z" fillRule="evenodd" />
              <path d="M6 6h3v3H6zM11 11h3v3h-3zM11 6h3v3h-3z" />
            </svg>
            UZINFOCOM
          </div>
        </div>
      </div>

      {/* ================= PIN SCREEN ================= */}
      {showPin && (
        <div
          className="absolute inset-0 bg-[#1b1b1b] flex flex-col items-center page-transition-anim page-shadow-edge"
          style={{
            transform: pinOnScreen ? 'translateX(0%)' : 'translateX(100%)',
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 46px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 22px)',
          }}
        >
          <h1 className="text-white text-[15px] font-semibold tracking-[0.2px]">PIN-kodni kiriting</h1>

          {/* 4 PIN circles */}
          {/* The circle with the caret grows (52 -> 74px) and pushes its neighbours, like the app */}
          <div className={`h-[74px] flex items-center gap-[7px] mt-[12px] ${pinError ? 'pin-shake' : ''}`}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => {
              const filled = i < pin.length;
              const isCaret = i === pin.length && !pinError;
              return (
                <div
                  key={i}
                  className={`rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ease-out ${
                    isCaret ? 'w-[74px] h-[74px]' : 'w-[52px] h-[52px]'
                  } ${pinError ? 'bg-[#4a2323]' : 'bg-[#2c2c2c]'}`}
                >
                  {filled && <div className={`w-[6px] h-[6px] rounded-full pin-dot-in ${pinError ? 'bg-[#ff6b6b]' : 'bg-white'}`} />}
                  {isCaret && <div className="w-[2px] h-[22px] rounded-full bg-white/80 pin-caret" />}
                </div>
              );
            })}
          </div>

          <div className="h-6 mt-3 text-[13px] font-normal text-[#ff6b6b]">
            {pinError ? "PIN-kod noto'g'ri" : ''}
          </div>

          {/* Keypad */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="grid grid-cols-3 gap-x-[14px] gap-y-[8px] w-[288px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDigit(d)}
                  className="h-[72px] rounded-full text-white text-[22px] font-semibold flex items-center justify-center active:bg-white/[0.08] transition-colors"
                >
                  {d}
                </button>
              ))}
              {/* Face ID is disabled: PIN only */}
              <div />
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="h-[72px] rounded-full text-white text-[22px] font-semibold flex items-center justify-center active:bg-white/[0.08] transition-colors"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                aria-label="O'chirish"
                className="h-[72px] rounded-full flex items-center justify-center active:bg-white/[0.08] transition-colors"
              >
                <BackspaceIcon />
              </button>
            </div>
          </div>

          <button type="button" className="text-white/90 text-[13px] font-medium underline underline-offset-2">
            PIN kodni unutdingizmi ?
          </button>
        </div>
      )}

    </div>
  );
};
