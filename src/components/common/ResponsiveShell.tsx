'use client';

import { ReactNode, useSyncExternalStore } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import DesktopShell from '@/components/desktop/DesktopShell';
import TopPanel from '@/components/desktop/TopPanel';
import Dock from '@/components/desktop/Dock';

import MobileShell from '@/components/mobile/MobileShell';

interface ResponsiveShellProps {
  children: ReactNode;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ResponsiveShell({ children }: ResponsiveShellProps) {
  const isMobile = useIsMobile();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (isMobile) {
    return <MobileShell />;
  }

  return (
    <DesktopShell panel={<TopPanel />} dock={<Dock />}>
      {children}
    </DesktopShell>
  );
}
