import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DesktopWallpaper from '@/components/desktop/DesktopWallpaper';

describe('DesktopWallpaper', () => {
  it('renders with test id', () => {
    render(<DesktopWallpaper />);
    expect(screen.getByTestId('desktop-wallpaper')).toBeInTheDocument();
  });

  it('is positioned fixed at z-0', () => {
    render(<DesktopWallpaper />);
    const el = screen.getByTestId('desktop-wallpaper');
    expect(el.className).toContain('z-0');
    expect(el.className).toContain('fixed');
    expect(el.className).toContain('inset-0');
  });
});
