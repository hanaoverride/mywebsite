'use client';

import { useDesktopStore } from '@/store/desktop';
import { X, Terminal, Globe, Mail, Video, FileText, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppId } from '@/types/desktop';

const APP_ICONS: Record<AppId, typeof Terminal> = {
  terminal: Terminal,
  browser: Globe,
  mail: Mail,
  video: Video,
  textviewer: FileText,
  blackjack: Gamepad2,
};

export default function MobileAppSwitcher() {
  const openApps = useDesktopStore((s) => s.openApps);
  const focusedApp = useDesktopStore((s) => s.focusedApp);
  const focusApp = useDesktopStore((s) => s.focusApp);
  const closeApp = useDesktopStore((s) => s.closeApp);
  const setMobileScreen = useDesktopStore((s) => s.setMobileScreen);

  const runningApps = Object.values(openApps).filter(Boolean);

  const handleAppSelect = (id: AppId) => {
    focusApp(id);
    setMobileScreen('app');
  };

  const handleClose = (e: React.MouseEvent, id: AppId) => {
    e.stopPropagation();
    closeApp(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Running Apps</h2>
        <button 
          onClick={() => setMobileScreen('home')}
          className="text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-8 items-center snap-x px-4">
        {runningApps.length === 0 ? (
          <div className="w-full text-center text-gray-500 py-20">
            No apps running
          </div>
        ) : (
          runningApps.map((win) => {
            const Icon = APP_ICONS[win!.id];
            const isFocused = focusedApp === win!.id;

            return (
              <motion.div
                key={win!.id}
                layoutId={`switcher-${win!.id}`}
                onClick={() => handleAppSelect(win!.id)}
                className={`relative flex-shrink-0 w-64 h-[400px] bg-gray-800 rounded-3xl border-2 transition-colors snap-center flex flex-col overflow-hidden ${
                  isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-white/10'
                }`}
              >
                {/* Preview Header */}
                <div className="h-10 bg-gray-700/50 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{win!.title}</span>
                  </div>
                  <button 
                    onClick={(e) => handleClose(e, win!.id)}
                    className="p-1 text-gray-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Preview Content Placeholder */}
                <div className="flex-1 bg-black/40 flex items-center justify-center">
                  <Icon size={48} className="text-white/10" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-auto flex justify-center pb-4">
        <button 
          onClick={() => {
            runningApps.forEach(app => closeApp(app!.id));
            setMobileScreen('home');
          }}
          className="px-6 py-2 bg-white/10 hover:bg-red-500/20 text-white rounded-full text-sm font-medium border border-white/10 transition-colors"
        >
          Close All
        </button>
      </div>
    </motion.div>
  );
}
