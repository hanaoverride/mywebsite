import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import WebBrowser from '@/components/apps/WebBrowser';
import { useDesktopStore } from '@/store/desktop';

describe('WebBrowser', () => {
  beforeEach(() => {
    useDesktopStore.setState({ locale: 'ko' });
  });

  it('renders browser chrome', () => {
    render(<WebBrowser />);
    expect(screen.getByTestId('web-browser')).toBeInTheDocument();
    expect(screen.getByTestId('browser-content')).toBeInTheDocument();
  });

  it('shows Korean tab text', () => {
    render(<WebBrowser />);
    expect(screen.getByText('새 사생활 보호 탭')).toBeInTheDocument();
  });

  it('shows English tab text when locale is en', () => {
    useDesktopStore.setState({ locale: 'en' });
    render(<WebBrowser />);
    expect(screen.getByText('New Private Tab')).toBeInTheDocument();
  });
});
