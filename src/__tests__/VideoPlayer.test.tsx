import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoPlayer from '@/components/apps/VideoPlayer';
import { useDesktopStore } from '@/store/desktop';

describe('VideoPlayer', () => {
  beforeEach(() => {
    useDesktopStore.setState({ locale: 'ko' });
  });

  it('renders video player UI', () => {
    render(<VideoPlayer />);
    expect(screen.getByTestId('video-player')).toBeInTheDocument();
    expect(screen.getByText('비디오 플레이어')).toBeInTheDocument();
  });

  it('calls window.open on button click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<VideoPlayer />);
    fireEvent.click(screen.getByTestId('video-open-btn'));
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('shows English text when locale is en', () => {
    useDesktopStore.setState({ locale: 'en' });
    render(<VideoPlayer />);
    expect(screen.getByText('Video Player')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
