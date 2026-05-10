import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextViewer from '@/components/apps/TextViewer';

describe('TextViewer', () => {
  it('renders text content', () => {
    render(<TextViewer />);
    expect(screen.getByTestId('text-viewer')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the Linux Desktop Portfolio/)).toBeInTheDocument();
  });

  it('renders line numbers', () => {
    render(<TextViewer />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders headings in different color', () => {
    render(<TextViewer />);
    const heading = screen.getByText('# About');
    expect(heading.className).toContain('text-yellow-300');
  });
});
