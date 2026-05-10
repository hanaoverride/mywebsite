import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Terminal from '@/components/apps/Terminal';
import { useDesktopStore } from '@/store/desktop';

describe('Terminal', () => {
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
      focusedApp: null,
      zIndexCounter: 1,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const typeCommand = (input: HTMLElement, value: string) => {
    fireEvent.change(input, { target: { value } });
  };

  const pressEnter = (input: HTMLElement) => {
    fireEvent.keyDown(input, { key: 'Enter' });
  };

  it('renders with the command banner', () => {
    render(<Terminal />);
    expect(screen.getByTestId('terminal')).toBeInTheDocument();
    expect(screen.getByTestId('terminal-output')).toBeInTheDocument();
    expect(screen.getByText(/Available commands/)).toBeInTheDocument();
  });

  it('renders the powerline header', () => {
    render(<Terminal />);
    expect(
      screen.getByText(
        '(base) ┌─(~)──(hanaoverride@hostname:pts/0)─┐',
      ),
    ).toBeInTheDocument();
  });

  it('renders a blinking cursor', () => {
    render(<Terminal />);
    const cursor = screen.getByTestId('terminal-cursor');
    expect(cursor).toBeInTheDocument();
    expect(cursor.style.animation).toContain('terminal-blink');
  });

  it('executes whoami and outputs hanaoverride', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'whoami');
    pressEnter(input);

    expect(screen.getByText('hanaoverride')).toBeInTheDocument();
  });

  it('shows error for unknown commands', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'foobar');
    pressEnter(input);

    expect(screen.getByText('command not found: foobar')).toBeInTheDocument();
  });

  it('shows error in red for unknown commands', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'unknowncmd');
    pressEnter(input);

    const errorLine = screen.getByText('command not found: unknowncmd');
    expect(errorLine.className).toContain('text-red-400');
  });

  it('displays ASCII heart on love command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'love');
    pressEnter(input);

    expect(screen.getByText(/[*]{3,}/)).toBeInTheDocument();
  });

  it('opens app via store on video command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'video');
    pressEnter(input);

    const state = useDesktopStore.getState();
    expect(state.openApps.video).toBeDefined();
  });

  it('opens textviewer app on text command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'text');
    pressEnter(input);

    const state = useDesktopStore.getState();
    expect(state.openApps.textviewer).toBeDefined();
    expect(screen.getByText('Opening Text Viewer...')).toBeInTheDocument();
  });

  it('does not add history entry on empty command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, '');
    pressEnter(input);

    const bannerEntries = screen
      .getAllByText(/Available commands/)
      .filter((el) => el.className.includes('text-green-300'));
    expect(bannerEntries.length).toBe(1);
  });

  it('closes terminal on exit command', () => {
    vi.useFakeTimers();
    useDesktopStore.getState().openApp('terminal');

    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'exit');
    pressEnter(input);

    expect(
      screen.getByText('Terminal session ended.'),
    ).toBeInTheDocument();

    vi.advanceTimersByTime(500);

    const state = useDesktopStore.getState();
    expect(state.openApps.terminal).toBeUndefined();
  });

  it('navigates command history with arrow up', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'whoami');
    pressEnter(input);

    typeCommand(input, 'love');
    pressEnter(input);

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect((input as HTMLInputElement).value).toBe('love');

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect((input as HTMLInputElement).value).toBe('whoami');
  });

  it('navigates command history with arrow down', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'whoami');
    pressEnter(input);

    typeCommand(input, 'love');
    pressEnter(input);

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect((input as HTMLInputElement).value).toBe('whoami');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect((input as HTMLInputElement).value).toBe('love');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('supports backspace to delete characters', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'whoami');
    expect((input as HTMLInputElement).value).toBe('whoami');

    fireEvent.change(input, { target: { value: 'whoam' } });
    expect((input as HTMLInputElement).value).toBe('whoam');
  });

  it('shows command echo in output', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'whoami');
    pressEnter(input);

    const output = screen.getByTestId('terminal-output');
    expect(output.textContent).toContain('❯ whoami');
  });

  it('opens browser app on browser command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'browser');
    pressEnter(input);

    expect(screen.getByText('Opening Web Browser...')).toBeInTheDocument();
    expect(useDesktopStore.getState().openApps.browser).toBeDefined();
  });

  it('opens mail app on mail command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'mail');
    pressEnter(input);

    expect(screen.getByText('Opening Mail...')).toBeInTheDocument();
    expect(useDesktopStore.getState().openApps.mail).toBeDefined();
  });

  it('opens blackjack app on blackjack command', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'blackjack');
    pressEnter(input);

    expect(screen.getByText('Opening Blackjack...')).toBeInTheDocument();
    expect(useDesktopStore.getState().openApps.blackjack).toBeDefined();
  });

  it('handles case-insensitive commands', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, 'WHOAMI');
    pressEnter(input);

    expect(screen.getByText('hanaoverride')).toBeInTheDocument();
  });

  it('handles input with extra whitespace', () => {
    render(<Terminal />);
    const input = screen.getByTestId('terminal-input');

    typeCommand(input, '   whoami   ');
    pressEnter(input);

    expect(screen.getByText('hanaoverride')).toBeInTheDocument();
  });
});
