import { create } from 'zustand';
import type { AppId, WindowState } from '@/types/desktop';

interface DesktopStore {
  // State
  openApps: Record<AppId, WindowState | undefined>;
  focusedApp: AppId | null;
  menuOpen: boolean;
  locale: 'ko' | 'en';
  panelTime: string;
  zIndexCounter: number;

  // Actions
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  maximizeApp: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, width: number, height: number) => void;
  toggleMenu: () => void;
  setLocale: (locale: 'ko' | 'en') => void;
  updatePanelTime: () => void;
  isSleepMode: boolean;
  setIsSleepMode: (value: boolean) => void;
}

const APP_TITLES: Record<AppId, string> = {
  terminal: 'Terminal',
  browser: 'Web Browser',
  mail: 'Mail',
  video: 'Video Player',
  textviewer: 'Text Viewer',
  blackjack: 'Blackjack',
};

function getAppTitle(id: AppId, locale: 'ko' | 'en'): string {
  if (id === 'browser') {
    return locale === 'ko' ? '사생활 보호 모드' : 'Private Browsing';
  }
  return APP_TITLES[id];
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 550;
const STAGGER_OFFSET = 30;

function getStaggeredPosition(existingCount: number): { x: number; y: number } {
  const baseX = 80;
  const baseY = 80;
  const x = baseX + (existingCount * STAGGER_OFFSET) % 400;
  const y = baseY + (existingCount * STAGGER_OFFSET) % 300;
  return { x, y };
}

export const useDesktopStore = create<DesktopStore>()((set, get) => ({
  openApps: {} as Record<AppId, WindowState | undefined>,
  focusedApp: null,
  menuOpen: false,
  locale: 'ko',
  panelTime: new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }),
  zIndexCounter: 1,

  openApp: (id: AppId) => {
    const state = get();
    if (state.openApps[id] && !state.openApps[id]!.minimized) {
      get().focusApp(id);
      return;
    }
    if (state.openApps[id]?.minimized) {
      const newZIndex = state.zIndexCounter + 1;
      set({
        openApps: {
          ...state.openApps,
          [id]: { ...state.openApps[id]!, minimized: false, zIndex: newZIndex },
        },
        focusedApp: id,
        zIndexCounter: newZIndex,
      });
      return;
    }
    const existingCount = Object.values(state.openApps).filter(Boolean).length;
    const { x, y } = getStaggeredPosition(existingCount);
    const newZIndex = state.zIndexCounter + 1;
    set({
      openApps: {
        ...state.openApps,
        [id]: {
          id,
          title: getAppTitle(id, state.locale),
          x,
          y,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          minimized: false,
          maximized: false,
          zIndex: newZIndex,
        },
      },
      focusedApp: id,
      zIndexCounter: newZIndex,
    });
  },

  closeApp: (id: AppId) => {
    set((s) => {
      const { [id]: _removed, ...rest } = s.openApps;
      const remaining = Object.values(rest).filter(Boolean) as WindowState[];
      let newFocused: AppId | null = s.focusedApp;
      if (s.focusedApp === id) {
        newFocused = remaining.length > 0
          ? remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id
          : null;
      }
      return {
        openApps: rest as Record<AppId, WindowState | undefined>,
        focusedApp: newFocused,
      };
    });
  },

  focusApp: (id: AppId) => {
    const state = get();
    if (!state.openApps[id]) return;
    const newZIndex = state.zIndexCounter + 1;
    set({
      openApps: {
        ...state.openApps,
        [id]: { ...state.openApps[id]!, zIndex: newZIndex },
      },
      focusedApp: id,
      zIndexCounter: newZIndex,
    });
  },

  minimizeApp: (id: AppId) => {
    set((s) => ({
      openApps: {
        ...s.openApps,
        [id]: s.openApps[id]
          ? { ...s.openApps[id]!, minimized: true }
          : undefined,
      },
      focusedApp: s.focusedApp === id ? null : s.focusedApp,
    }));
  },

  maximizeApp: (id: AppId) => {
    set((s) => ({
      openApps: {
        ...s.openApps,
        [id]: s.openApps[id]
          ? { ...s.openApps[id]!, maximized: !s.openApps[id]!.maximized }
          : undefined,
      },
    }));
  },

  moveWindow: (id: AppId, x: number, y: number) => {
    set((s) => ({
      openApps: {
        ...s.openApps,
        [id]: s.openApps[id] ? { ...s.openApps[id]!, x, y } : undefined,
      },
    }));
  },

  resizeWindow: (id: AppId, width: number, height: number) => {
    set((s) => ({
      openApps: {
        ...s.openApps,
        [id]: s.openApps[id]
          ? {
              ...s.openApps[id]!,
              width: Math.max(300, width),
              height: Math.max(200, height),
            }
          : undefined,
      },
    }));
  },

  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  setLocale: (locale: 'ko' | 'en') => set({ locale }),

  updatePanelTime: () =>
    set({
      panelTime: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }),
  isSleepMode: false,
  setIsSleepMode: (value: boolean) => set({ isSleepMode: value }),
}));
