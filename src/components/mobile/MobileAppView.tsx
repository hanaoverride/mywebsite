'use client';

import { useDesktopStore } from '@/store/desktop';
import AppContent from '@/components/common/AppContent';
import { X, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileAppView() {
  const focusedApp = useDesktopStore((s) => s.focusedApp);
  const closeApp = useDesktopStore((s) => s.closeApp);
  const setMobileScreen = useDesktopStore((s) => s.setMobileScreen);
  const openApps = useDesktopStore((s) => s.openApps);

  const activeApp = focusedApp ? openApps[focusedApp] : null;

  if (!activeApp) return null;

  const handleClose = () => {
    closeApp(activeApp.id);
    setMobileScreen('home');
  };

  const handleBack = () => {
    setMobileScreen('home');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-40 bg-gray-900 flex flex-col"
    >
      {/* Mobile App Header */}
      <div className="h-12 flex-shrink-0 bg-gray-800 flex items-center justify-between px-2 border-b border-white/5">
        <button 
          onClick={handleBack}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-xs font-semibold text-gray-300 truncate max-w-[200px]">
          {activeApp.title}
        </span>
        <button 
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-auto bg-black">
        <AppContent id={activeApp.id} />
      </div>
    </motion.div>
  );
}
