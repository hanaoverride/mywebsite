'use client';

import { ReactNode } from 'react';
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

interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  const mobileScreen = useDesktopStore((s) => s.mobileScreen);
  const focusedApp = useDesktopStore((s) => s.focusedApp);

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
