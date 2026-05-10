import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShutdownDialog from '@/components/desktop/ShutdownDialog';
import { useDesktopStore } from '@/store/desktop';
import type { AppId, WindowState } from '@/types/desktop';

describe('ShutdownDialog', () => {
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

  it('does not render when dialog is closed', () => {
    render(<ShutdownDialog />);
    expect(screen.queryByTestId('shutdown-dialog')).not.toBeInTheDocument();
  });

  it('renders when dialog is open', () => {
    useDesktopStore.setState({ shutdownDialogOpen: true });
    render(<ShutdownDialog />);
    expect(screen.getByTestId('shutdown-dialog')).toBeInTheDocument();
  });

  it('shows Korean text when locale is ko', () => {
    useDesktopStore.setState({ shutdownDialogOpen: true, locale: 'ko' });
    render(<ShutdownDialog />);
    expect(screen.getByText('시스템을 종료하시겠습니까?')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
    expect(screen.getByText('종료')).toBeInTheDocument();
  });

  it('shows English text when locale is en', () => {
    useDesktopStore.setState({ shutdownDialogOpen: true, locale: 'en' });
    render(<ShutdownDialog />);
    expect(screen.getByText('Shut down the system?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByTestId('shutdown-confirm')).toBeInTheDocument();
  });

  it('closes on cancel button click', () => {
    useDesktopStore.setState({ shutdownDialogOpen: true });
    render(<ShutdownDialog />);
    fireEvent.click(screen.getByTestId('shutdown-cancel'));
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(false);
  });

  it('closes on backdrop click', () => {
    useDesktopStore.setState({ shutdownDialogOpen: true });
    render(<ShutdownDialog />);
    fireEvent.click(screen.getByTestId('shutdown-backdrop'));
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(false);
  });

  it('closes on ESC key', () => {
    useDesktopStore.setState({ shutdownDialogOpen: true });
    render(<ShutdownDialog />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(useDesktopStore.getState().shutdownDialogOpen).toBe(false);
  });
});
