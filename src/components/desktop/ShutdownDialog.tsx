'use client';

import { useEffect, useCallback } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { Power } from 'lucide-react';

export default function ShutdownDialog() {
  const shutdownDialogOpen = useDesktopStore((s) => s.shutdownDialogOpen);
  const hideShutdownDialog = useDesktopStore((s) => s.hideShutdownDialog);
  const locale = useDesktopStore((s) => s.locale);

  const isKo = locale === 'ko';

  const handleShutdown = useCallback(() => {
    hideShutdownDialog();
    try {
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          alert(isKo ? '페이지를 닫아주세요' : 'Please close this page');
        }
      }, 300);
    } catch {
      alert(isKo ? '페이지를 닫아주세요' : 'Please close this page');
    }
  }, [hideShutdownDialog, isKo]);

  useEffect(() => {
    if (!shutdownDialogOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideShutdownDialog();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shutdownDialogOpen, hideShutdownDialog]);

  if (!shutdownDialogOpen) return null;

  return (
    <div
      data-testid="shutdown-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        data-testid="shutdown-backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={hideShutdownDialog}
      />

      <div className="relative bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <Power size={24} className="text-red-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              {isKo ? '시스템 종료' : 'Shut Down'}
            </h2>
            <p className="text-sm text-gray-400">
              {isKo ? '시스템을 종료하시겠습니까?' : 'Shut down the system?'}
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              data-testid="shutdown-cancel"
              onClick={hideShutdownDialog}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors text-sm"
            >
              {isKo ? '취소' : 'Cancel'}
            </button>
            <button
              data-testid="shutdown-confirm"
              onClick={handleShutdown}
              className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors text-sm font-medium"
            >
              {isKo ? '종료' : 'Shut Down'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
