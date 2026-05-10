import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PortfolioContent from '@/lib/portfolio-content';
import { useDesktopStore } from '@/store/desktop';

describe('PortfolioContent', () => {
  beforeEach(() => {
    useDesktopStore.setState({ locale: 'ko' });
  });

  it('renders hero section', () => {
    render(<PortfolioContent />);
    expect(screen.getByTestId('portfolio-content')).toBeInTheDocument();
    expect(screen.getByText('하나 오버라이드')).toBeInTheDocument();
  });

  it('renders tech stack badges', () => {
    render(<PortfolioContent />);
    const techStack = screen.getByRole('region', { name: 'tech stack' });
    expect(techStack).toBeInTheDocument();
    expect(screen.getAllByText('Zustand').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Playwright').length).toBeGreaterThanOrEqual(1);
  });

  it('renders project cards', () => {
    render(<PortfolioContent />);
    expect(screen.getByText('Linux Desktop Portfolio')).toBeInTheDocument();
  });

  it('renders in English', () => {
    useDesktopStore.setState({ locale: 'en' });
    render(<PortfolioContent />);
    expect(screen.getByText('Hana Override')).toBeInTheDocument();
  });
});
