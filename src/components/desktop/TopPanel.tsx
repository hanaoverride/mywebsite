'use client';

import { useEffect } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { Menu } from 'lucide-react';

export default function TopPanel() {
  const panelTime = useDesktopStore((s) => s.panelTime);
  const updatePanelTime = useDesktopStore((s) => s.updatePanelTime);
  const toggleMenu = useDesktopStore((s) => s.toggleMenu);
  const locale = useDesktopStore((s) => s.locale);

  useEffect(() => {
    const timer = setInterval(updatePanelTime, 60000);
    return () => clearInterval(timer);
  }, [updatePanelTime]);

  const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const daysKo = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = locale === 'ko' ? daysKo[now.getDay()] : daysEn[now.getDay()];
    return `${year}-${month}-${day} ${dayName}, ${panelTime}`;
  };

  return (
    <div data-testid="top-panel" className="w-full h-8 bg-gray-900/90 backdrop-blur-sm flex items-center justify-between px-3 text-gray-300 text-xs z-20 relative border-b border-gray-700/50">
      <div className="flex items-center gap-2">
        <button
          data-testid="menu-button"
          onClick={toggleMenu}
          className="hover:bg-white/10 rounded p-0.5 transition-colors"
          aria-label="Menu"
        >
          <Menu size={16} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span title="Color temperature">🌡 4000K</span>
        <span title="Battery">🔋 100%</span>
        <span title="Weather">⛅ {locale === 'ko' ? '맑음 16°C' : 'Clear 16°C'}</span>
      </div>

      <div className="flex items-center">
        <span data-testid="panel-time">{getFormattedDate()}</span>
      </div>
    </div>
  );
}
