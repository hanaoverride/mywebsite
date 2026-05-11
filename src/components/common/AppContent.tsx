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
import type { AppId } from '@/types/desktop';

export default function AppContent({ id }: { id: AppId }) {
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
    case 'onboarding':
      return <OnboardingGuide />;
    case 'navigator':
      return <Navigator />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4">
          <p>{id} app</p>
        </div>
      );
  }
}
