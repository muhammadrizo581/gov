import React, { useState, useRef, useEffect } from 'react';
import { Screen } from '../types';
import { BottomNav } from './BottomNav';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onOpenServiceModal: (title: string, detail: string) => void;
  onShowToast: (msg: string) => void;
  onOpenQrScanner?: () => void;
  onOpenNavTab?: (tab: string) => void;
}

interface WidgetItem {
  id: string;
  title: string;
  status: string;
  iconBoxBg: string;
  modalTitle: string;
  modalDetail: string;
  icon: React.ReactNode;
  watermark: React.ReactNode;
}

interface WidgetPage {
  id: number;
  widgets: WidgetItem[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenServiceModal,
  onShowToast,
  onOpenQrScanner = () => {},
  onOpenNavTab = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(true);

  // Stories
  const stories = [
    { id: 1, title: 'Byurokratiyasiz', img: '/assets/story_1.png' },
    { id: 2, title: 'Karta', img: '/assets/story_2.png' },
    { id: 3, title: "Bog'cha", img: '/assets/story_3.png' },
    { id: 4, title: 'Keshbek qaytarish', img: '/assets/story_4.png' },
    { id: 5, title: 'SOS yuborish', img: '/assets/story_5.png' },
  ];

  // 5 widgets split into 3 pages:
  // Page 1: Soliqlar (grey icon) + YHQ jarimalari (pink icon)
  // Page 2: Kommunal xizmatlar (teal) + Xorijga chiqishga cheklov (blue)
  // Page 3: Alimentlar (blue), alone, taking full page width
  const widgetPages: WidgetPage[] = [
    {
      id: 1,
      widgets: [
        {
          id: 'tax',
          title: "Soliqlar",
          status: "Mavjud emas",
          iconBoxBg: "bg-[#2c2c2e] border border-white/10 text-white",
          modalTitle: "Soliqlar",
          modalDetail: "Davlat soliq qo'mitasi bo'yicha qarzdorlik aniqlanmadi.",
          icon: (
            <svg className="w-5 h-5 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          watermark: (
            <svg className="w-6 h-6 stroke-white fill-none stroke-[1.8]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          id: 'yhq',
          title: "YHQ jarimalari",
          status: "Mavjud emas",
          iconBoxBg: "bg-[#e91e63]/25 border border-[#ff4081]/40 text-[#ff4081]",
          modalTitle: "YHQ jarimalari",
          modalDetail: "Yo'l harakati xavfsizligi bo'yicha to'lanmagan jarimalar yo'q.",
          icon: (
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25H9.75M9.75 7.5H4.872a2.056 2.056 0 00-1.92 1.341L1.5 13.5v3" />
            </svg>
          ),
          watermark: (
            <svg className="w-6 h-6 stroke-[#ff4081] fill-none stroke-[1.8]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25H9.75M9.75 7.5H4.872a2.056 2.056 0 00-1.92 1.341L1.5 13.5v3" />
            </svg>
          ),
        },
      ],
    },
    {
      id: 2,
      widgets: [
        {
          id: 'kommunal',
          title: "Kommunal xizmatlar",
          status: "Mavjud emas",
          iconBoxBg: "bg-[#008ba3]/25 border border-[#008ba3]/40 text-[#26c6da]",
          modalTitle: "Kommunal xizmatlar",
          modalDetail: "Elektr, Gaz, Suv va Issiqlik energiyasi bo'yicha qarzdorlik mavjud emas.",
          icon: (
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          ),
          watermark: (
            <svg className="w-6 h-6 stroke-[#26c6da] fill-none stroke-[1.8]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          ),
        },
        {
          id: 'cheklov',
          title: "Xorijga chiqishga cheklov",
          status: "Mavjud emas",
          iconBoxBg: "bg-[#0288d1]/25 border border-[#0288d1]/40 text-[#29b6f6]",
          modalTitle: "Xorijga chiqishga cheklov",
          modalDetail: "MIB va boshqa organlar tomonidan xorijga chiqish bo'yicha hech qanday taqiq yoki cheklov yo'q.",
          icon: (
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          ),
          watermark: (
            <svg className="w-6 h-6 stroke-[#29b6f6] fill-none stroke-[1.8]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          ),
        },
      ],
    },
    {
      id: 3,
      widgets: [
        {
          id: 'aliment',
          title: "Alimentlar",
          status: "Mavjud emas",
          iconBoxBg: "bg-[#1976d2]/25 border border-[#1976d2]/40 text-[#42a5f5]",
          modalTitle: "Alimentlar",
          modalDetail: "MIB ijro ishlari bo'yicha aliment qarzdorligi aniqlanmadi.",
          icon: (
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-8 5 8 2 8-2-8-5zm-8 5v5a4 4 0 008 0V8m8 0v5a4 4 0 01-8 0V8" />
            </svg>
          ),
          watermark: (
            <svg className="w-6 h-6 stroke-[#42a5f5] fill-none stroke-[1.8]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-8 5 8 2 8-2-8-5zm-8 5v5a4 4 0 008 0V8m8 0v5a4 4 0 01-8 0V8" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Carousel infinite slides: [Page 3 clone, Page 1, Page 2, Page 3, Page 1 clone]
  const carouselSlides = [
    widgetPages[2],
    widgetPages[0],
    widgetPages[1],
    widgetPages[2],
    widgetPages[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef(0);
  const touchDeltaXRef = useRef(0);

  const AUTOPLAY_MS = 2000;
  const RESUME_MS = 3000;

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const pauseAutoPlay = () => {
    clearResumeTimer();
    setIsPaused(true);
  };

  const scheduleResume = () => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      setIsPaused(false);
    }, RESUME_MS);
  };

  // Single autoplay interval, driven only by isPaused
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => Math.min(prev + 1, 4));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused]);

  // Seamless infinite loop wrap-around after 400ms transition
  useEffect(() => {
    if (currentIndex === 4) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (currentIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(3);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Re-enable the transition two frames after the silent loop jump
  useEffect(() => {
    if (isTransitioning) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsTransitioning(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isTransitioning]);

  // Pause while the app is in background
  useEffect(() => {
    const handleVisibilityChange = () => {
      clearResumeTimer();
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearResumeTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    pauseAutoPlay();
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleCarouselTouchMove = (e: React.TouchEvent) => {
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleCarouselTouchEnd = () => {
    const deltaX = touchDeltaXRef.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        // Swipe left -> advance
        setIsTransitioning(true);
        setCurrentIndex((prev) => Math.min(prev + 1, 4));
      } else {
        // Swipe right -> previous
        setIsTransitioning(true);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    touchDeltaXRef.current = 0;
    scheduleResume();
  };

  const handleDotClick = (dotIdx: number) => {
    pauseAutoPlay();
    setIsTransitioning(true);
    setCurrentIndex(dotIdx + 1);
    scheduleResume();
  };

  const handleRefreshWidgets = () => {
    setIsRefreshing(true);
    onShowToast("Vidjetlar yangilandi");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Active dot index calculation
  const activeDotIndex = currentIndex === 0 ? 2 : currentIndex === 4 ? 0 : currentIndex - 1;

  // Popular Services
  const popularServices = [
    {
      id: 1,
      title: "Soliqdan qarzi mavjud emasligi haqida ma'lumotnoma",
      rating: '4.66',
      time: '1.0 min',
      users: '5 mln',
      iconType: 'document',
    },
    {
      id: 2,
      title: "Hisoblangan ish haqi (oylik) ma'lumotlari",
      rating: '4.8',
      time: '1.0 min',
      users: '11,9 mln',
      iconType: 'salary',
    },
    {
      id: 3,
      title: "Bolani bog'chaga joylashtirish",
      rating: '4.71',
      time: '4.0 min',
      users: '11,5 mln',
      iconType: 'kindergarten',
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#161616]">
      {/* Scrollable Container */}
      <div 
        className="flex flex-col flex-1 w-full overflow-y-auto overscroll-y-none overflow-x-hidden pb-28 text-white select-none bg-[#161616]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* ================= FON RASMI (top 0, width 100vw, fade to #161616) ================= */}
        <div 
          className="absolute top-0 left-0 right-0 w-full h-[620px] pointer-events-none z-0 bg-no-repeat bg-top"
          style={{
            backgroundImage: `url('/assets/samarqand_bg_exact.png')`,
            backgroundSize: '100% auto',
          }}
        >
          {/* Smooth gradient fade to #161616 at bottom 30% */}
          <div 
            className="w-full h-full"
            style={{ background: 'linear-gradient(to bottom, transparent 70%, #161616)' }}
          />
        </div>

        <div className="relative z-10 flex flex-col px-4 pt-[env(safe-area-inset-top,0px)]">
          {/* ================= TOP ACTION BAR (TINIQ, BLURSIZ) ================= */}
          <div className="flex items-center justify-between mt-1 mb-3.5">
            {/* Hamburger Menu Circle Button */}
            <button 
              onClick={() => onShowToast("Asosiy menyu")}
              className="w-11 h-11 rounded-full bg-black/60 border border-white/10 flex flex-col items-center justify-center space-y-[4px] text-white active:scale-95 transition shadow-lg cursor-pointer"
            >
              <span className="w-[18px] h-[2.5px] bg-white rounded-full"></span>
              <span className="w-[18px] h-[2.5px] bg-white rounded-full"></span>
              <span className="w-[18px] h-[2.5px] bg-white rounded-full"></span>
            </button>

            {/* Right Action Pill: Chat + Notification */}
            <div className="h-11 px-3.5 bg-black/60 border border-white/10 rounded-full flex items-center space-x-3.5 shadow-lg">
              {/* Chat Icon */}
              <button 
                onClick={() => onShowToast("Yozishmalar")}
                className="text-white active:scale-95 transition cursor-pointer"
              >
                <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
                </svg>
              </button>

              {/* Notification Bell Icon WITH red dot ONLY when unread notification exists */}
              <button 
                onClick={() => onShowToast("Bildirishnomalar")}
                className="text-white active:scale-95 transition flex items-center justify-center cursor-pointer relative"
              >
                <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {showLoginNotification && (
                  <span className="absolute top-[1px] right-[1px] w-2 h-2 rounded-full bg-[#ef4444]" />
                )}
              </button>
            </div>
          </div>

          {/* ================= GREETING & USER NAME ================= */}
          <div className="mb-3.5 px-0.5">
            <p className="text-white/90 text-[14px] font-normal leading-snug">Xush kelibsiz</p>
            <h1 className="text-white text-[22px] font-semibold tracking-tight leading-tight mt-0.5">
              Muhammadrizo Abdulxakimov
            </h1>
          </div>

          {/* ================= STORIES CAROUSEL ================= */}
          <div className="flex space-x-2.5 overflow-x-auto pb-1.5 -mx-4 px-4 scrollbar-none">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => onShowToast(`"${story.title}" bo'limi ochilmoqda`)}
                className="shrink-0 w-[74px] h-[114px] rounded-[20px] overflow-hidden shadow-lg border border-white/10 bg-black/40 cursor-pointer active:scale-95 transition-transform"
              >
                <img
                  src={story.img}
                  alt={story.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            ))}
            {/* Peeking 6th Story Item */}
            <div className="shrink-0 w-[24px] h-[114px] rounded-l-[20px] overflow-hidden shadow-lg border-l border-t border-b border-white/10 bg-[#008ba3]/40"></div>
          </div>

          {/* ================= VIDJETLAR (5 WIDGETS IN 3 PAGES) ================= */}
          <div className="mt-3.5" data-purpose="widgets-section">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <h2 className="text-[17px] font-semibold text-white tracking-tight">Vidjetlar</h2>
              <div className="flex items-center space-x-3 text-neutral-300">
                {/* Single Circular Arrow Refresh (Spins 360° on tap) */}
                <button 
                  onClick={handleRefreshWidgets}
                  className="active:opacity-70 transition p-1 cursor-pointer"
                  title="Yangilash"
                >
                  <svg 
                    className={`w-[18px] h-[18px] stroke-white fill-none stroke-[2.4] transition-transform duration-500 ${
                      isRefreshing ? 'rotate-[360deg]' : ''
                    }`} 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12 7.858 4.5 12 4.5c2.43 0 4.593 1.156 5.969 2.946M19.5 4.5v3.5h-3.5" />
                  </svg>
                </button>
                {/* Settings Cog */}
                <button 
                  onClick={() => onShowToast("Vidjetlar sozlamalari")}
                  className="active:opacity-70 transition p-1 cursor-pointer"
                  title="Sozlamalar"
                >
                  <svg className="w-[18px] h-[18px] stroke-white fill-none stroke-[2.2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Carousel: 3 Pages (5 widgets) with seamless 3s autoplay & loop */}
            <div className="relative w-full overflow-hidden">
              <div 
                className="flex"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: isTransitioning ? 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                  willChange: 'transform',
                }}
                onTouchStart={handleCarouselTouchStart}
                onTouchMove={handleCarouselTouchMove}
                onTouchEnd={handleCarouselTouchEnd}
                onTouchCancel={handleCarouselTouchEnd}
              >
                {carouselSlides.map((page, pIdx) => (
                  <div key={pIdx} className="w-full shrink-0 flex gap-2.5 px-0.5">
                    {page.widgets.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => onOpenServiceModal(w.modalTitle, w.modalDetail)}
                        className={`h-[92px] bg-[#1f1f1f] border border-white/[0.12] rounded-[20px] p-2.5 flex flex-col justify-between relative overflow-hidden cursor-pointer active:scale-[0.98] transition shadow-md ${
                          page.widgets.length === 1 ? 'w-full' : 'flex-1 min-w-0'
                        }`}
                      >
                        {/* Top-right large faded watermark icon inside a circle */}
                        <div className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center pointer-events-none opacity-25">
                          {w.watermark}
                        </div>

                        {/* Left: 40px colored icon box + title (max 2 lines, no truncation) */}
                        <div className="flex items-start gap-2.5 pr-8">
                          <div className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center shrink-0 ${w.iconBoxBg}`}>
                            {w.icon}
                          </div>
                          <span className="text-[12.5px] font-medium text-white leading-[16px] line-clamp-2">
                            {w.title}
                          </span>
                        </div>

                        {/* Bottom: "Mavjud emas" (grey) and a ">" chevron */}
                        <div className="flex items-center justify-between text-[#8e94a0] pt-1">
                          <span className="text-[11.5px] font-normal text-[#8e94a0]">{w.status}</span>
                          <svg className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Pagination Dots: active is 20x6px pill, inactive 6px circle */}
            <div className="flex items-center justify-center space-x-1.5 mt-2.5">
              {[0, 1, 2].map((dotIdx) => {
                const isActive = activeDotIndex === dotIdx;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => handleDotClick(dotIdx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive 
                        ? 'w-[20px] h-[6px] bg-[#9ec6f8]' 
                        : 'w-[6px] h-[6px] bg-[#4b5563]'
                    }`}
                    aria-label={`Vidjetlar sahifasi ${dotIdx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* ================= SEARCH INPUT ================= */}
          <div className="mt-3.5">
            <div 
              onClick={() => onShowToast("Qidiruv")}
              className="w-full h-[48px] bg-[#222222] border-0 rounded-[24px] px-4 flex items-center space-x-2.5 text-neutral-400 cursor-pointer active:opacity-85 transition"
            >
              <svg className="w-4 h-4 stroke-current fill-none text-[#8e94a0] shrink-0 stroke-[2.2]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Xizmatni izlang"
                className="w-full bg-transparent text-white placeholder-[#8e94a0] text-[14px] font-normal outline-none text-center pr-4"
              />
            </div>
          </div>

          {/* ================= YELLOW DISMISSIBLE NOTIFICATION CARD ================= */}
          {showLoginNotification && (
            <div className="mt-3 bg-[#fdf3d6] rounded-[20px] p-3.5 text-[#1a1a1a] flex items-start space-x-3 relative shadow-md">
              <div className="w-8 h-8 rounded-full bg-[#fae8b2] flex items-center justify-center shrink-0 mt-0.5 text-[#d97706]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-[14px] font-semibold text-[#1a1a1a] leading-tight">
                  Profilga kirildi
                </h4>
                <p className="text-[12.5px] text-[#4a4a4a] mt-1 leading-snug">
                  Qurilma: Apple iPhone, Vaqt: 2026-10-23 02:08:40.
                </p>
                <button 
                  onClick={() => onShowToast("Profil xavfsizligi bo'limi")}
                  className="text-[13px] font-semibold text-[#1565c0] mt-1.5 inline-block active:opacity-75 cursor-pointer"
                >
                  Ochish
                </button>
              </div>
              <button
                onClick={() => {
                  setShowLoginNotification(false);
                  onShowToast("Bildirishnoma o'chirildi");
                }}
                className="absolute top-3 right-3 text-[#71717a] hover:text-[#18181b] p-1 cursor-pointer active:scale-90 transition"
                aria-label="Yopish"
              >
                <svg className="w-4 h-4 stroke-current fill-none stroke-[2.2]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* ================= OMMABOP XIZMATLAR ================= */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <h2 className="text-[17px] font-semibold text-white tracking-tight">Ommabop xizmatlar</h2>
              <button 
                onClick={() => onShowToast("Barcha xizmatlar")}
                className="text-[13px] font-medium text-white active:opacity-70 flex items-center gap-1 transition cursor-pointer"
              >
                <span>Barchasi</span>
                <svg className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Services List */}
            <div className="space-y-3">
              {popularServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => onOpenServiceModal(service.title, "Ushbu xizmat my.gov.uz orqali taqdim etiladi.")}
                  className="flex items-center p-1 rounded-xl active:bg-white/[0.04] transition cursor-pointer"
                >
                  {/* 42px squircle icon box, radius 10, fon #a9c4f5 */}
                  <div className="w-[42px] h-[42px] rounded-[10px] bg-[#a9c4f5] flex items-center justify-center text-[#12161f] shrink-0 shadow-sm">
                    {service.iconType === 'document' && (
                      <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 11.25h3m-3-3h3m-7.5-3h7.5M8.25 21h8.25M6 4.5h7.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25v-1.5A2.25 2.25 0 016 4.5z" />
                        <circle cx="9" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                        <line x1="10.8" y1="16.8" x2="13" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    )}
                    {service.iconType === 'salary' && (
                      <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v1.319m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    )}
                    {service.iconType === 'kindergarten' && (
                      <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.333A1.833 1.833 0 0017.667 8.5H6.333A1.833 1.833 0 004.5 10.333V21h15z" />
                      </svg>
                    )}
                  </div>

                  {/* Service Title and Metrics */}
                  <div className="ml-[36px] flex-1 min-w-0 pr-1">
                    <h3 className="text-[15px] font-medium text-white leading-snug">
                      {service.title}
                    </h3>
                    {/* Meta Row */}
                    <div className="flex items-center space-x-2 text-[12px] text-[#9a9a9a] mt-1 font-normal">
                      <span className="flex items-center gap-1">
                        <span className="text-white text-[12px]">☆</span> {service.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {service.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                        </svg>
                        {service.users}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Nav attached to Home page container (slides with it) */}
      <BottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        onOpenQrScanner={onOpenQrScanner}
        onOpenNavTab={onOpenNavTab}
      />
    </div>
  );
};
