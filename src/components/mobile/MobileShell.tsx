'use client';

import MobileStatusBar from './MobileStatusBar';
import MobileNavBar from './MobileNavBar';
import MobileHomeScreen from './MobileHomeScreen';
import MobileAppView from './MobileAppView';
import MobileAppSwitcher from './MobileAppSwitcher';
import DesktopWallpaper from '@/components/desktop/DesktopWallpaper';
import SleepScreen from '@/components/desktop/SleepScreen';
import ColorTemperatureOverlay from '@/components/desktop/ColorTemperatureOverlay';
import { useDesktopStore } from '@/store/desktop';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function MobileShell() {
  const mobileScreen = useDesktopStore((s) => s.mobileScreen);
  const setMobileScreen = useDesktopStore((s) => s.setMobileScreen);
  const focusedApp = useDesktopStore((s) => s.focusedApp);
  const openApp = useDesktopStore((s) => s.openApp);
  const hasAutoOpened = useDesktopStore((s) => s.hasAutoOpened);

  useEffect(() => {
    if (!hasAutoOpened) {
      const completed = localStorage.getItem('onboarding_completed');
      if (completed !== 'true') {
        openApp('onboarding');
        setMobileScreen('app');
      }
    }
  }, [hasAutoOpened, openApp, setMobileScreen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-black">
      <ColorTemperatureOverlay />
      <DesktopWallpaper />
      
      {/* System Layer */}
      <MobileStatusBar />
      
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {mobileScreen === 'home' && (
            <MobileHomeScreen key="home" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(mobileScreen === 'app' && focusedApp) && (
            <MobileAppView key="app" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileScreen === 'switcher' && (
            <MobileAppSwitcher key="switcher" />
          )}
        </AnimatePresence>
      </div>

      <MobileNavBar />
      
      <AnimatePresence>
        <SleepScreen />
      </AnimatePresence>
    </div>
  );
}
