import { ReactNode } from 'react';
import DesktopWallpaper from './DesktopWallpaper';
import WindowManager from './WindowManager';
import ShutdownDialog from './ShutdownDialog';

interface DesktopShellProps {
  children: ReactNode;
  panel: ReactNode;
  dock: ReactNode;
}

export default function DesktopShell({ children, panel, dock }: DesktopShellProps) {
  return (
    <div
      data-testid="desktop-shell"
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <DesktopWallpaper />
      <div className="relative z-20 flex-shrink-0">{panel}</div>
      <div className="relative z-10 flex-1 overflow-hidden">
        {children}
        <WindowManager />
      </div>
      <div className="relative z-20 flex-shrink-0">{dock}</div>
      <ShutdownDialog />
    </div>
  );
}
