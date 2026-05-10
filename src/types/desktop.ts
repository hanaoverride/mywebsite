export type AppId = 'terminal' | 'browser' | 'mail' | 'video' | 'textviewer' | 'blackjack';

export interface WindowState {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  isNew: boolean;
}

export interface DesktopState {
  openApps: Record<AppId, WindowState | undefined>;
  focusedApp: AppId | null;
  menuOpen: boolean;
  shutdownDialogOpen: boolean;
  locale: 'ko' | 'en';
  panelTime: string;
}

export interface MenuState {
  open: boolean;
  selectedCategory: string | null;
}

export interface PanelInfo {
  time: string;
  date: string;
  temperature: string;
  battery: string;
  weather: string;
}
