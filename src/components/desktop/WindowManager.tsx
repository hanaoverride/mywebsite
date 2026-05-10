'use client';

import { useDesktopStore } from '@/store/desktop';
import AppWindow from './AppWindow';
import Terminal from '@/components/apps/Terminal';
import WebBrowser from '@/components/apps/WebBrowser';
import MailingApp from '@/components/apps/MailingApp';
import VideoPlayer from '@/components/apps/VideoPlayer';
import TextViewer from '@/components/apps/TextViewer';
import Blackjack from '@/components/apps/Blackjack';
import PortfolioContent from '@/lib/portfolio-content';
import type { AppId } from '@/types/desktop';

import { AnimatePresence } from 'framer-motion';

function AppContent({ id }: { id: AppId }) {
  switch (id) {
    case 'terminal':
      return <Terminal />;
    case 'browser':
      return (
        <WebBrowser>
          <PortfolioContent />
        </WebBrowser>
      );
    case 'mail':
      return <MailingApp />;
    case 'video':
      return <VideoPlayer />;
    case 'textviewer':
      return <TextViewer />;
    case 'blackjack':
      return <Blackjack />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4">
          <p>{id} app</p>
        </div>
      );
  }
}

export default function WindowManager() {
  const openApps = useDesktopStore((s) => s.openApps);

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

