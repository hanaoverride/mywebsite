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
    // Open textviewer on startup if not already open and never auto-opened before
    if (!hasAutoOpened && !openApps.textviewer) {
      openApp('textviewer');
    }
  }, [hasAutoOpened, openApp, openApps.textviewer]);

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

