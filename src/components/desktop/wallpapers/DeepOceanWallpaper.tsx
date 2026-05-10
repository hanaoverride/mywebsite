'use client';

import { useRef, memo } from 'react';
import { useCanvasParticles } from './useCanvasParticles';
import './wallpaper.css';

/**
 * Deep Ocean Live Wallpaper
 *
 * Layers (back to front):
 * 1. Animated gradient background (deep ocean with subtle hue cycling)
 * 2. Aurora glow bands (blurred gradient strips)
 * 3. Canvas particle layer (floating luminous plankton)
 * 4. Animated SVG wave layers (4 overlapping waves at different speeds)
 */
const DeepOceanWallpaper = memo(function DeepOceanWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasParticles(canvasRef, 55);

  return (
    <div
      data-testid="desktop-wallpaper"
      className="fixed inset-0 z-0 overflow-hidden"
    >
      {/* Layer 1 — Animated deep ocean gradient */}
      <div
        className="wallpaper-animated absolute inset-0"
        style={{
          background:
            'linear-gradient(170deg, #060d1f 0%, #0a1a35 15%, #0d2a4a 30%, #0f3d65 48%, #115a85 62%, #1478a5 76%, #1890b8 88%, #1ca3c4 100%)',
          animation: 'ocean-hue-shift 45s ease-in-out infinite',
          willChange: 'filter',
        }}
      />

      {/* Layer 2 — Aurora / Light caustic bands */}
      <div className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
        {/* Band 1 — wide cyan */}
        <div
          className="wallpaper-animated absolute"
          style={{
            top: '5%',
            left: '-20%',
            width: '140%',
            height: '25%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(28, 163, 196, 0.15) 30%, rgba(93, 217, 242, 0.2) 50%, rgba(28, 163, 196, 0.15) 70%, transparent 100%)',
            filter: 'blur(50px)',
            animation: 'aurora-drift-1 25s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />
        {/* Band 2 — blue-violet accent */}
        <div
          className="wallpaper-animated absolute"
          style={{
            top: '15%',
            left: '-10%',
            width: '120%',
            height: '20%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(88, 130, 230, 0.1) 25%, rgba(120, 160, 255, 0.15) 50%, rgba(88, 130, 230, 0.1) 75%, transparent 100%)',
            filter: 'blur(60px)',
            animation: 'aurora-drift-2 30s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />
        {/* Band 3 — teal, lower */}
        <div
          className="wallpaper-animated absolute"
          style={{
            top: '35%',
            left: '-15%',
            width: '130%',
            height: '18%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(20, 200, 180, 0.08) 30%, rgba(40, 220, 200, 0.12) 55%, rgba(20, 200, 180, 0.08) 75%, transparent 100%)',
            filter: 'blur(70px)',
            animation: 'aurora-drift-3 35s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />
      </div>

      {/* Layer 3 — Canvas particles (luminous plankton) */}
      <canvas
        ref={canvasRef}
        className="wallpaper-canvas absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Layer 4 — Animated SVG waves */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: '35%', zIndex: 2 }}>
        {/* Wave 1 — deepest, slowest */}
        <svg
          className="wallpaper-animated absolute bottom-0 left-0 w-[200%] h-full opacity-[0.07]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          style={{
            animation: 'wave-drift-1 20s ease-in-out infinite',
            willChange: 'transform',
          }}
        >
          <path
            fill="#1478a5"
            d="M0,120 C240,200 480,80 720,140 C960,200 1200,100 1440,160 C1680,220 1920,100 2160,140 C2400,180 2640,120 2880,160 L2880,320 L0,320 Z"
          />
        </svg>

        {/* Wave 2 */}
        <svg
          className="wallpaper-animated absolute bottom-0 left-0 w-[200%] h-full opacity-[0.12]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          style={{
            animation: 'wave-drift-2 15s ease-in-out infinite',
            willChange: 'transform',
          }}
        >
          <path
            fill="#1ca3c4"
            d="M0,160 C360,260 720,100 1080,160 C1260,190 1440,240 1720,180 C2000,120 2280,200 2560,160 C2720,140 2800,180 2880,200 L2880,320 L0,320 Z"
          />
        </svg>

        {/* Wave 3 */}
        <svg
          className="wallpaper-animated absolute bottom-0 left-0 w-[200%] h-full opacity-[0.18]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          style={{
            animation: 'wave-drift-3 12s ease-in-out infinite',
            willChange: 'transform',
          }}
        >
          <path
            fill="#1cb5d4"
            d="M0,192 C240,256 480,128 720,192 C960,256 1200,160 1440,192 C1680,224 1920,144 2160,192 C2400,240 2640,176 2880,210 L2880,320 L0,320 Z"
          />
        </svg>

        {/* Wave 4 — nearest, brightest, fastest */}
        <svg
          className="wallpaper-animated absolute bottom-0 left-0 w-[200%] h-full opacity-[0.22]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          style={{
            animation: 'wave-drift-4 10s ease-in-out infinite',
            willChange: 'transform',
          }}
        >
          <path
            fill="#5dd9f2"
            d="M0,224 C300,288 600,160 900,224 C1080,272 1320,208 1560,230 C1800,252 2040,180 2280,224 C2520,268 2700,220 2880,240 L2880,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(4, 8, 20, 0.3) 100%)',
          zIndex: 3,
        }}
      />
    </div>
  );
});

export default DeepOceanWallpaper;
