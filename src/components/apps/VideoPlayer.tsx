'use client';

import { useDesktopStore } from '@/store/desktop';
import { Clapperboard } from 'lucide-react';

const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com';
const IS_DEFAULT = YOUTUBE_URL === 'https://www.youtube.com';

export default function VideoPlayer() {
  const locale = useDesktopStore((s) => s.locale);
  const isKo = locale === 'ko';

  const handleOpen = () => {
    window.open(YOUTUBE_URL, '_blank');
  };

  return (
    <div
      className="h-full flex flex-col items-center justify-center gap-4 p-6 bg-gray-900"
      data-testid="video-player"
    >
      <Clapperboard size={48} className="text-red-500" />
      <h2 className="text-white text-lg font-semibold">
        {isKo ? '비디오 플레이어' : 'Video Player'}
      </h2>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        {isKo ? '유튜브 채널로 연결됩니다' : 'Redirects to YouTube channel'}
      </p>
      <button
        data-testid="video-open-btn"
        onClick={handleOpen}
        className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm font-medium"
      >
        {isKo ? '열기' : 'Open'}
      </button>
      {IS_DEFAULT && (
        <p
          className="text-yellow-500/70 text-xs mt-2"
          data-testid="video-fallback-note"
        >
          {isKo
            ? 'YouTube URL이 설정되지 않았습니다'
            : 'YouTube URL not configured'}
        </p>
      )}
    </div>
  );
}
