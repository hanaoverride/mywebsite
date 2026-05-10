'use client';

import { useTranslations } from 'next-intl';

export default function TextViewer() {
  const t = useTranslations('apps.textviewer');

  const defaultContent = t('defaultContent');

  return (
    <div className="h-full overflow-auto bg-[#272822] custom-scrollbar" data-testid="text-viewer">
      <div className="min-w-full inline-block pt-3 pb-8">
        {defaultContent.split('\n').map((line, i) => (
          <div key={i} className="flex group hover:bg-white/5">
            <div className="w-12 flex-shrink-0 bg-[#1e1f1c]/50 text-[#75715E] text-xs font-mono text-right px-2 py-1 select-none border-r border-gray-700/30 sticky left-0 z-10">
              {i + 1}
            </div>
            <div 
              className="flex-1 text-[#F8F8F2] text-sm font-mono px-3 py-0.5 whitespace-pre-wrap break-words overflow-hidden"
              style={{ lineHeight: '1.5rem' }}
            >
              {line.startsWith('# ') ? (
                <span className="text-yellow-300 font-bold">{line}</span>
              ) : line.startsWith('#') ? (
                <span className="text-orange-300">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
