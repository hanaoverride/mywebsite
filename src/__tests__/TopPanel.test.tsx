import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopPanel from '@/components/desktop/TopPanel';
import { useDesktopStore } from '@/store/desktop';
import type { AppId, WindowState } from '@/types/desktop';

describe('TopPanel', () => {
  beforeEach(() => {
    useDesktopStore.setState({
      openApps: {} as Record<AppId, WindowState | undefined>,
      focusedApp: null,
      menuOpen: false,
      shutdownDialogOpen: false,
      locale: 'ko',
      panelTime: '20:33',
      zIndexCounter: 1,
    });
  });

  it('renders menu button', () => {
    render(<TopPanel />);
    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
  });

  it('displays time from store', () => {
    render(<TopPanel />);
    const timeEl = screen.getByTestId('panel-time');
    expect(timeEl.textContent).toContain('20:33');
  });

  it('displays system info', () => {
    render(<TopPanel />);
    expect(screen.getByText(/4000K/)).toBeInTheDocument();
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it('displays date in Korean format', () => {
    render(<TopPanel />);
    const timeEl = screen.getByTestId('panel-time');
    const koDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const hasKoDay = koDays.some((d) => timeEl.textContent?.includes(d));
    expect(hasKoDay).toBe(true);
  });
});
