import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useDesktopStore } from '@/store/desktop';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/ko',
}));

describe('LanguageToggle', () => {
  beforeEach(() => {
    useDesktopStore.setState({ locale: 'ko' });
    replaceMock.mockClear();
  });

  it('displays current locale', () => {
    render(<LanguageToggle />);
    expect(screen.getByText('KO')).toBeInTheDocument();
  });

  it('switches locale on click', () => {
    render(<LanguageToggle />);
    fireEvent.click(screen.getByTestId('language-toggle'));
    expect(useDesktopStore.getState().locale).toBe('en');
    expect(replaceMock).toHaveBeenCalledWith('/en');
  });

  it('switches back to ko from en', () => {
    useDesktopStore.setState({ locale: 'en' });
    render(<LanguageToggle />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('language-toggle'));
    expect(useDesktopStore.getState().locale).toBe('ko');
    expect(replaceMock).toHaveBeenCalledWith('/ko');
  });
});
