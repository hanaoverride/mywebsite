import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Dock from '@/components/desktop/Dock';
import { useDesktopStore } from '@/store/desktop';

describe('Dock', () => {
  beforeEach(() => {
    useDesktopStore.setState({
      openApps: {
        terminal: undefined,
        browser: undefined,
        mail: undefined,
        video: undefined,
        textviewer: undefined,
        blackjack: undefined,
        onboarding: undefined,
      },
      menuOpen: false,
      focusedApp: null,
      zIndexCounter: 1,
    });
  });

  it('renders all 8 dock icons', () => {
    render(<Dock />);
    expect(screen.getByTestId('dock-icon-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-browser')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-mail')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-video')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-textviewer')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-blackjack')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-onboarding')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-menu')).toBeInTheDocument();
  });

  it('opens app on icon click', () => {
    render(<Dock />);
    fireEvent.click(screen.getByTestId('dock-icon-terminal'));
    const state = useDesktopStore.getState();
    expect(state.openApps.terminal).toBeDefined();
    expect(state.focusedApp).toBe('terminal');
  });

  it('shows active dot for open apps', () => {
    useDesktopStore.getState().openApp('terminal');
    render(<Dock />);
    expect(screen.getByTestId('dock-dot-terminal')).toBeInTheDocument();
  });

  it('toggles menu on menu icon click', () => {
    render(<Dock />);
    fireEvent.click(screen.getByTestId('dock-icon-menu'));
    expect(useDesktopStore.getState().menuOpen).toBe(true);
    fireEvent.click(screen.getByTestId('dock-icon-menu'));
    expect(useDesktopStore.getState().menuOpen).toBe(false);
  });

  describe('integration: all 7 app icons', () => {
    const SEVEN_APPS = ['terminal', 'browser', 'mail', 'video', 'textviewer', 'blackjack', 'onboarding'] as const;

    it('each icon click opens correct app', () => {
      render(<Dock />);
      for (const id of SEVEN_APPS) {
        fireEvent.click(screen.getByTestId(`dock-icon-${id}`));
        const state = useDesktopStore.getState();
        expect(state.openApps[id]).toBeDefined();
        expect(state.focusedApp).toBe(id);
      }
    });

    it('all 7 apps open simultaneously → 7 dots visible', () => {
      for (const id of SEVEN_APPS) {
        useDesktopStore.getState().openApp(id);
      }
      render(<Dock />);
      for (const id of SEVEN_APPS) {
        expect(screen.getByTestId(`dock-dot-${id}`)).toBeInTheDocument();
      }
    });
  });

  describe('edge cases', () => {
    it('clicking already-open app focuses it without creating duplicate', () => {
      const store = useDesktopStore.getState();
      store.openApp('terminal');
      store.openApp('browser'); // Focus browser instead
      
      const firstEntry = useDesktopStore.getState().openApps.terminal!;
      const firstZIndex = firstEntry.zIndex;
      const openValues = Object.values(useDesktopStore.getState().openApps);
      const appCount = openValues.filter(Boolean).length;

      render(<Dock />);
      fireEvent.click(screen.getByTestId('dock-icon-terminal'));

      const state = useDesktopStore.getState();
      expect(state.openApps.terminal).toBeDefined();
      expect(state.focusedApp).toBe('terminal');
      // zIndex increases (was focused)
      expect(state.openApps.terminal!.zIndex).toBeGreaterThan(firstZIndex);
      // No duplicate — same object reference identity preserved
      expect(state.openApps.terminal!.id).toBe('terminal');
      // App count unchanged
      const newOpenValues = Object.values(state.openApps);
      const newCount = newOpenValues.filter(Boolean).length;
      expect(newCount).toBe(appCount);
    });

    it('dot disappears when app is closed via store', () => {
      useDesktopStore.getState().openApp('browser');
      render(<Dock />);
      expect(screen.getByTestId('dock-dot-browser')).toBeInTheDocument();

      act(() => {
        useDesktopStore.getState().closeApp('browser');
      });
      expect(screen.queryByTestId('dock-dot-browser')).not.toBeInTheDocument();
    });

    it('menu icon never shows a dot', () => {
      useDesktopStore.getState().openApp('browser');
      render(<Dock />);
      // browser has a dot
      expect(screen.getByTestId('dock-dot-browser')).toBeInTheDocument();
      // menu never does
      expect(screen.queryByTestId('dock-dot-menu')).not.toBeInTheDocument();
    });

    it('clicking dock icon when menu is open does not interfere', () => {
      useDesktopStore.setState({ menuOpen: true });
      render(<Dock />);
      fireEvent.click(screen.getByTestId('dock-icon-terminal'));
      expect(useDesktopStore.getState().openApps.terminal).toBeDefined();
      expect(useDesktopStore.getState().menuOpen).toBe(true); // menu stays open
    });
  });
});
