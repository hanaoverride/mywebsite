'use client';

import { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Monitor, 
  Laptop,
  Terminal,
  Settings, 
  PlayCircle, 
  Mail, 
  Globe, 
  FileText,
  Home,
  Layers,
  Touchpad,
  Smartphone,
  Grid
} from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const STORAGE_KEY = 'onboarding_completed';

const DESKTOP_STEP_ICONS = [
  Monitor,
  Laptop,
  Terminal,
  Settings,
  PlayCircle,
  Mail,
  Globe,
  FileText,
];

const MOBILE_STEP_ICONS = [
  Smartphone,
  Grid,
  Layers,
  Home,
  Terminal,
];

export default function OnboardingGuide() {
  const t = useTranslations('apps.onboarding');
  const closeApp = useDesktopStore((s) => s.closeApp);
  const setMobileScreen = useDesktopStore((s) => s.setMobileScreen);
  const isMobile = useIsMobile();
  
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [showRevisitDialog, setShowRevisitDialog] = useState(false);
  const initialised = useRef(false);

  const totalSteps = isMobile ? 5 : 8;
  const STEP_ICONS = isMobile ? MOBILE_STEP_ICONS : DESKTOP_STEP_ICONS;
  const stepPrefix = isMobile ? 'mobileSteps' : 'steps';

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const completed = localStorage.getItem(STORAGE_KEY) === 'true';
    // Schedule state update outside the synchronous effect body
    // to satisfy the react-hooks/set-state-in-effect rule.
    queueMicrotask(() => {
      if (completed) {
        setShowRevisitDialog(true);
      } else {
        setStarted(true);
      }
    });
  }, []);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    closeApp('onboarding');
    if (isMobile) {
      setMobileScreen('home');
    }
  };

  const handleRevisit = () => {
    setShowRevisitDialog(false);
    setStarted(true);
    setStep(0);
  };

  const handleCancelRevisit = () => {
    closeApp('onboarding');
    if (isMobile) {
      setMobileScreen('home');
    }
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-bold bg-blue-500/20 px-1 rounded">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (showRevisitDialog) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-6 text-white text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-sm w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl"
        >
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Monitor className="text-blue-400" size={32} />
          </div>
          <h2 className="text-xl font-bold mb-3">{t('revisitTitle')}</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            {t('revisitDescription')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCancelRevisit}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-600 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
            >
              {t('prev')}
            </button>
            <button
              onClick={handleRevisit}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-colors"
            >
              {t('start')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!started) return null;

  const Icon = STEP_ICONS[step];

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white overflow-hidden relative select-none">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-lg w-full"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-900/30">
              <Icon size={48} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {t(`${stepPrefix}.${step + 1}.title`)}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
              {renderContent(t(`${stepPrefix}.${step + 1}.content`))}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 border-t border-white/5 flex flex-col items-center gap-6 z-10 bg-gray-900/50 backdrop-blur-md">
        {/* Step Indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-blue-500' : 'w-1.5 bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between w-full max-w-md">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
              step === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ChevronLeft size={20} />
            <span>{t('prev')}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
          >
            <span>{step === totalSteps - 1 ? t('finish') : t('next')}</span>
            {step === totalSteps - 1 ? <Check size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

