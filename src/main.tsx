import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// iOS standalone (black-translucent): the layout viewport, vh units and
// position: fixed can end short of the real screen bottom, so size the app
// from the physical screen height instead.
const setAppHeight = () => {
  const isStandalone =
    Boolean((window.navigator as any).standalone) ||
    window.matchMedia('(display-mode: standalone)').matches;
  const isPortrait = window.innerHeight >= window.innerWidth;
  const screenHeight = isPortrait ? window.screen.height : window.screen.width;
  const height = isStandalone ? Math.max(window.innerHeight, screenHeight) : window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
  document.documentElement.classList.toggle('standalone', isStandalone);
};
setAppHeight();
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
