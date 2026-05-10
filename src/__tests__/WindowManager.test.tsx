import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WindowManager from '@/components/desktop/WindowManager';
import AppWindow from '@/components/desktop/AppWindow';
import { useDesktopStore } from '@/store/desktop';
import type { AppId, WindowState } from '@/types/desktop';

describe('WindowManager', () => {
  beforeEach(() => {
    useDesktopStore.setState({
      openApps: {} as Record<AppId, WindowState | undefined>,
      focusedApp: null,
      zIndexCounter: 1,
    });
  });

  it('renders nothing when no apps open', () => {
    const { container } = render(<WindowManager />);
    expect(container.firstChild).toBeNull();
  });

  it('renders window when app is open', () => {
    useDesktopStore.getState().openApp('terminal');
    render(<WindowManager />);
    expect(screen.getByTestId('window-terminal')).toBeInTheDocument();
  });

  it('does not render minimized windows', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().minimizeApp('terminal');
    render(<WindowManager />);
    expect(screen.queryByTestId('window-terminal')).not.toBeInTheDocument();
  });

  it('renders multiple windows', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().openApp('browser');
    render(<WindowManager />);
    expect(screen.getByTestId('window-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('window-browser')).toBeInTheDocument();
  });
});

describe('AppWindow', () => {
  const makeWin = (overrides: Partial<WindowState> = {}): WindowState => ({
    id: 'terminal',
    title: 'Terminal',
    x: 200,
    y: 200,
    width: 800,
    height: 550,
    minimized: false,
    maximized: false,
    zIndex: 5,
    ...overrides,
  });

  beforeEach(() => {
    useDesktopStore.setState({
      openApps: {} as Record<AppId, WindowState | undefined>,
      focusedApp: null,
      zIndexCounter: 1,
    });
  });

  it('renders title bar with window controls', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    expect(screen.getByTestId('titlebar-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('close-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('minimize-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('maximize-terminal')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });

  it('renders children content', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div data-testid="custom-content">Hello World</div>
      </AppWindow>,
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('returns null when minimized', () => {
    const win = makeWin({ minimized: true });
    const { container } = render(
      <AppWindow window={win}>
        <div>hidden</div>
      </AppWindow>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('close button removes app from store', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    fireEvent.click(screen.getByTestId('close-terminal'));
    expect(useDesktopStore.getState().openApps.terminal).toBeUndefined();
  });

  it('minimize button sets minimized=true', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    fireEvent.click(screen.getByTestId('minimize-terminal'));
    expect(useDesktopStore.getState().openApps.terminal!.minimized).toBe(true);
  });

  it('maximize button toggles maximized state', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    expect(useDesktopStore.getState().openApps.terminal!.maximized).toBe(false);
    fireEvent.click(screen.getByTestId('maximize-terminal'));
    expect(useDesktopStore.getState().openApps.terminal!.maximized).toBe(true);
    fireEvent.click(screen.getByTestId('maximize-terminal'));
    expect(useDesktopStore.getState().openApps.terminal!.maximized).toBe(false);
  });

  it('clicking window focuses it (bumps zIndex)', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    const oldZ = win.zIndex;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    fireEvent.mouseDown(screen.getByTestId('window-terminal'));
    const newState = useDesktopStore.getState();
    expect(newState.openApps.terminal!.zIndex).toBeGreaterThan(oldZ);
    expect(newState.focusedApp).toBe('terminal');
  });

  it('has resize handle when not maximized', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    expect(screen.getByTestId('resize-terminal')).toBeInTheDocument();
  });

  it('hides resize handle when maximized', () => {
    const win = makeWin({ maximized: true });
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    expect(screen.queryByTestId('resize-terminal')).not.toBeInTheDocument();
  });

  it('shows title bar in maximized state', () => {
    const win = makeWin({ maximized: true });
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    expect(screen.getByTestId('window-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('titlebar-terminal')).toBeInTheDocument();
  });

  it('drag via title bar mousedown + mousemove updates position', () => {
    useDesktopStore.getState().openApp('terminal');
    const initial = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={initial}>
        <div>content</div>
      </AppWindow>,
    );

    const titlebar = screen.getByTestId('titlebar-terminal');
    fireEvent.mouseDown(titlebar, { clientX: 250, clientY: 250 });
    fireEvent.mouseMove(window, { clientX: 350, clientY: 300 });
    fireEvent.mouseUp(window);

    const updated = useDesktopStore.getState().openApps.terminal!;
    // Should have moved: initial.x + (350 - 250) = initial.x + 100
    expect(updated.x).toBeGreaterThan(initial.x);
    expect(updated.y).toBeGreaterThan(initial.y);
  });

  it('resize via handle mousedown + mousemove updates dimensions', () => {
    useDesktopStore.getState().openApp('terminal');
    const initial = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={initial}>
        <div>content</div>
      </AppWindow>,
    );

    const handle = screen.getByTestId('resize-terminal');
    fireEvent.mouseDown(handle, { clientX: 1000, clientY: 750 });
    fireEvent.mouseMove(window, { clientX: 1100, clientY: 850 });
    fireEvent.mouseUp(window);

    const updated = useDesktopStore.getState().openApps.terminal!;
    expect(updated.width).toBeGreaterThan(initial.width);
    expect(updated.height).toBeGreaterThan(initial.height);
  });

  it('resize enforces minimum 300x200', () => {
    useDesktopStore.getState().openApp('terminal');
    const initial = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={initial}>
        <div>content</div>
      </AppWindow>,
    );

    const handle = screen.getByTestId('resize-terminal');
    // Try to shrink below minimum — drag far left/up
    fireEvent.mouseDown(handle, { clientX: 1000, clientY: 750 });
    fireEvent.mouseMove(window, { clientX: 500, clientY: 400 });
    fireEvent.mouseUp(window);

    const updated = useDesktopStore.getState().openApps.terminal!;
    expect(updated.width).toBe(300);
    expect(updated.height).toBe(200);
  });

  it('does not drag maximized windows', () => {
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().maximizeApp('terminal');
    const initial = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={initial}>
        <div>content</div>
      </AppWindow>,
    );

    const titlebar = screen.getByTestId('titlebar-terminal');
    fireEvent.mouseDown(titlebar, { clientX: 250, clientY: 250 });
    fireEvent.mouseMove(window, { clientX: 500, clientY: 500 });
    fireEvent.mouseUp(window);

    const updated = useDesktopStore.getState().openApps.terminal!;
    expect(updated.maximized).toBe(true);
  });

  it('clamps drag to viewport (top/left edges)', () => {
    // Force a window very close to top-left edge
    useDesktopStore.getState().openApp('terminal');
    useDesktopStore.getState().moveWindow('terminal', 50, 50);
    const initial = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={initial}>
        <div>content</div>
      </AppWindow>,
    );

    const titlebar = screen.getByTestId('titlebar-terminal');
    // Try dragging above viewport
    fireEvent.mouseDown(titlebar, { clientX: 70, clientY: 70 });
    fireEvent.mouseMove(window, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(window);

    const updated = useDesktopStore.getState().openApps.terminal!;
    expect(updated.x).toBeGreaterThanOrEqual(0);
    expect(updated.y).toBeGreaterThanOrEqual(32);
  });

  it('window is positioned with correct zIndex from store', () => {
    useDesktopStore.getState().openApp('terminal');
    const win = useDesktopStore.getState().openApps.terminal!;
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    const el = screen.getByTestId('window-terminal');
    expect(el.style.zIndex).toBe(String(win.zIndex));
  });

  it('window shows maximized styling when maximized', () => {
    const win = makeWin({ maximized: true });
    render(
      <AppWindow window={win}>
        <div>content</div>
      </AppWindow>,
    );
    const el = screen.getByTestId('window-terminal');
    expect(el.style.left).toBe('0px');
    expect(el.style.width).toBe('100%');
  });
});
