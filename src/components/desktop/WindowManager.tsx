'use client';

import { useDesktopStore } from '@/store/desktop';
import AppWindow from './AppWindow';
import AppContent from '@/components/common/AppContent';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function WindowManager() {
  const openApps = useDesktopStore((s) => s.openApps);
  const openApp = useDesktopStore((s) => s.openApp);
  const hasAutoOpened = useDesktopStore((s) => s.hasAutoOpened);

  useEffect(() => {
    if (!hasAutoOpened) {
      const completed = localStorage.getItem('onboarding_completed');
      if (completed !== 'true') {
        openApp('onboarding');
      }
    }
  }, [hasAutoOpened, openApp]);

  const windows = Object.values(openApps).filter(Boolean);

  return (
    <AnimatePresence>
      {windows.map((win) => (
        <AppWindow key={win!.id} window={win!}>
          <AppContent id={win!.id} />
        </AppWindow>
      ))}
    </AnimatePresence>
  );
}

