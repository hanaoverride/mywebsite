'use client';

import { useDesktopStore } from '@/store/desktop';
import { navigationData } from '@/data/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ExternalLink, AppWindow, ChevronRight } from 'lucide-react';
import { AppId } from '@/types/desktop';

export default function Navigator() {
  const t = useTranslations('apps.navigator');
  const locale = useDesktopStore((s) => s.locale);
  const openApp = useDesktopStore((s) => s.openApp);
  const isKo = locale === 'ko';

  const { about, links } = navigationData;

  const handleLinkClick = (item: typeof links[0]) => {
    if (item.type === 'external') {
      window.open(item.target, '_blank', 'noopener,noreferrer');
    } else {
      openApp(item.target as AppId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-white overflow-y-auto custom-scrollbar select-none">
      {/* Hero / About Section */}
      <div className="p-8 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {about.greeting[locale]}
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-2xl mb-8">
            {about.bio[locale]}
          </p>

          <div className="flex flex-wrap gap-3">
            {about.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-slate-300"
              >
                <span>{h.icon}</span>
                <span>{h.label[locale]}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Links Section */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {t('linksSection')}
          </h3>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleLinkClick(item)}
              className="group flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all text-left"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800 group-hover:bg-blue-600/20 rounded-xl text-2xl transition-colors">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                    {item.label[locale]}
                  </span>
                  {item.type === 'external' ? (
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-blue-400" />
                  ) : (
                    <AppWindow size={12} className="text-slate-500 group-hover:text-cyan-400" />
                  )}
                </div>
                <p className="text-sm text-slate-500 group-hover:text-slate-400 line-clamp-1 transition-colors">
                  {item.description[locale]}
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-700 group-hover:text-slate-400 mt-1 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
