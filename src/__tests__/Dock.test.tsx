import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
      },
      menuOpen: false,
      focusedApp: null,
      zIndexCounter: 1,
    });
  });

  it('renders all 7 dock icons', () => {
    render(<Dock />);
    expect(screen.getByTestId('dock-icon-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-browser')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-mail')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-video')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-textviewer')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-blackjack')).toBeInTheDocument();
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
});
