import React from 'react';
import { Screen } from '../types';
import { BottomNav } from './BottomNav';

interface ProfileScreenProps {
  isPrivacyOn: boolean;
  onTogglePrivacy: () => void;
  onOpenSettings: () => void;
  onNavigate: (screen: Screen) => void;
  onOpenMenuSheet: (title: string, section: string) => void;
  onOpenQrScanner?: () => void;
  onOpenNavTab?: (tab: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isPrivacyOn,
  onTogglePrivacy,
  onOpenSettings,
  onNavigate,
  onOpenMenuSheet,
  onOpenQrScanner = () => {},
  onOpenNavTab = () => {},
}) => {
  const menuItems = [
    {
      id: 'applications',
      title: 'Arizalarim va sharhlarim',
      subtitle: 'Tarixi, holati va kuzatish',
      icon: 'clipboard-list',
      badge: false,
    },
    {
      id: 'health',
      title: 'Mening salomatligim',
      subtitle: 'Salomatligimga tegishli ma\'lumotnomalar',
      icon: 'heart-pulse',
      badge: true,
    },
    {
      id: 'family',
      title: 'Mening oilam',
      subtitle: 'Oila tarkibi',
      icon: 'users',
      badge: true,
    },
    {
      id: 'house',
      title: 'Mening uyim',
      subtitle: 'Mulk va kadastr',
      icon: 'home',
      badge: false,
    },
    {
      id: 'work',
      title: 'Mehnat faoliyati',
      subtitle: 'Mehnat tarixi',
      icon: 'briefcase',
      badge: false,
    },
    {
      id: 'transport',
      title: 'Mening avtotransportim',
      subtitle: 'Avtotransport vositalari',
      icon: 'car-side',
      badge: false,
    },
    {
      id: 'taxes',
      title: 'Soliqlar, ta\'qiq va jarimalar',
      subtitle: 'Ijro hujjati, soliq va jarimalar',
      icon: 'receipt',
      badge: false,
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#161616]">
      {/* Scrollable Container */}
      <div 
        className="flex flex-col flex-1 w-full overflow-y-auto overscroll-y-none pb-28 text-white bg-[#161616] select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* ================= YUQORI PANEL (width 100%, fon #262626, radius: 0 0 24px 24px) ================= */}
        <div className="w-full bg-[#262626] rounded-b-[24px] px-4 pt-[env(safe-area-inset-top,0px)] pb-5 shadow-xl">
          {/* User Header */}
          <div className="flex items-center justify-between pt-2" data-purpose="user-header">
            <div className="flex items-center space-x-3.5">
              {/* Avatar: faqat bitta 3px to'q yashil (#2f4a3a) border, ikkinchi halqa/shadowsiz */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-[#2f4a3a] shrink-0">
                <img
                  src="/assets/avatar.png"
                  alt="A. Muhammadrizo avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/user_portrait.png';
                  }}
                />
              </div>
              {/* User Info (Phone in pure white, font-weight: 600) */}
              <div className="flex flex-col">
                <h1 className="text-white font-medium text-[17px] leading-tight tracking-tight">
                  A. Muhammadrizo
                </h1>
                <span className="text-white text-[13.5px] font-[600] tracking-wide mt-0.5">
                  {isPrivacyOn ? '+998 (77) •••-••-••' : '+998 (77) 177-04-00'}
                </span>
              </div>
            </div>

            {/* Action Icons (Privacy Eye & Settings) */}
            <div className="flex items-center space-x-4 text-white/90">
              <button
                onClick={onTogglePrivacy}
                aria-label="Toggle visible state"
                className="active:scale-90 transition p-1 cursor-pointer"
                type="button"
              >
                {isPrivacyOn ? (
                  <svg className="w-6 h-6 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round"></path>
                    <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
                  </svg>
                )}
              </button>
              <button
                onClick={onOpenSettings}
                aria-label="Settings"
                className="active:scale-90 transition p-1 cursor-pointer"
                type="button"
              >
                <svg className="w-6 h-6 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                  <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" strokeLinecap="round" strokeLinejoin="round"></path>
                  <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
                </svg>
              </button>
            </div>
          </div>

          {/* ID Karta Hero: width 77%, centered, frameless, with back card: width 72%, peeking 18px lower, #dcdcdc */}
          <div
            className="relative w-[77%] mx-auto mt-4 mb-6 cursor-pointer active:scale-[0.99] transition"
            onClick={() => onNavigate('id-card')}
            data-purpose="citizen-id-card-container"
          >
            {/* Peeking 2nd Card behind: width 72% of screen (93.5% of container), 18px lower, #dcdcdc */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[93.5%] h-full top-[18px] rounded-[18px] bg-[#dcdcdc] shadow-md -z-0"></div>

            {/* Main ID Card on top without outer border */}
            <div className="relative z-10 w-full rounded-[18px] overflow-hidden shadow-2xl">
              <img
                src="/assets/id_card_front.png"
                alt="ID Karta Abdulxakimov Muhammadrizo"
                className="w-full h-auto block select-none"
              />
            </div>
          </div>

          {/* "Raqamli hujjatlar va ma'lumotlar" button: width calc(100% - 32px), height 50px, text nowrap, Yangi #4caf6a */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('docs');
            }}
            className="w-[calc(100%-32px)] mx-auto h-[50px] bg-[#a9c4f5] active:bg-[#97c1ee] rounded-[25px] px-3.5 flex items-center justify-between text-neutral-900 transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <div className="w-7 h-7 flex items-center justify-center text-neutral-900 shrink-0">
                <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                  <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <span className="text-[14px] font-medium text-neutral-900 whitespace-nowrap tracking-tight">
                Raqamli hujjatlar va ma'lumotlar
              </span>
            </div>

            {/* "Yangi" badge: tekis yashil (#4caf6a), oq matn, gradientsiz */}
            <div className="bg-[#4caf6a] text-white text-[11.5px] font-normal px-2.5 py-1 rounded-full leading-none shrink-0">
              Yangi
            </div>
          </button>
        </div>

        {/* ================= SERVICES MENU LIST ================= */}
        <main className="mt-3 px-2 space-y-1 grow" data-purpose="services-menu-list">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenMenuSheet(item.title, item.id)}
              className="flex items-center justify-between px-3.5 py-2.5 active:bg-white/[0.06] rounded-2xl transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-2">
                {/* 28px Outline Icon, stroke 2, white */}
                <div className="w-[28px] h-[28px] flex items-center justify-center shrink-0">
                  {item.icon === 'clipboard-list' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0a1 1 0 01-1 1h-4a1 1 0 01-1-1v0z" />
                    </svg>
                  )}
                  {item.icon === 'heart-pulse' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 12h3.5l2-3 3 6 2-3h3.5" />
                    </svg>
                  )}
                  {item.icon === 'users' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                      <circle cx="5" cy="8" r="2.2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 20v-1.5a3 3 0 012.5-3" />
                      <circle cx="19" cy="8" r="2.2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 20v-1.5a3 3 0 00-2.5-3" />
                    </svg>
                  )}
                  {item.icon === 'home' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  )}
                  {item.icon === 'briefcase' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v1.319m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                  {item.icon === 'car-side' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25H9.75M9.75 7.5H4.872a2.056 2.056 0 00-1.92 1.341L1.5 13.5v3" />
                    </svg>
                  )}
                  {item.icon === 'receipt' && (
                    <svg className="w-[28px] h-[28px] stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                </div>

                {/* Title & Subtitle: 1 line, text-overflow: ellipsis, color #e0e0e0 */}
                <div className="min-w-0 pr-2 flex-1">
                  <h3 className="text-white font-medium text-[15px] leading-snug whitespace-nowrap truncate">
                    {item.title}
                  </h3>
                  <p className="text-[#e0e0e0] text-[13px] font-normal leading-tight mt-0.5 whitespace-nowrap truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Badge & Chevron > (white, stroke 2.5) */}
              <div className="flex items-center space-x-2 shrink-0">
                {item.badge && (
                  <div
                    style={{ background: 'linear-gradient(90deg, #3f9a5a, #3b6fd1)' }}
                    className="w-[56px] h-[28px] rounded-full text-white text-[12px] font-normal flex items-center justify-center shadow-xs leading-none shrink-0"
                  >
                    Yangi
                  </div>
                )}
                <div className="text-white pr-1">
                  <svg className="w-4 h-4 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Bottom Nav attached to Profile page container (slides with it) */}
      <BottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        onOpenQrScanner={onOpenQrScanner}
        onOpenNavTab={onOpenNavTab}
      />
    </div>
  );
};
