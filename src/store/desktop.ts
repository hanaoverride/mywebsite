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
  hasAutoOpened: boolean;

  // Actions
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  maximizeApp: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, width: number, height: number) => void;
  markAppAsNotNew: (id: AppId) => void;
  toggleMenu: () => void;
  setLocale: (locale: 'ko' | 'en') => void;
  updatePanelTime: () => void;
  isSleepMode: boolean;
  setIsSleepMode: (value: boolean) => void;
  colorTemperature: number;
  setColorTemperature: (value: number) => void;
  weather: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  } | null;
  fetchWeather: () => Promise<void>;
}

const APP_TITLES: Record<'ko' | 'en', Record<AppId, string>> = {
  ko: {
    terminal: '터미널',
    browser: '웹 브라우저',
    mail: '메일',
    video: '비디오 플레이어',
    textviewer: '텍스트 뷰어',
    blackjack: '블랙잭',
  },
  en: {
    terminal: 'Terminal',
    browser: 'Web Browser',
    mail: 'Mail',
    video: 'Video Player',
    textviewer: 'Text Viewer',
    blackjack: 'Blackjack',
  },
};

function getAppTitle(id: AppId, locale: 'ko' | 'en'): string {
  if (id === 'browser') {
    return locale === 'ko' ? '하나의 포트폴리오' : "Hana's Portfolio";
  }
  return APP_TITLES[locale][id];
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 550;
const STAGGER_OFFSET = 30;

function getStaggeredPosition(existingCount: number): { x: number; y: number } {
  // Default fallback if window is not defined
  let baseX = 80;
  let baseY = 80;

  if (typeof window !== 'undefined') {
    baseX = Math.max(40, (window.innerWidth - DEFAULT_WIDTH) / 2);
    baseY = Math.max(60, (window.innerHeight - DEFAULT_HEIGHT) / 2);
  }

  // Staggering effect
  const x = baseX + (existingCount * STAGGER_OFFSET) % 300;
  const y = baseY + (existingCount * STAGGER_OFFSET) % 200;
  
  return { x, y };
}

export const useDesktopStore = create<DesktopStore>()((set, get) => ({
  openApps: {} as Record<AppId, WindowState | undefined>,
  focusedApp: null,
  menuOpen: false,
  locale: 'ko',
  panelTime: '', // Initialized on client
  zIndexCounter: 1,
  hasAutoOpened: false,

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
          [id]: { ...state.openApps[id]!, minimized: false, zIndex: newZIndex, isNew: false },
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
          isNew: true,
        },
      },
      focusedApp: id,
      zIndexCounter: newZIndex,
      hasAutoOpened: true,
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
  
  markAppAsNotNew: (id: AppId) => {
    set((s) => ({
      openApps: {
        ...s.openApps,
        [id]: s.openApps[id] ? { ...s.openApps[id]!, isNew: false } : undefined,
      },
    }));
  },

  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  setLocale: (locale: 'ko' | 'en') => {
    set((state) => {
      const updatedOpenApps = { ...state.openApps };
      (Object.keys(updatedOpenApps) as AppId[]).forEach((id) => {
        if (updatedOpenApps[id]) {
          updatedOpenApps[id] = {
            ...updatedOpenApps[id]!,
            title: getAppTitle(id, locale),
          };
        }
      });
      return { locale, openApps: updatedOpenApps };
    });
  },

  updatePanelTime: () => {
    const { locale } = get();
    set({
      panelTime: new Date().toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  },
  isSleepMode: false,
  setIsSleepMode: (value: boolean) => set({ isSleepMode: value }),
  colorTemperature: 6500,
  setColorTemperature: (value: number) => set({ colorTemperature: value }),
  weather: null,
  fetchWeather: async () => {
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=35.1531&longitude=129.1189&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=auto',
      );
      const data = await res.json();
      if (data.current) {
        const code = data.current.weather_code;
        let condition = 'Clear';
        let icon = '☀️';

        if (code === 0) {
          condition = 'Clear';
          icon = '☀️';
        } else if (code >= 1 && code <= 3) {
          condition = 'Cloudy';
          icon = '⛅';
        } else if (code === 45 || code === 48) {
          condition = 'Fog';
          icon = '🌫️';
        } else if ((code >= 51 && code <= 55) || (code >= 80 && code <= 82)) {
          condition = 'Rain';
          icon = '🌦️';
        } else if (code >= 61 && code <= 65) {
          condition = 'HeavyRain';
          icon = '🌧️';
        } else if (code >= 71 && code <= 77) {
          condition = 'Snow';
          icon = '❄️';
        } else if (code >= 95) {
          condition = 'Thunderstorm';
          icon = '⚡';
        }

        set({
          weather: {
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            condition,
            icon,
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  },
}));
