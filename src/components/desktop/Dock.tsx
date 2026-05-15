'use client';

import { useDesktopStore } from '@/store/desktop';
import type { AppId } from '@/types/desktop';
import { Terminal, Globe, Mail, Video, FileText, Gamepad2, Menu, BookOpen } from 'lucide-react';

const DOCK_APPS: { id: AppId | 'menu'; icon: typeof Terminal; label: string }[] = [
  { id: 'menu', icon: Menu, label: 'Menu' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'browser', icon: Globe, label: 'Browser' },
  { id: 'mail', icon: Mail, label: 'Mail' },
  { id: 'video', icon: Video, label: 'Video' },
  { id: 'textviewer', icon: FileText, label: 'Text Viewer' },
  { id: 'blackjack', icon: Gamepad2, label: 'Blackjack' },
  { id: 'onboarding', icon: BookOpen, label: 'Onboarding' },
];

export default function Dock() {
  const openApp = useDesktopStore((s) => s.openApp);
  const toggleMenu = useDesktopStore((s) => s.toggleMenu);
  const openApps = useDesktopStore((s) => s.openApps);
  const focusedApp = useDesktopStore((s) => s.focusedApp);

  const handleClick = (id: AppId | 'menu') => {
    if (id === 'menu') {
      toggleMenu();
    } else {
      openApp(id, { toggle: true });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-2 pointer-events-none">
      <div
        data-testid="dock"
        className="pointer-events-auto flex items-center gap-3 px-8 py-3 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-lg shadow-black/30"
      >
        {DOCK_APPS.map((app) => {
          const isOpen = app.id !== 'menu' && !!openApps[app.id];
          const isFocused = app.id !== 'menu' && focusedApp === app.id;
          const isMinimized = app.id !== 'menu' && openApps[app.id]?.minimized;
          const Icon = app.icon;
          
          return (
            <button
              key={app.id}
              data-testid={`dock-icon-${app.id}`}
              onClick={() => handleClick(app.id)}
              className={`relative p-3 rounded-2xl transition-all duration-200 group ${
                isFocused 
                  ? 'text-white bg-white/20 scale-110' 
                  : 'text-white/80 hover:text-white hover:bg-white/15 hover:scale-[1.15]'
              }`}
              title={app.label}
            >
              <Icon size={32} className={isMinimized ? 'opacity-50' : 'opacity-100'} />
              {isOpen && (
                <span
                  data-testid={`dock-dot-${app.id}`}
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${
                    isFocused 
                      ? 'bg-blue-400 w-2 h-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]' 
                      : isMinimized
                        ? 'bg-blue-300/40 w-1.5 h-1.5 shadow-none'
                        : 'bg-blue-400/70 w-1.5 h-1.5 shadow-[0_0_4px_rgba(96,165,250,0.4)]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
