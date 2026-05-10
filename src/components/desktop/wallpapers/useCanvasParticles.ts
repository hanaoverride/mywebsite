'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaDir: number;
  hue: number;
}

/**
 * Custom hook that renders soft, luminous plankton-like particles
 * on a full-screen canvas using requestAnimationFrame.
 * Automatically pauses when the tab is hidden.
 */
export function useCanvasParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  particleCount = 60,
) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.15 - 0.1, // slight upward bias
          radius: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
          alphaDir: (Math.random() - 0.5) * 0.005,
          hue: 180 + Math.random() * 40, // cyan-ish range
        });
      }
      particlesRef.current = particles;
    },
    [particleCount],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Update alpha (twinkle)
        p.alpha += p.alphaDir;
        if (p.alpha > 0.6 || p.alpha < 0.05) {
          p.alphaDir *= -1;
        }

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw glow
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 4,
        );
        gradient.addColorStop(
          0,
          `hsla(${p.hue}, 80%, 75%, ${p.alpha})`,
        );
        gradient.addColorStop(
          1,
          `hsla(${p.hue}, 80%, 75%, 0)`,
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${p.alpha * 1.5})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [canvasRef, initParticles]);
}
