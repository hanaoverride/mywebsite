import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blackjack from '@/components/apps/Blackjack';

vi.mock('@/store/desktop', () => ({
  useDesktopStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) => {
    const store = { locale: 'en' };
    return selector(store);
  }),
}));

describe('Blackjack', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('renders the game container', () => {
      render(<Blackjack />);
      expect(screen.getByTestId('blackjack-game')).toBeInTheDocument();
    });

    it('displays starting balance of 100₩', () => {
      render(<Blackjack />);
      expect(screen.getByTestId('blackjack-balance')).toHaveTextContent('100₩');
    });

    it('displays bet controls in betting phase', () => {
      render(<Blackjack />);
      expect(screen.getByTestId('blackjack-bet-controls')).toBeInTheDocument();
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 5₩');
    });

    it('shows deal button initially', () => {
      render(<Blackjack />);
      expect(screen.getByTestId('blackjack-deal')).toBeInTheDocument();
    });

    it('does not show hit/stand buttons initially', () => {
      render(<Blackjack />);
      expect(screen.queryByTestId('blackjack-hit')).not.toBeInTheDocument();
      expect(screen.queryByTestId('blackjack-stand')).not.toBeInTheDocument();
    });
  });

  describe('bet adjustment', () => {
    it('increases bet when + button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Blackjack />);
      await user.click(screen.getByText('+'));
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 6₩');
    });

    it('decreases bet when - button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Blackjack />);
      await user.click(screen.getByText('-'));
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 4₩');
    });

    it('prevents bet from going below 1₩', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Blackjack />);
      for (let i = 0; i < 10; i++) {
        await user.click(screen.getByText('-'));
      }
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 1₩');
    });

    it('caps bet at min(10, balance)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Blackjack />);
      for (let i = 0; i < 100; i++) {
        await user.click(screen.getByText('+'));
      }
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 10₩');
    });

    it('sets bet to 1 when Min button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Blackjack />);
      await user.click(screen.getByText('Min'));
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 1₩');
    });

    it('sets bet to max when Max button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Blackjack />);
      await user.click(screen.getByText('Max'));
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 10₩');
    });
  });

  describe('deal and play', () => {
    it('shows hit and stand buttons after dealing', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await user.click(screen.getByTestId('blackjack-deal'));

      expect(screen.getByTestId('blackjack-hit')).toBeInTheDocument();
      expect(screen.getByTestId('blackjack-stand')).toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });

    it('hides deal button after dealing', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await user.click(screen.getByTestId('blackjack-deal'));

      expect(screen.queryByTestId('blackjack-deal')).not.toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });

    it('displays player and dealer labels after dealing', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await user.click(screen.getByTestId('blackjack-deal'));

      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Dealer')).toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });

    it('busts on hit with ordered deck (K♣+Q♣=20, hit→9♣=29)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await user.click(screen.getByTestId('blackjack-deal'));
      await user.click(screen.getByTestId('blackjack-hit'));

      expect(screen.getByTestId('blackjack-result')).toHaveTextContent('Bust!');

      vi.spyOn(Math, 'random').mockRestore();
    });
  });

  describe('game over', () => {
    async function drainBalanceToZero(user: ReturnType<typeof userEvent.setup>) {
      await user.click(screen.getByText('Max'));

      for (let round = 0; round < 9; round++) {
        await user.click(screen.getByTestId('blackjack-deal'));
        await user.click(screen.getByTestId('blackjack-hit'));
        await user.click(screen.getByTestId('blackjack-new-round'));
      }

      await user.click(screen.getByTestId('blackjack-deal'));
      await user.click(screen.getByTestId('blackjack-hit'));
    }

    it('shows game over when balance reaches 0', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await drainBalanceToZero(user);

      expect(screen.getByText('Game Over')).toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });

    it('shows reset button on game over screen', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await drainBalanceToZero(user);

      expect(screen.getByTestId('blackjack-reset')).toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });

    it('reset restores balance to 100 and bet to 5', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await drainBalanceToZero(user);
      await user.click(screen.getByTestId('blackjack-reset'));

      expect(screen.getByTestId('blackjack-balance')).toHaveTextContent('100₩');
      expect(screen.getByTestId('blackjack-bet')).toHaveTextContent('Bet: 5₩');

      vi.spyOn(Math, 'random').mockRestore();
    });
  });

  describe('stand and dealer turn', () => {
    it('shows result immediately after stand (dealer draws and busts)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      render(<Blackjack />);
      await user.click(screen.getByTestId('blackjack-deal'));
      await user.click(screen.getByTestId('blackjack-stand'));

      expect(screen.getByTestId('blackjack-result')).toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });
  });

  describe('blackjack detection', () => {
    it('detects natural blackjack and pays 1.5x (A♠+K♣ with random=0)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.spyOn(Math, 'random').mockReturnValue(0);

      render(<Blackjack />);
      await user.click(screen.getByTestId('blackjack-deal'));

      expect(screen.getByTestId('blackjack-result')).toHaveTextContent('Blackjack!');
      expect(screen.getByTestId('blackjack-balance')).toHaveTextContent('107₩');

      vi.spyOn(Math, 'random').mockRestore();
    });
  });
});
