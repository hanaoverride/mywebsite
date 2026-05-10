'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDesktopStore } from '@/store/desktop';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type Card = { suit: Suit; rank: Rank };
type Phase = 'betting' | 'playing' | 'dealerTurn' | 'result';
type GameResult = 'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null;

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cardValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank);
}

function handValue(hand: Card[]): { value: number; isSoft: boolean } {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 'A') {
      aces++;
      value += 11;
    } else {
      value += cardValue(card.rank);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return { value, isSoft: aces > 0 };
}

export default function Blackjack() {
  const locale = useDesktopStore((s) => s.locale);
  const isKo = locale === 'ko';

  const [deck, setDeck] = useState<Card[]>(() => createDeck());
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(5);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>('betting');
  const [result, setResult] = useState<GameResult>(null);

  const dealerDrawRef = useRef(false);

  const resolveDealerTurn = useCallback(
    (finalDealerHand: Card[]) => {
      dealerDrawRef.current = false;
      setDealerHand(finalDealerHand);
      setPhase('result');

      const pVal = handValue(playerHand);
      const dVal = handValue(finalDealerHand);

      if (dVal.value > 21) {
        setResult('win');
        setBalance((b) => b + bet);
      } else if (pVal.value > dVal.value) {
        setResult('win');
        setBalance((b) => b + bet);
      } else if (pVal.value < dVal.value) {
        setResult('lose');
        setBalance((b) => b - bet);
      } else {
        setResult('push');
      }
    },
    [playerHand, bet]
  );

  // Dealer auto-draw during dealerTurn phase
  useEffect(() => {
    if (phase !== 'dealerTurn' || dealerDrawRef.current) return;
    dealerDrawRef.current = true;

    const drawNext = (
      currentDeck: Card[],
      currentDealerHand: Card[]
    ) => {
      const newDeck = [...currentDeck];
      const card = newDeck.pop();

      if (!card) {
        // Deck exhausted — resolve immediately
        setDeck(currentDeck);
        resolveDealerTurn(currentDealerHand);
        return;
      }

      const updatedHand = [...currentDealerHand, card];
      const dVal = handValue(updatedHand);

      setDeck(newDeck);
      setDealerHand(updatedHand);

      if (dVal.value >= 17) {
        // Dealer stands on 17+
        resolveDealerTurn(updatedHand);
      } else {
        // Dealer hits — schedule next draw
        setTimeout(() => drawNext(newDeck, updatedHand), 600);
      }
    };

    drawNext(deck, dealerHand);
  }, [phase, deck, dealerHand, resolveDealerTurn]);

  const adjustBet = useCallback(
    (amount: number) => {
      if (phase !== 'betting') return;
      setBet((b) => Math.max(1, Math.min(10, balance, b + amount)));
    },
    [phase, balance]
  );

  const deal = useCallback(() => {
    if (bet > balance || bet < 1) return;
    const newDeck = [...deck];
    const player: Card[] = [newDeck.pop()!, newDeck.pop()!];
    const dealer: Card[] = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setPhase('playing');
    dealerDrawRef.current = false;

    // Check natural blackjack
    const pVal = handValue(player);
    if (pVal.value === 21) {
      const dVal = handValue(dealer);
      if (dVal.value === 21) {
        setResult('push');
      } else {
        setResult('blackjack');
        setBalance((b) => b + Math.floor(bet * 1.5));
      }
      setPhase('result');
    }
  }, [bet, balance, deck]);

  const hit = useCallback(() => {
    if (phase !== 'playing') return;
    const newDeck = [...deck];
    const card = newDeck.pop();
    if (!card) return;
    const newHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newHand);
    const val = handValue(newHand);
    if (val.value > 21) {
      setResult('bust');
      setPhase('result');
      setBalance((b) => b - bet);
    }
  }, [phase, deck, playerHand, bet]);

  const stand = useCallback(() => {
    if (phase !== 'playing') return;
    setPhase('dealerTurn');
  }, [phase]);

  const reset = useCallback(() => {
    setBalance(100);
    setBet(5);
    setPlayerHand([]);
    setDealerHand([]);
    setPhase('betting');
    setResult(null);
    setDeck(createDeck());
    dealerDrawRef.current = false;
  }, []);

  const handleNewRound = useCallback(() => {
    setPlayerHand([]);
    setDealerHand([]);
    setPhase('betting');
    setResult(null);
    setDeck(createDeck());
    dealerDrawRef.current = false;
  }, []);

  const playerValue = playerHand.length > 0 ? handValue(playerHand) : null;
  const showDealerValue =
    dealerHand.length > 0 && (phase === 'result' || phase === 'dealerTurn');
  const dealerVisibleValue = showDealerValue ? handValue(dealerHand) : null;

  const renderCard = (card: Card, hidden?: boolean) => (
    <div
      className={`w-14 h-20 ${
        !hidden && (card.suit === '♥' || card.suit === '♦')
          ? 'text-red-500'
          : 'text-white'
      } bg-gray-800 border border-gray-600 rounded-lg flex flex-col items-center justify-center text-sm font-mono shadow-md`}
    >
      {hidden ? (
        <span className="text-blue-400 text-2xl font-bold">?</span>
      ) : (
        <>
          <span className="text-xs">{card.rank}</span>
          <span className="text-2xl">{card.suit}</span>
        </>
      )}
    </div>
  );

  const t = (key: string): string => {
    const map: Record<string, string> = {
      balance: isKo ? '잔액' : 'Balance',
      bet: isKo ? '베팅' : 'Bet',
      dealer: isKo ? '딜러' : 'Dealer',
      player: isKo ? '플레이어' : 'Player',
      deal: isKo ? '딜' : 'Deal',
      hit: isKo ? '히트' : 'Hit',
      stand: isKo ? '스탠드' : 'Stand',
      reset: isKo ? '리셋' : 'Reset',
      newRound: isKo ? '새 라운드' : 'New Round',
      win: isKo ? '승리!' : 'You Win!',
      lose: isKo ? '패배!' : 'You Lose!',
      push: isKo ? '무승부' : 'Push',
      blackjack: isKo ? '블랙잭!' : 'Blackjack!',
      bust: isKo ? '버스트!' : 'Bust!',
      gameOver: isKo ? '게임 오버' : 'Game Over',
    };
    return map[key] ?? key;
  };

  if (balance <= 0 && phase !== 'betting') {
    return (
      <div
        className="h-full bg-gray-900 flex flex-col items-center justify-center gap-6"
        data-testid="blackjack-game"
      >
        <p className="text-red-400 text-2xl font-bold">{t('gameOver')}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
          data-testid="blackjack-reset"
        >
          {t('reset')}
        </button>
      </div>
    );
  }

  return (
    <div
      className="h-full bg-gray-900 p-6 flex flex-col gap-5 text-white text-sm select-none"
      data-testid="blackjack-game"
    >
      <div className="flex justify-between items-center bg-gray-800/50 rounded-lg px-4 py-2">
        <span className="font-mono">
          {t('balance')}: <span data-testid="blackjack-balance">{balance}₩</span>
        </span>
        {phase === 'betting' && (
          <div className="flex items-center gap-1" data-testid="blackjack-bet-controls">
            <button
              onClick={() => adjustBet(-1)}
              className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded text-lg leading-none transition-colors"
            >
              -
            </button>
            <span className="font-mono min-w-[60px] text-center" data-testid="blackjack-bet">
              {t('bet')}: {bet}₩
            </span>
            <button
              onClick={() => adjustBet(1)}
              className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded text-lg leading-none transition-colors"
            >
              +
            </button>
            <button
              onClick={() => setBet(1)}
              className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs ml-1 transition-colors"
            >
              Min
            </button>
            <button
              onClick={() => setBet(Math.min(10, balance))}
              className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
            >
              Max
            </button>
          </div>
        )}
        {phase !== 'betting' && (
          <span className="font-mono text-gray-400">
            {t('bet')}: {bet}₩
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-gray-400 text-xs uppercase tracking-wider">
          {t('dealer')}
          {dealerVisibleValue ? (
            <span className="ml-2 font-mono text-white">({dealerVisibleValue.value})</span>
          ) : phase === 'playing' && dealerHand.length > 0 ? (
            <span className="ml-2 font-mono text-white">
              ({cardValue(dealerHand[0].rank)})
            </span>
          ) : null}
        </p>
        <div className="flex gap-3">
          {dealerHand.map((card, i) => (
            <div key={i}>{renderCard(card, i === 1 && phase === 'playing')}</div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-green-400 text-xs uppercase tracking-wider">
          {t('player')}
          {playerValue ? (
            <span className="ml-2 font-mono text-white">({playerValue.value})</span>
          ) : null}
        </p>
        <div className="flex gap-3">
          {playerHand.map((card, i) => (
            <div key={i}>{renderCard(card)}</div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 items-center justify-center h-12">
        {phase === 'betting' && (
          <button
            onClick={deal}
            disabled={bet > balance || bet < 1}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            data-testid="blackjack-deal"
          >
            {t('deal')}
          </button>
        )}
        {phase === 'playing' && (
          <>
            <button
              onClick={hit}
              className="px-8 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
              data-testid="blackjack-hit"
            >
              {t('hit')}
            </button>
            <button
              onClick={stand}
              className="px-8 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-semibold transition-colors"
              data-testid="blackjack-stand"
            >
              {t('stand')}
            </button>
          </>
        )}
        {phase === 'dealerTurn' && (
          <p className="text-yellow-400 animate-pulse text-sm">
            {isKo ? '딜러 턴...' : 'Dealer turn...'}
          </p>
        )}
        {phase === 'result' && (
          <>
            <p className="text-center font-bold text-lg" data-testid="blackjack-result">
              {result === 'win' && <span className="text-green-400">{t('win')}</span>}
              {result === 'lose' && <span className="text-red-400">{t('lose')}</span>}
              {result === 'push' && <span className="text-yellow-400">{t('push')}</span>}
              {result === 'blackjack' && <span className="text-purple-400">{t('blackjack')}</span>}
              {result === 'bust' && <span className="text-red-500">{t('bust')}</span>}
            </p>
            <button
              onClick={handleNewRound}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
              data-testid="blackjack-new-round"
            >
              {t('newRound')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
