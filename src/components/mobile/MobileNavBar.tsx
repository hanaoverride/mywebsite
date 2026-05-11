'use client';

import { useDesktopStore } from '@/store/desktop';
import { Home, ChevronLeft, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNavBar() {
  const setMobileScreen = useDesktopStore((s) => s.setMobileScreen);
  const mobileScreen = useDesktopStore((s) => s.mobileScreen);
  const focusedApp = useDesktopStore((s) => s.focusedApp);
  const closeApp = useDesktopStore((s) => s.closeApp);

  const handleBack = () => {
    if (mobileScreen === 'app' && focusedApp) {
      closeApp(focusedApp);
      setMobileScreen('home');
    } else if (mobileScreen === 'switcher') {
      setMobileScreen('home');
    }
  };

  const handleHome = () => {
    setMobileScreen('home');
  };

  const handleSwitcher = () => {
    setMobileScreen('switcher');
  };

  return (
    <div className="w-full h-14 bg-black/30 backdrop-blur-xl flex items-center justify-around px-4 border-t border-white/5">
      <button 
        onClick={handleBack}
        className="p-3 text-white/70 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Back"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={handleHome}
        className="p-3 text-white/70 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Home"
      >
        <div className="w-4 h-4 border-2 border-current rounded-sm rotate-45" />
      </button>
      
      <button 
        onClick={handleSwitcher}
        className="p-3 text-white/70 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Apps"
      >
        <Layers size={22} />
      </button>
    </div>
  );
}
