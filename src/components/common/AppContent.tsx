'use client';

import Terminal from '@/components/apps/Terminal';
import WebBrowser from '@/components/apps/WebBrowser';
import MailingApp from '@/components/apps/MailingApp';
import VideoPlayer from '@/components/apps/VideoPlayer';
import TextViewer from '@/components/apps/TextViewer';
import Blackjack from '@/components/apps/Blackjack';
import OnboardingGuide from '@/components/apps/OnboardingGuide';
import Navigator from '@/components/apps/Navigator';
import PortfolioContent from '@/lib/portfolio-content';
import { useDesktopStore } from '@/store/desktop';
import type { AppId } from '@/types/desktop';

export default function AppContent({ id }: { id: AppId }) {
  const browserUrl = useDesktopStore((s) => s.browserUrl);

  switch (id) {
    case 'terminal':
      return <Terminal />;
    case 'browser': {
      return (
        <WebBrowser>
          {browserUrl === 'portfolio' ? (
            <PortfolioContent />
          ) : (
            <Navigator />
          )}
        </WebBrowser>
      );
    }
    case 'mail':
      return <MailingApp />;
    case 'video':
      return <VideoPlayer />;
    case 'textviewer':
      return <TextViewer />;
    case 'blackjack':
      return <Blackjack />;
    case 'onboarding':
      return <OnboardingGuide />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4">
          <p>{id} app</p>
        </div>
      );
  }
}
