import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MailingApp from '@/components/apps/MailingApp';
import { useDesktopStore } from '@/store/desktop';

describe('MailingApp', () => {
  beforeEach(() => {
    useDesktopStore.setState({ locale: 'ko' });
    vi.restoreAllMocks();
  });

  it('renders the mailing form UI', () => {
    render(<MailingApp />);
    expect(screen.getByTestId('mailing-app')).toBeInTheDocument();
    expect(screen.getByText('메일')).toBeInTheDocument();
    expect(screen.getByTestId('mail-name')).toBeInTheDocument();
    expect(screen.getByTestId('mail-email')).toBeInTheDocument();
    expect(screen.getByTestId('mail-subject')).toBeInTheDocument();
    expect(screen.getByTestId('mail-message')).toBeInTheDocument();
    expect(screen.getByTestId('mail-submit')).toBeInTheDocument();
  });

  it('renders English text when locale is en', () => {
    useDesktopStore.setState({ locale: 'en' });
    render(<MailingApp />);
    expect(screen.getByText('Mail')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    render(<MailingApp />);
    fireEvent.click(screen.getByTestId('mail-submit'));
    await waitFor(() => {
      expect(screen.getByTestId('mail-name-error')).toBeInTheDocument();
      expect(screen.getByTestId('mail-email-error')).toBeInTheDocument();
      expect(screen.getByTestId('mail-subject-error')).toBeInTheDocument();
      expect(screen.getByTestId('mail-message-error')).toBeInTheDocument();
    });
  });

  it('shows email format validation error', async () => {
    render(<MailingApp />);
    fireEvent.change(screen.getByTestId('mail-name'), { target: { value: 'Hana' } });
    fireEvent.change(screen.getByTestId('mail-email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByTestId('mail-subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByTestId('mail-message'), { target: { value: 'Test message' } });
    const form = screen.getByTestId('mailing-app').querySelector('form')!;
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByTestId('mail-email-error')).toBeInTheDocument();
    });
  });

  it('clears field error on change', async () => {
    render(<MailingApp />);
    fireEvent.click(screen.getByTestId('mail-submit'));
    await waitFor(() => {
      expect(screen.getByTestId('mail-name-error')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('mail-name'), { target: { value: 'Hana' } });
    await waitFor(() => {
      expect(screen.queryByTestId('mail-name-error')).not.toBeInTheDocument();
    });
  });

  it('shows message too long error beyond 1000 chars', async () => {
    render(<MailingApp />);
    fireEvent.change(screen.getByTestId('mail-name'), { target: { value: 'Hana' } });
    fireEvent.change(screen.getByTestId('mail-email'), { target: { value: 'hana@example.com' } });
    fireEvent.change(screen.getByTestId('mail-subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByTestId('mail-message'), {
      target: { value: 'a'.repeat(1001) },
    });
    fireEvent.click(screen.getByTestId('mail-submit'));
    await waitFor(() => {
      expect(screen.getByTestId('mail-message-error')).toBeInTheDocument();
      expect(screen.getByTestId('mail-message-error').textContent).toContain('1000');
    });
  });

  it('submits form and shows success state', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<MailingApp />);
    fireEvent.change(screen.getByTestId('mail-name'), { target: { value: 'Hana' } });
    fireEvent.change(screen.getByTestId('mail-email'), {
      target: { value: 'hana@example.com' },
    });
    fireEvent.change(screen.getByTestId('mail-subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByTestId('mail-message'), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByTestId('mail-submit'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.any(Object));
    });

    await waitFor(() => {
      expect(screen.getByText('메일이 전송되었습니다!')).toBeInTheDocument();
    });
  });

  it('shows error and fallback link when API returns fallback', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          error: 'EmailJS service unavailable',
          fallback: 'mailto:test@example.com?subject=Hello',
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(<MailingApp />);
    fireEvent.change(screen.getByTestId('mail-name'), { target: { value: 'Hana' } });
    fireEvent.change(screen.getByTestId('mail-email'), {
      target: { value: 'hana@example.com' },
    });
    fireEvent.change(screen.getByTestId('mail-subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByTestId('mail-message'), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByTestId('mail-submit'));

    await waitFor(() => {
      expect(screen.getByText('전송에 실패했습니다')).toBeInTheDocument();
    });

    expect(screen.getByTestId('mail-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('mail-fallback')).toHaveAttribute(
      'href',
      'mailto:test@example.com?subject=Hello',
    );
  });

  it('shows fallback link on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    render(<MailingApp />);
    fireEvent.change(screen.getByTestId('mail-name'), { target: { value: 'Hana' } });
    fireEvent.change(screen.getByTestId('mail-email'), {
      target: { value: 'hana@example.com' },
    });
    fireEvent.change(screen.getByTestId('mail-subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByTestId('mail-message'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByTestId('mail-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('mail-fallback')).toBeInTheDocument();
    });
  });
});
