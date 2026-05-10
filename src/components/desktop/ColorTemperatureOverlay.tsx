'use client';

import { useDesktopStore } from '@/store/desktop';

export default function ColorTemperatureOverlay() {
  const colorTemperature = useDesktopStore((s) => s.colorTemperature);

  // Map 6500K -> 0 opacity, 3000K -> 0.35 opacity (adjustable for better feel)
  const opacity = Math.max(0, (6500 - colorTemperature) / (6500 - 3000)) * 0.35;

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        backgroundColor: `rgba(255, 120, 0, ${opacity})`,
        mixBlendMode: 'multiply', // Using multiply to actually filter colors rather than just overlay
        pointerEvents: 'none',
      }}
      className="fixed inset-0 z-[100] transition-all duration-700 ease-in-out"
    />
  );
}
