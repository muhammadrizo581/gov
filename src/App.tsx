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
    startY: 0,
    startTime: 0,
    offset: 0,
    axis: 'none' as 'none' | 'x' | 'y',
    isEdgeSwipe: false,
  });

  // Drag layers are moved straight through the DOM (no re-render per touchmove)
  const dragLayerRef = useRef<HTMLDivElement>(null);
  const underLayerRef = useRef<HTMLDivElement>(null);

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

    // replaceState, not pushState: extra history entries make iOS draw its own
    // back-swipe snapshot on top of our animation (duplicated pages)
    window.history.replaceState({ screen: nextScreen }, '', `#${nextScreen}`);
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
      window.history.replaceState({ screen: screenStack[screenStack.length - 2] }, '', `#${screenStack[screenStack.length - 2]}`);
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

  const applyDrag = (offset: number, animate: boolean) => {
    const progress = Math.min(1, Math.max(0, offset / window.innerWidth));
    const transition = animate
      ? 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 200ms cubic-bezier(0.2, 0.8, 0.2, 1)'
      : 'none';
    if (dragLayerRef.current) {
      dragLayerRef.current.style.transition = transition;
      dragLayerRef.current.style.transform = `translateX(${offset}px)`;
    }
    if (underLayerRef.current) {
      underLayerRef.current.style.transition = transition;
      underLayerRef.current.style.transform = `translateX(${-30 + progress * 30}%)`;
      underLayerRef.current.style.filter = `brightness(${0.9 + 0.1 * progress})`;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isStandalone || screenStack.length <= 1 || transitionPhase !== 'idle') return;
    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      offset: 0,
      axis: 'none',
      isEdgeSwipe: touch.clientX <= 24,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const state = touchState.current;
    if (!state.isEdgeSwipe) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;

    // Decide once whether this is a horizontal back-swipe or a vertical scroll
    if (state.axis === 'none') {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      state.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
      if (state.axis === 'y') {
        state.isEdgeSwipe = false;
        return;
      }
      setTransitionPhase('dragging');
    }

    state.offset = Math.max(0, deltaX);
    applyDrag(state.offset, false);
  };

  const handleTouchEnd = () => {
    const state = touchState.current;
    if (!state.isEdgeSwipe) return;
    state.isEdgeSwipe = false;
    if (state.axis !== 'x') return;

    const screenWidth = window.innerWidth;
    const elapsed = Date.now() - state.startTime;
    const velocity = elapsed > 0 ? state.offset / elapsed : 0;
    const shouldPop = state.offset > screenWidth * 0.35 || (velocity > 0.45 && state.offset > 40);

    applyDrag(shouldPop ? screenWidth : 0, true);
    setTimeout(() => {
      if (shouldPop) {
        const nextStack = screenStack.slice(0, -1);
        window.history.replaceState({ screen: nextStack[nextStack.length - 1] }, '', `#${nextStack[nextStack.length - 1]}`);
        setScreenStack(nextStack);
      }
      setTransitionPhase('idle');
    }, 200);
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
      onTouchCancel={handleTouchEnd}
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
            ref={underLayerRef}
            className="page-container"
            style={{ zIndex: 10, transform: 'translateX(-30%)', filter: 'brightness(0.9)' }}
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
            ref={dragLayerRef}
            className="page-container page-shadow-edge"
            style={{ zIndex: 20, transform: 'translateX(0px)' }}
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
