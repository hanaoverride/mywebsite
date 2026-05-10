'use client';

import { useDesktopStore } from '@/store/desktop';
import AppWindow from './AppWindow';
import type { AppId } from '@/types/desktop';

function AppContent({ id }: { id: AppId }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4">
      <p>{id} app content &mdash; implemented in Wave 3&ndash;4</p>
    </div>
  );
}

export default function WindowManager() {
  const openApps = useDesktopStore((s) => s.openApps);

  const windows = Object.values(openApps).filter(Boolean);
  if (windows.length === 0) return null;

  return (
    <>
      {windows.map((win) => (
        <AppWindow key={win!.id} window={win!}>
          <AppContent id={win!.id} />
        </AppWindow>
      ))}
    </>
  );
}
