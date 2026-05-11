import { describe, it, expect, beforeEach } from 'vitest';
import type { AppId, WindowState } from '@/types';
import { useDesktopStore } from '@/store/desktop';

describe('Desktop Store', () => {
  beforeEach(() => {
    useDesktopStore.setState({
      openApps: {} as Record<AppId, WindowState | undefined>,
      focusedApp: null,
      menuOpen: false,
      shutdownDialogOpen: false,
      locale: 'en',
      panelTime: '',
      zIndexCounter: 1,
    });
  });

  it('should open an app with default position and title', () => {
    useDesktopStore.getState().openApp('terminal');
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal).toBeDefined();
    expect(state.openApps.terminal!.id).toBe('terminal');
    expect(state.openApps.terminal!.title).toBe('Terminal');
    expect(state.openApps.terminal!.minimized).toBe(false);
    expect(state.openApps.terminal!.maximized).toBe(false);
    expect(state.openApps.terminal!.width).toBe(800);
    expect(state.openApps.terminal!.height).toBe(550);
    expect(state.focusedApp).toBe('terminal');
  });

  it('should close an app and clear focus if it was focused', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().closeApp('terminal');
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal).toBeUndefined();
    expect(state.focusedApp).toBeNull();
  });

  it('should focus an app and bump its zIndex', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    const zBefore = useDesktopStore.getState().openApps.terminal!.zIndex;
    useDesktopStore.getState().focusApp('terminal');
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal!.zIndex).toBeGreaterThan(zBefore);
    expect(state.focusedApp).toBe('terminal');
  });

  it('should minimize an app and clear focus', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().minimizeApp('terminal');
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal!.minimized).toBe(true);
    expect(state.focusedApp).toBeNull();
  });

  it('should toggle maximized state on and off', () => {
    useDesktopStore.getState().openApp('terminal');
    expect(useDesktopStore.getState().openApps.terminal!.maximized).toBe(false);
    useDesktopStore.getState().maximizeApp('terminal');
    expect(useDesktopStore.getState().openApps.terminal!.maximized).toBe(true);
    useDesktopStore.getState().maximizeApp('terminal');
    expect(useDesktopStore.getState().openApps.terminal!.maximized).toBe(false);
  });

  it('should toggle menu open and close', () => {
    expect(useDesktopStore.getState().menuOpen).toBe(false);
    useDesktopStore.getState().toggleMenu();
    expect(useDesktopStore.getState().menuOpen).toBe(true);
    useDesktopStore.getState().toggleMenu();
    expect(useDesktopStore.getState().menuOpen).toBe(false);
  });

  it('should move a window to new coordinates', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().moveWindow('terminal', 200, 300);
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal!.x).toBe(200);
    expect(state.openApps.terminal!.y).toBe(300);
  });

  it('should resize a window enforcing minimum constraints', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().resizeWindow('terminal', 100, 100);
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal!.width).toBe(300);
    expect(state.openApps.terminal!.height).toBe(200);
  });

  it('should focus instead of duplicating an already-open app', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    const count = Object.values(useDesktopStore.getState().openApps).filter(Boolean).length;
    useDesktopStore.getState().openApp('terminal');
    const countAfter = Object.values(useDesktopStore.getState().openApps).filter(Boolean).length;
    expect(countAfter).toBe(count);
    expect(useDesktopStore.getState().focusedApp).toBe('terminal');
  });

  it('should restore a minimized app on openApp', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().minimizeApp('terminal');
    expect(useDesktopStore.getState().openApps.terminal!.minimized).toBe(true);
    useDesktopStore.getState().openApp('terminal');
    expect(useDesktopStore.getState().openApps.terminal!.minimized).toBe(false);
    expect(useDesktopStore.getState().focusedApp).toBe('terminal');
  });

  it('should stagger positions for multiple windows', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    useDesktopStore.getState().openApp('mail');
    const t1 = useDesktopStore.getState().openApps.terminal!;
    const t2 = useDesktopStore.getState().openApps.browser!;
    const t3 = useDesktopStore.getState().openApps.mail!;
    expect(t1.x).not.toBe(t2.x);
    expect(t1.y).not.toBe(t2.y);
    expect(t2.x).not.toBe(t3.x);
    expect(t2.y).not.toBe(t3.y);
  });

  it('should assign increasing zIndex values to new windows', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    useDesktopStore.getState().openApp('mail');
    const z1 = useDesktopStore.getState().openApps.terminal!.zIndex;
    const z2 = useDesktopStore.getState().openApps.browser!.zIndex;
    const z3 = useDesktopStore.getState().openApps.mail!.zIndex;
    expect(z2).toBeGreaterThan(z1);
    expect(z3).toBeGreaterThan(z2);
  });

  it('should show and hide the shutdown dialog', () => {
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(false);
    useDesktopStore.getState().showShutdownDialog();
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(true);
    useDesktopStore.getState().hideShutdownDialog();
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(false);
  });

  it('should set locale to ko or en', () => {
    useDesktopStore.getState().setLocale('ko');
    expect(useDesktopStore.getState().locale).toBe('ko');
    useDesktopStore.getState().setLocale('en');
    expect(useDesktopStore.getState().locale).toBe('en');
    useDesktopStore.getState().setLocale('ko');
    expect(useDesktopStore.getState().locale).toBe('ko');
  });

  it('should update panel time with formatted time string', () => {
    useDesktopStore.getState().updatePanelTime();
    expect(useDesktopStore.getState().panelTime).toMatch(/\d{2}:\d{2}/);
  });

  it('should move focus to remaining app with highest zIndex on close', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    useDesktopStore.getState().focusApp('browser');
    useDesktopStore.getState().closeApp('browser');
    expect(useDesktopStore.getState().focusedApp).toBe('terminal');
  });

  it('should not affect focus when closing a non-focused app', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    useDesktopStore.getState().closeApp('terminal');
    expect(useDesktopStore.getState().focusedApp).toBe('browser');
  });

  it('should do nothing when closing a non-existent app', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().closeApp('mail');
    expect(useDesktopStore.getState().openApps.terminal).toBeDefined();
    expect(useDesktopStore.getState().focusedApp).toBe('terminal');
  });
});
