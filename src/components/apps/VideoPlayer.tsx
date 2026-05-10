'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Clapperboard } from 'lucide-react';

const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/embed/gVWrPX3Uz9Q';
const IS_DEFAULT = YOUTUBE_URL.includes('youtube.com/embed/');

/**
 * Memoized iframe — has zero locale-dependent props/hooks,
 * so it never re-renders (and thus never remounts) when the
 * language is switched.
 */
const VideoIframe = memo(function VideoIframe() {
  return (
    <div className="flex-1 relative">
      <iframe
        src={`${YOUTUBE_URL}?autoplay=0&rel=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
});

/** Status bar with translated labels — safe to re-render. */
function VideoStatusBar() {
  const t = useTranslations('apps.video');

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md px-4 py-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <Clapperboard size={14} className="text-red-500" />
        <span className="font-medium">{t('nowPlaying')}</span>
      </div>
      <a
        href={YOUTUBE_URL.replace('/embed/', '/watch?v=')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors flex items-center gap-1"
      >
        {t('viewOnYoutube')}
        <span className="text-[10px]">↗</span>
      </a>
    </div>
  );
}

export default function VideoPlayer() {
  if (!IS_DEFAULT) {
    return <VideoNotConfigured />;
  }

  return (
    <div className="h-full w-full bg-black flex flex-col overflow-hidden">
      <VideoIframe />
      <VideoStatusBar />
    </div>
  );
}

/** Fallback when no embed URL is set. */
function VideoNotConfigured() {
  const t = useTranslations('apps.video');

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-6 bg-black text-white">
      <Clapperboard size={48} className="text-red-500" />
      <h2 className="text-lg font-semibold">{t('title')}</h2>
      <p className="text-gray-400 text-sm text-center">{t('notConfigured')}</p>
    </div>
  );
}


