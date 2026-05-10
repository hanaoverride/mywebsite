'use client';

import { useEffect, useState } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { Menu, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';
import CalendarPopover from './CalendarPopover';

export default function TopPanel() {
  const t = useTranslations('desktop.panel');
  const panelTime = useDesktopStore((s) => s.panelTime);
  const updatePanelTime = useDesktopStore((s) => s.updatePanelTime);
  const toggleMenu = useDesktopStore((s) => s.toggleMenu);
  const locale = useDesktopStore((s) => s.locale);
  const colorTemperature = useDesktopStore((s) => s.colorTemperature);
  const setColorTemperature = useDesktopStore((s) => s.setColorTemperature);

  const [showTempSlider, setShowTempSlider] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const weather = useDesktopStore((s) => s.weather);
  const fetchWeather = useDesktopStore((s) => s.fetchWeather);

  useEffect(() => {
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000); // Update every 10 mins
    const timeTimer = setInterval(updatePanelTime, 60000);
    return () => {
      clearInterval(weatherTimer);
      clearInterval(timeTimer);
    };
  }, [updatePanelTime, fetchWeather]);

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
        <div className="relative flex items-center">
          <button
            onClick={() => setShowTempSlider(!showTempSlider)}
            className={`flex items-center gap-1 hover:text-white transition-colors px-1.5 py-0.5 rounded ${showTempSlider ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
            title="Color temperature"
          >
            <span>🌡 {colorTemperature}K</span>
          </button>

          {showTempSlider && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTempSlider(false)}
              />
              <div className="absolute top-8 right-0 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg p-3 shadow-2xl z-50 w-48 flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[10px] uppercase text-gray-400 tracking-wider">{t('temperatureLabel')}</span>
                  <span className="text-orange-400 font-mono font-bold">{colorTemperature}K</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="6500"
                  step="100"
                  value={colorTemperature}
                  onChange={(e) => setColorTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-medium">
                  <span>3000K</span>
                  <span>6500K</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative flex items-center">
          <button
            title="Weather"
            onClick={() => setShowWeatherDetail(!showWeatherDetail)}
            className={`flex items-center gap-1 hover:text-white transition-colors px-1.5 py-0.5 rounded ${showWeatherDetail ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            {weather ? (
              <>
                <span>{weather.icon}</span>
                <span>
                  {t(`weatherConditions.${weather.condition}`)} {weather.temp}°C
                </span>
              </>
            ) : (
              <span>⛅ {locale === 'ko' ? '로딩 중...' : 'Loading...'}</span>
            )}
          </button>

          {showWeatherDetail && weather && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowWeatherDetail(false)}
              />
              <div className="absolute top-8 right-0 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg p-3 shadow-2xl z-50 w-64 flex flex-col gap-3 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-2 border-b border-gray-700/50 pb-2">
                  <MapPin size={14} className="text-blue-400" />
                  <span className="font-semibold text-xs text-white">
                    {t('weatherDetails.location')}
                  </span>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white leading-none">
                      {weather.temp}°C
                    </span>
                    <span className="text-gray-400 text-[10px] mt-1">
                      {t(`weatherConditions.${weather.condition}`)}
                    </span>
                  </div>
                  <span className="text-4xl">{weather.icon}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700/50">
                  <div className="flex flex-col items-center gap-1">
                    <Thermometer size={12} className="text-orange-400" />
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                      {t('weatherDetails.feelsLike')}
                    </span>
                    <span className="text-xs font-medium text-gray-200">
                      {weather.feelsLike}°C
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Droplets size={12} className="text-blue-400" />
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                      {t('weatherDetails.humidity')}
                    </span>
                    <span className="text-xs font-medium text-gray-200">
                      {weather.humidity}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Wind size={12} className="text-teal-400" />
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                      {t('weatherDetails.windSpeed')}
                    </span>
                    <span className="text-xs font-medium text-gray-200">
                      {weather.windSpeed}m/s
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <LanguageToggle />
        <div className="relative flex items-center">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`hover:text-white transition-colors px-2 py-0.5 rounded font-medium ${showCalendar ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <span data-testid="panel-time">{getFormattedDate()}</span>
          </button>
          
          <AnimatePresence>
            {showCalendar && (
              <CalendarPopover onClose={() => setShowCalendar(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
