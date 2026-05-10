'use client';

import { useRef, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextViewer() {
  const t = useTranslations('apps.textviewer');
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const defaultContent = t('defaultContent');
  const lineCount = useMemo(() => defaultContent.split('\n').length, [defaultContent]);

  const handleScroll = () => {
    if (contentRef.current) {
      setScrollTop(contentRef.current.scrollTop);
    }
  };

  return (
    <div className="h-full flex bg-[#272822]" data-testid="text-viewer">
      <div
        className="w-12 flex-shrink-0 bg-[#1e1f1c] text-[#75715E] text-xs font-mono text-right px-2 py-3 select-none overflow-hidden border-r border-gray-700/30"
        style={{ transform: `translateY(-${scrollTop}px)` }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} style={{ lineHeight: '1.5rem' }}>
            {i + 1}
          </div>
        ))}
      </div>
      <div
        ref={contentRef}
        className="flex-1 overflow-auto text-[#F8F8F2] text-sm font-mono p-3"
        style={{ lineHeight: '1.5rem' }}
        onScroll={handleScroll}
        data-testid="text-viewer-content"
      >
        {defaultContent.split('\n').map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line.startsWith('# ') ? (
              <span className="text-yellow-300 font-bold">{line}</span>
            ) : line.startsWith('#') ? (
              <span className="text-orange-300">{line}</span>
            ) : (
              <span>{line}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
