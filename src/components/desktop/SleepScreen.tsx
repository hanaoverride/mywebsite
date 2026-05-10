'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/desktop';
import { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';

export default function SleepScreen() {
  const isSleepMode = useDesktopStore((s) => s.isSleepMode);
  const setIsSleepMode = useDesktopStore((s) => s.setIsSleepMode);
  const locale = useDesktopStore((s) => s.locale);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [locale]);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsSleepMode(false);
      // Reset logging in state after a delay to allow for exit animation
      setTimeout(() => setIsLoggingIn(false), 500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isSleepMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-[20px]"
        >
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-8xl font-thin text-white/90 tracking-tighter mb-2">
                {time}
              </h1>
              <p className="text-xl text-white/50 font-light">
                {new Date().toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              {!isLoggingIn ? (
                <button
                  onClick={handleLogin}
                  className="group relative flex items-center gap-3 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-md"
                >
                  <LogIn size={20} className="text-white/80 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">
                    {locale === 'ko' ? '로그인' : 'Login'}
                  </span>
                </button>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-medium text-white tracking-wide"
                  >
                    {locale === 'ko' ? '환영합니다!' : 'Welcome back!'}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute bottom-12 text-white/40 text-sm font-light tracking-widest uppercase"
          >
            {locale === 'ko' ? '절전 모드' : 'Sleep Mode'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
