'use client';

import { useDesktopStore } from '@/store/desktop';
import { Battery, Wifi, Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import LanguageToggle from '@/components/common/LanguageToggle';

const WEATHER_ICONS: Record<string, typeof Sun> = {
  Clear: Sun,
  Cloudy: Cloud,
  Fog: CloudFog,
  Rain: CloudRain,
  HeavyRain: CloudRain,
  Snow: Snowflake,
  Thunderstorm: CloudLightning,
};

export default function MobileStatusBar() {
  const panelTime = useDesktopStore((s) => s.panelTime);
  const weather = useDesktopStore((s) => s.weather);

  const WeatherIcon = weather ? (WEATHER_ICONS[weather.condition] || Sun) : Sun;

  return (
    <div className="w-full h-12 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 text-white z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold tracking-tight">{panelTime}</span>
      </div>

      <div className="flex items-center gap-4">
        {weather && (
          <div className="flex items-center gap-1.5 opacity-80">
            <WeatherIcon size={14} className="text-yellow-400" />
            <span className="text-[11px] font-medium">{weather.temp}°C</span>
          </div>
        )}
        <LanguageToggle />
        <div className="flex items-center gap-2 opacity-80">
          <Wifi size={14} />
          <Battery size={14} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}
