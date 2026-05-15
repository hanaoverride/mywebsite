'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useDesktopStore } from '@/store/desktop';
import type { AppId } from '@/types/desktop';
import {
  Terminal,
  Globe,
  Mail,
  Video,
  FileText,
  Gamepad2,
  Moon,
  Monitor,
  Code,
  Gamepad,
  Wifi,
  Clapperboard,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const CATEGORIES = [
  { id: 'all', icon: Monitor },
  { id: 'development', icon: Code },
  { id: 'games', icon: Gamepad },
  { id: 'internet', icon: Wifi },
  { id: 'multimedia', icon: Clapperboard },
  { id: 'office', icon: Briefcase },
];

const MENU_APPS: { id: AppId; icon: typeof Terminal }[] = [
  { id: 'terminal', icon: Terminal },
  { id: 'browser', icon: Globe },
  { id: 'mail', icon: Mail },
  { id: 'video', icon: Video },
  { id: 'textviewer', icon: FileText },
  { id: 'blackjack', icon: Gamepad2 },
  { id: 'onboarding', icon: BookOpen },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const tMenu = useTranslations('desktop.menu');
  const tDock = useTranslations('desktop.dock');
  const menuOpen = useDesktopStore((s) => s.menuOpen);
  const toggleMenu = useDesktopStore((s) => s.toggleMenu);
  const openApp = useDesktopStore((s) => s.openApp);
  const setIsSleepMode = useDesktopStore((s) => s.setIsSleepMode);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        toggleMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, toggleMenu]);

  if (!menuOpen) return null;

  const handleAppClick = (id: AppId) => {
    openApp(id);
    toggleMenu();
  };

  const handleSleep = () => {
    toggleMenu();
    setIsSleepMode(true);
  };

  const filteredApps = MENU_APPS.filter((app) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'development') return app.id === 'textviewer';
    if (selectedCategory === 'games') return app.id === 'blackjack';
    if (selectedCategory === 'internet') return app.id === 'browser';
    if (selectedCategory === 'multimedia') return app.id === 'video';
    if (selectedCategory === 'office') return app.id === 'textviewer' || app.id === 'onboarding';
    return false;
  });

  return (
    <motion.div
      data-testid="menu-overlay"
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute top-8 left-1 z-30 w-[60%] max-w-[600px] h-[55%] max-h-[500px] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-gray-700/30 flex flex-col overflow-hidden"
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-gray-800/50 border-r border-gray-700/30 py-3 flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left ${
                  isActive 
                    ? 'bg-blue-600/30 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tMenu(`categories.${cat.id}`)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 p-4 grid grid-cols-3 gap-3 content-start">
          {filteredApps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                data-testid={`menu-app-${app.id}`}
                onClick={() => handleAppClick(app.id)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                <Icon size={32} />
                <span className="text-xs text-center">{tDock(app.id)}</span>
              </button>
            );
          })}
        </div>
      </div>


      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-t border-gray-700/30">
        <button
          data-testid="menu-sleep"
          onClick={handleSleep}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors text-sm"
        >
          <Moon size={16} />
          <span>{tMenu('sleep')}</span>
        </button>
      </div>
    </motion.div>
  );
}

