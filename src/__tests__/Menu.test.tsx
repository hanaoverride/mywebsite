import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Menu from '@/components/desktop/Menu';
import { useDesktopStore } from '@/store/desktop';

describe('Menu', () => {
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
      shutdownDialogOpen: false,
      zIndexCounter: 1,
    });
  });

  it('does not render when menuOpen is false', () => {
    render(<Menu />);
    expect(screen.queryByTestId('menu-overlay')).not.toBeInTheDocument();
  });

  it('renders when menuOpen is true', () => {
    useDesktopStore.setState({ menuOpen: true });
    render(<Menu />);
    expect(screen.getByTestId('menu-overlay')).toBeInTheDocument();
  });

  it('renders app grid items', () => {
    useDesktopStore.setState({ menuOpen: true });
    render(<Menu />);
    expect(screen.getByTestId('menu-app-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('menu-app-browser')).toBeInTheDocument();
  });

  it('opens app and closes menu on app click', () => {
    useDesktopStore.setState({ menuOpen: true });
    render(<Menu />);
    fireEvent.click(screen.getByTestId('menu-app-terminal'));
    expect(useDesktopStore.getState().menuOpen).toBe(false);
    expect(useDesktopStore.getState().openApps.terminal).toBeDefined();
  });

  it('shows shutdown dialog on power button click', () => {
    useDesktopStore.setState({ menuOpen: true });
    render(<Menu />);
    fireEvent.click(screen.getByTestId('menu-shutdown'));
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(true);
    expect(useDesktopStore.getState().menuOpen).toBe(false);
  });

  it('closes on click outside', () => {
    useDesktopStore.setState({ menuOpen: true });
    render(
      <div>
        <Menu />
        <div data-testid="outside">outside</div>
      </div>
    );
    expect(screen.getByTestId('menu-overlay')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(useDesktopStore.getState().menuOpen).toBe(false);
  });
});
