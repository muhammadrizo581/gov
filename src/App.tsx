import React, { useState, useRef, useEffect } from 'react';
import { Screen, SheetData } from './types';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DocumentsScreen } from './components/DocumentsScreen';
import { IdCardScreen } from './components/IdCardScreen';
import { VerificationSheet } from './components/VerificationSheet';
import { PdfModal } from './components/PdfModal';
import { ScannerModal } from './components/ScannerModal';
import { SettingsModal } from './components/SettingsModal';
import { DetailSheet } from './components/DetailSheet';
import { Toast } from './components/Toast';
import { LockFlow } from './components/LockFlow';

type TransitionPhase = 'idle' | 'pushing' | 'popping' | 'dragging';

export default function App() {
  const [screenStack, setScreenStack] = useState<Screen[]>(['home']);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [completingDrag, setCompletingDrag] = useState<boolean>(false);
  const [snappingDrag, setSnappingDrag] = useState<boolean>(false);

  // When popping, we keep track of the outgoing screen so it can animate out
  const [outgoingScreen, setOutgoingScreen] = useState<Screen | null>(null);

  // Splash + PIN / Face ID on every launch
  const [isLocked, setIsLocked] = useState(true);
  const [isPrivacyOn, setIsPrivacyOn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);

  const touchState = useRef({
    startX: 0,
    startTime: 0,
    isEdgeSwipe: false,
  });

  const isPoppingProgrammatically = useRef(false);

  const currentScreen = screenStack[screenStack.length - 1];
  const previousScreen = screenStack.length > 1 ? screenStack[screenStack.length - 2] : null;

  // Toast handler
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Push navigation
  const handlePush = (nextScreen: Screen) => {
    if (transitionPhase !== 'idle') return;

    window.history.pushState({ screen: nextScreen, depth: screenStack.length + 1 }, '', `#${nextScreen}`);
    setScreenStack((prev) => [...prev, nextScreen]);
    setTransitionPhase('pushing');
    setAnimProgress(0);

    // Trigger animation in next tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimProgress(1);
      });
    });

    setTimeout(() => {
      setTransitionPhase('idle');
      setAnimProgress(0);
    }, 260);
  };

  // Pop navigation
  const handlePop = (fromBrowserBack = false) => {
    if (screenStack.length <= 1 || transitionPhase !== 'idle') return;

    const topScreen = screenStack[screenStack.length - 1];
    setOutgoingScreen(topScreen);
    setTransitionPhase('popping');
    setAnimProgress(0);

    if (!fromBrowserBack) {
      isPoppingProgrammatically.current = true;
      window.history.back();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimProgress(1);
      });
    });

    setTimeout(() => {
      setScreenStack((prev) => prev.slice(0, -1));
      setOutgoingScreen(null);
      setTransitionPhase('idle');
      setAnimProgress(0);
    }, 260);
  };

  // Handle routing navigation
  const handleNavigate = (targetScreen: Screen) => {
    if (targetScreen === currentScreen) return;

    // Root tabs switch (home <-> profile)
    if ((targetScreen === 'home' || targetScreen === 'profile') && screenStack.length === 1) {
      window.history.replaceState({ screen: targetScreen, depth: 1 }, '', `#${targetScreen}`);
      setScreenStack([targetScreen]);
      return;
    }

    // If navigating back to previous screen in stack
    if (screenStack.length > 1 && screenStack[screenStack.length - 2] === targetScreen) {
      handlePop();
      return;
    }

    // Forward push
    handlePush(targetScreen);
  };

  // Setup history state & popstate listener
  useEffect(() => {
    window.history.replaceState({ screen: 'home', depth: 1 }, '', '#home');

    const handlePopState = (e: PopStateEvent) => {
      if (isPoppingProgrammatically.current) {
        isPoppingProgrammatically.current = false;
        return;
      }

      if (screenStack.length > 1) {
        handlePop(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [screenStack.length]);

  // Standalone edge swipe-back gesture
  const isStandalone = typeof window !== 'undefined' && 
    (Boolean((window.navigator as any).standalone) || window.matchMedia('(display-mode: standalone)').matches);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isStandalone || screenStack.length <= 1 || transitionPhase !== 'idle') return;
    const touch = e.touches[0];
    if (touch.clientX <= 22) {
      touchState.current = {
        startX: touch.clientX,
        startTime: Date.now(),
        isEdgeSwipe: true,
      };
      setTransitionPhase('dragging');
      setDragOffset(0);
    } else {
      touchState.current.isEdgeSwipe = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current.isEdgeSwipe || transitionPhase !== 'dragging') return;
    const touch = e.touches[0];
    const deltaX = Math.max(0, touch.clientX - touchState.current.startX);
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!touchState.current.isEdgeSwipe || transitionPhase !== 'dragging') return;
    touchState.current.isEdgeSwipe = false;

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 430;
    const elapsed = Date.now() - touchState.current.startTime;
    const velocity = elapsed > 0 ? dragOffset / elapsed : 0;
    const shouldPop = dragOffset > screenWidth * 0.35 || (velocity > 0.45 && dragOffset > 40);

    if (shouldPop) {
      setCompletingDrag(true);
      setTimeout(() => {
        isPoppingProgrammatically.current = true;
        window.history.back();
        setScreenStack((prev) => prev.slice(0, -1));
        setTransitionPhase('idle');
        setDragOffset(0);
        setCompletingDrag(false);
      }, 200);
    } else {
      setSnappingDrag(true);
      setTimeout(() => {
        setTransitionPhase('idle');
        setDragOffset(0);
        setSnappingDrag(false);
      }, 200);
    }
  };

  const handleTogglePrivacy = () => {
    setIsPrivacyOn(!isPrivacyOn);
    showToast(!isPrivacyOn ? "Maxfiylik rejimi yoqildi" : "Maxfiylik rejimi o'chirildi");
  };

  const handleOpenDocumentModal = (title: string, detail: string, type: string) => {
    setSheetData({ title, detail, type: 'doc-detail' });
  };

  const handleOpenMenuSheet = (title: string, section: string) => {
    setSheetData({ title, type: section });
  };

  const handleOpenServiceModal = (title: string, detail: string) => {
    setSheetData({ title, detail, type: 'general' });
  };

  const handleOpenNavTab = (tab: string) => {
    if (tab === 'xizmatlar') {
      setSheetData({
        title: 'Xizmatlar katalogi',
        detail: 'Adliya, Ta\'lim, Soliq, Transport, Ijtimoiy himoya va boshqa 1000+ davlat xizmatlari',
        type: 'general',
      });
    } else if (tab === 'tolovlar') {
      setSheetData({
        title: 'To\'lovlar',
        detail: 'Kommunal to\'lovlar, Davlat bojlari, Jarimalar to\'lovi va to\'lovlar tarixi',
        type: 'general',
      });
    }
  };

  const renderScreenComponent = (screen: Screen) => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenServiceModal={handleOpenServiceModal}
            onShowToast={showToast}
            onOpenQrScanner={() => setIsScannerOpen(true)}
            onOpenNavTab={handleOpenNavTab}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            isPrivacyOn={isPrivacyOn}
            onTogglePrivacy={handleTogglePrivacy}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onNavigate={handleNavigate}
            onOpenMenuSheet={handleOpenMenuSheet}
            onOpenQrScanner={() => setIsScannerOpen(true)}
            onOpenNavTab={handleOpenNavTab}
          />
        );
      case 'docs':
        return (
          <DocumentsScreen
            onNavigate={handleNavigate}
            onOpenDocumentModal={handleOpenDocumentModal}
            onShowToast={showToast}
            onBack={() => handlePop()}
          />
        );
      case 'id-card':
        return (
          <IdCardScreen
            onNavigate={handleNavigate}
            onOpenVerificationSheet={() => setIsVerificationOpen(true)}
            onOpenPdfModal={() => setIsPdfOpen(true)}
            onShowToast={showToast}
            onBack={() => handlePop()}
          />
        );
      default:
        return null;
    }
  };

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 430;

  return (
    <div 
      style={{ height: 'var(--app-height, 100%)' }}
      className="fixed top-0 left-0 right-0 bg-[#161616] flex flex-col justify-start p-0 m-0 text-white selection:bg-teal-500 selection:text-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Solid Opaque Status Bar for Profile & Docs (NOT rendered on Home Screen) */}
      {currentScreen !== 'home' && (
        <div 
          className="status-bar-bg"
          style={{
            background: currentScreen === 'profile' ? '#262626' : '#161616',
          }}
        />
      )}

      {/* Desktop Quick Switcher (visible on desktop >= 768px only) */}
      <header className="hidden md:flex items-center justify-between w-full py-2 px-4 text-xs text-neutral-400 select-none border-b border-white/[0.06] shrink-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-white tracking-wide">my.gov.uz</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavigate('home')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${currentScreen === 'home' ? 'bg-[#2a2a2a] text-white font-medium' : 'hover:text-white'}`}
          >
            Bosh sahifa
          </button>
          <button
            onClick={() => handleNavigate('profile')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${currentScreen === 'profile' ? 'bg-[#2a2a2a] text-white font-medium' : 'hover:text-white'}`}
          >
            Profilim
          </button>
          <button
            onClick={() => handleNavigate('docs')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${currentScreen === 'docs' ? 'bg-[#2a2a2a] text-white font-medium' : 'hover:text-white'}`}
          >
            Hujjatlar
          </button>
        </div>
      </header>

      {/* ================= PAGE CONTAINER STACK ================= */}
      <div className="relative w-full flex-1 overflow-hidden">
        {/* 1. Underneath Screen (if pushing, popping, or dragging) */}
        {(transitionPhase === 'pushing' && previousScreen) && (
          <div
            className="page-container page-transition-anim"
            style={{
              zIndex: 10,
              transform: animProgress === 1 ? 'translateX(-30%)' : 'translateX(0%)',
              filter: animProgress === 1 ? 'brightness(0.9)' : 'brightness(1)',
            }}
          >
            {renderScreenComponent(previousScreen)}
          </div>
        )}

        {(transitionPhase === 'popping' && previousScreen) && (
          <div
            className="page-container page-transition-anim"
            style={{
              zIndex: 10,
              transform: animProgress === 1 ? 'translateX(0%)' : 'translateX(-30%)',
              filter: animProgress === 1 ? 'brightness(1)' : 'brightness(0.9)',
            }}
          >
            {renderScreenComponent(previousScreen)}
          </div>
        )}

        {transitionPhase === 'dragging' && previousScreen && (
          <div
            className={`page-container ${completingDrag || snappingDrag ? 'page-transition-anim' : ''}`}
            style={{
              zIndex: 10,
              transform: completingDrag
                ? 'translateX(0%)'
                : snappingDrag
                ? 'translateX(-30%)'
                : `translateX(${-30 + Math.min(1, dragOffset / screenWidth) * 30}%)`,
              filter: completingDrag
                ? 'brightness(1)'
                : snappingDrag
                ? 'brightness(0.9)'
                : `brightness(${0.9 + 0.1 * Math.min(1, dragOffset / screenWidth)})`,
            }}
          >
            {renderScreenComponent(previousScreen)}
          </div>
        )}

        {/* 2. Top Screen (or Outgoing Screen if popping) */}
        {transitionPhase === 'popping' && outgoingScreen ? (
          <div
            className="page-container page-transition-anim page-shadow-edge"
            style={{
              zIndex: 20,
              transform: animProgress === 1 ? 'translateX(100%)' : 'translateX(0%)',
            }}
          >
            {renderScreenComponent(outgoingScreen)}
          </div>
        ) : transitionPhase === 'pushing' ? (
          <div
            className="page-container page-transition-anim page-shadow-edge"
            style={{
              zIndex: 20,
              transform: animProgress === 1 ? 'translateX(0%)' : 'translateX(100%)',
            }}
          >
            {renderScreenComponent(currentScreen)}
          </div>
        ) : transitionPhase === 'dragging' ? (
          <div
            className={`page-container page-shadow-edge ${completingDrag || snappingDrag ? 'page-transition-anim' : ''}`}
            style={{
              zIndex: 20,
              transform: completingDrag
                ? `translateX(${screenWidth}px)`
                : snappingDrag
                ? 'translateX(0px)'
                : `translateX(${dragOffset}px)`,
            }}
          >
            {renderScreenComponent(currentScreen)}
          </div>
        ) : (
          /* Steady state: Top screen active */
          <div className="page-container" style={{ zIndex: 10 }}>
            {renderScreenComponent(currentScreen)}
          </div>
        )}
      </div>

      {/* Modals & Bottom Sheets (Top Layer z-[2000]) */}
      <VerificationSheet
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onShowToast={showToast}
      />

      <PdfModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        onShowToast={showToast}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onShowToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <DetailSheet
        data={sheetData}
        onClose={() => setSheetData(null)}
      />

      {/* Toast Alert */}
      <Toast message={toastMessage} />

      {/* Launch splash + PIN / Face ID lock (Top Layer z-[3000]) */}
      {isLocked && <LockFlow onUnlock={() => setIsLocked(false)} />}
    </div>
  );
}
