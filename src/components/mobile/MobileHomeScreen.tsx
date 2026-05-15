'use client';

import { useDesktopStore } from '@/store/desktop';
import { Terminal, Globe, Mail, Video, FileText, Gamepad2, BookOpen, Compass } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import type { AppId } from '@/types/desktop';

const APPS: { id: AppId; icon: typeof Terminal; color: string }[] = [
  { id: 'terminal', icon: Terminal, color: 'bg-zinc-800' },
  { id: 'browser', icon: Globe, color: 'bg-blue-500' },
  { id: 'mail', icon: Mail, color: 'bg-indigo-500' },
  { id: 'video', icon: Video, color: 'bg-red-500' },
  { id: 'textviewer', icon: FileText, color: 'bg-orange-500' },
  { id: 'blackjack', icon: Gamepad2, color: 'bg-green-600' },
  { id: 'onboarding', icon: BookOpen, color: 'bg-cyan-500' },
  { id: 'navigator', icon: Compass, color: 'bg-blue-600' },
];

export default function MobileHomeScreen() {
  const t = useTranslations('desktop.dock');
  const openApp = useDesktopStore((s) => s.openApp);
  const setMobileScreen = useDesktopStore((s) => s.setMobileScreen);
  const openApps = useDesktopStore((s) => s.openApps);

  const handleAppClick = (id: AppId) => {
    openApp(id);
    setMobileScreen('app');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 overflow-y-auto">
      <div className="grid grid-cols-3 gap-x-8 gap-y-10 w-full max-w-sm">
        {APPS.map((app) => {
          const Icon = app.icon;
          const isOpen = !!openApps[app.id];
          
          return (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAppClick(app.id)}
              className="flex flex-col items-center gap-2 relative group"
            >
              <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/30 border border-white/10 group-active:brightness-90 transition-all`}>
                <Icon size={32} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-white/90 text-center truncate w-full px-1 drop-shadow-md">
                {t(app.id)}
              </span>
              {isOpen && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}
