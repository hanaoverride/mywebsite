'use client';

import { useDesktopStore } from '@/store/desktop';
import type { AppId } from '@/types/desktop';
import { Terminal, Globe, Mail, Video, FileText, Gamepad2, Menu } from 'lucide-react';

const DOCK_APPS: { id: AppId | 'menu'; icon: typeof Terminal; label: string }[] = [
  { id: 'menu', icon: Menu, label: 'Menu' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'browser', icon: Globe, label: 'Browser' },
  { id: 'mail', icon: Mail, label: 'Mail' },
  { id: 'video', icon: Video, label: 'Video' },
  { id: 'textviewer', icon: FileText, label: 'Text Viewer' },
  { id: 'blackjack', icon: Gamepad2, label: 'Blackjack' },
];

export default function Dock() {
  const openApp = useDesktopStore((s) => s.openApp);
  const toggleMenu = useDesktopStore((s) => s.toggleMenu);
  const openApps = useDesktopStore((s) => s.openApps);

  const handleClick = (id: AppId | 'menu') => {
    if (id === 'menu') {
      toggleMenu();
    } else {
      openApp(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-2 pointer-events-none">
      <div
        data-testid="dock"
        className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg shadow-black/30"
      >
        {DOCK_APPS.map((app) => {
          const isOpen = app.id !== 'menu' && !!openApps[app.id];
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              data-testid={`dock-icon-${app.id}`}
              onClick={() => handleClick(app.id)}
              className="relative p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 hover:scale-[1.15] transition-all duration-200 group"
              title={app.label}
            >
              <Icon size={22} />
              {isOpen && (
                <span
                  data-testid={`dock-dot-${app.id}`}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.6)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
