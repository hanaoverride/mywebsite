'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDesktopStore } from '@/store/desktop';
import './blackjack.css';

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
  const [bet, setBet] = useState(0);
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
        setBalance((b) => b + bet * 2);
      } else if (pVal.value > dVal.value) {
        setResult('win');
        setBalance((b) => b + bet * 2);
      } else if (pVal.value < dVal.value) {
        setResult('lose');
        // Balance already deducted at bet
      } else {
        setResult('push');
        setBalance((b) => b + bet);
      }
    },
    [playerHand, bet]
  );

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
        setDeck(currentDeck);
        resolveDealerTurn(currentDealerHand);
        return;
      }

      const updatedHand = [...currentDealerHand, card];
      const dVal = handValue(updatedHand);

      setDeck(newDeck);
      setDealerHand(updatedHand);

      if (dVal.value >= 17) {
        resolveDealerTurn(updatedHand);
      } else {
        setTimeout(() => drawNext(newDeck, updatedHand), 800);
      }
    };

    setTimeout(() => drawNext(deck, dealerHand), 400);
  }, [phase, deck, dealerHand, resolveDealerTurn]);

  const addBet = useCallback(
    (amount: number) => {
      if (phase !== 'betting') return;
      if (balance >= amount) {
        setBet((b) => b + amount);
        setBalance((b) => b - amount);
      }
    },
    [phase, balance]
  );

  const clearBet = useCallback(() => {
    if (phase !== 'betting') return;
    setBalance((b) => b + bet);
    setBet(0);
  }, [phase, bet]);

  const deal = useCallback(() => {
    if (bet <= 0) return;
    const newDeck = createDeck(); // Shuffle every round for simplicity
    const player: Card[] = [newDeck.pop()!, newDeck.pop()!];
    const dealer: Card[] = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setPhase('playing');
    dealerDrawRef.current = false;

    const pVal = handValue(player);
    if (pVal.value === 21) {
      const dVal = handValue(dealer);
      if (dVal.value === 21) {
        setResult('push');
        setBalance((b) => b + bet);
      } else {
        setResult('blackjack');
        setBalance((b) => b + Math.floor(bet * 2.5));
      }
      setPhase('result');
    }
  }, [bet]);

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
    }
  }, [phase, deck, playerHand]);

  const stand = useCallback(() => {
    if (phase !== 'playing') return;
    setPhase('dealerTurn');
  }, [phase]);

  const reset = useCallback(() => {
    setBalance(100);
    setBet(0);
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
    setBet(0);
    setDeck(createDeck());
    dealerDrawRef.current = false;
  }, []);

  const playerValue = playerHand.length > 0 ? handValue(playerHand) : null;
  const showDealerValue =
    dealerHand.length > 0 && (phase === 'result' || phase === 'dealerTurn');
  const dealerVisibleValue = showDealerValue ? handValue(dealerHand) : null;

  const renderCard = (card: Card, i: number, hidden?: boolean) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div
        key={i}
        className={`card ${hidden ? 'hidden' : ''} ${isRed ? 'red' : ''}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        {!hidden && (
          <>
            <div className="card-top">
              <span className="text-xs font-bold">{card.rank}</span>
              <span className="text-sm">{card.suit}</span>
            </div>
            <div className="card-center">{card.suit}</div>
            <div className="card-bottom">
              <span className="text-xs font-bold">{card.rank}</span>
              <span className="text-sm">{card.suit}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const t = (key: string): string => {
    const map: Record<string, string> = {
      balance: isKo ? '보유 자산' : 'Balance',
      bet: isKo ? '현재 베팅' : 'Current Bet',
      dealer: isKo ? '딜러' : 'Dealer',
      player: isKo ? '플레이어' : 'Player',
      deal: isKo ? '게임 시작' : 'Start Game',
      hit: isKo ? '히트' : 'Hit',
      stand: isKo ? '스탠드' : 'Stand',
      reset: isKo ? '초기화' : 'Reset',
      newRound: isKo ? '다음 게임' : 'Next Game',
      win: isKo ? '당신이 이겼습니다!' : 'YOU WIN!',
      lose: isKo ? '딜러가 이겼습니다.' : 'DEALER WINS',
      push: isKo ? '비겼습니다' : 'PUSH',
      blackjack: isKo ? '블랙잭!' : 'BLACKJACK!',
      bust: isKo ? '버스트!' : 'BUST!',
      gameOver: isKo ? '파산했습니다!' : 'GAME OVER',
    };
    return map[key] ?? key;
  };

  if (balance <= 0 && bet === 0 && phase === 'betting') {
    return (
      <div className="blackjack-container items-center justify-center gap-6">
        <div className="blackjack-table-border" />
        <div className="flex flex-col items-center gap-4 z-10">
          <span className="result-text bust-text text-5xl mb-4">{t('gameOver')}</span>
        </div>
        <button 
          onClick={reset} 
          className="blackjack-button bg-white/10 text-white hover:bg-white/20 py-2 px-8 text-sm border-white/20 backdrop-blur-sm z-10"
        >
          {t('reset')}
        </button>
      </div>
    );
  }

  return (
    <div className="blackjack-container" data-testid="blackjack-game">
      <div className="blackjack-table-border" />
      
      <div className="blackjack-table-inner">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 bg-black/30 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/50 uppercase tracking-tighter">{t('balance')}</span>
            <span className="text-lg font-bold text-yellow-400" data-testid="blackjack-balance">
              ₩{balance.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/50 uppercase tracking-tighter">{t('bet')}</span>
            <span className="text-lg font-bold text-green-400" data-testid="blackjack-bet">
              ₩{bet.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dealer Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-black/40 rounded-full text-[10px] font-bold border border-white/10">
              {t('dealer')} {dealerVisibleValue ? `(${dealerVisibleValue.value})` : ''}
            </span>
          </div>
          <div className="flex gap-2 h-24 items-center">
            {dealerHand.map((card, i) => renderCard(card, i, i === 1 && phase === 'playing'))}
          </div>
        </div>

        {/* Result Overlay */}
        {phase === 'result' && (
          <div className="result-overlay">
            <div className="mb-4">
              {result === 'win' && <span className="result-text win-text">{t('win')}</span>}
              {result === 'lose' && <span className="result-text lose-text">{t('lose')}</span>}
              {result === 'push' && <span className="result-text push-text">{t('push')}</span>}
              {result === 'blackjack' && <span className="result-text blackjack-text">{t('blackjack')}</span>}
              {result === 'bust' && <span className="result-text bust-text">{t('bust')}</span>}
            </div>
            <button 
              onClick={handleNewRound} 
              className="blackjack-button bg-black/40 text-white hover:bg-white/10 py-2 px-8 text-sm border-white/30 backdrop-blur-md"
            >
              {t('newRound')}
            </button>
          </div>
        )}

        {/* Player Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex gap-2 h-24 items-center">
            {playerHand.map((card, i) => renderCard(card, i))}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-900/60 rounded-full text-[10px] font-bold border border-green-400/30">
              {t('player')} {playerValue ? `(${playerValue.value})` : ''}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-col gap-2 items-center">
          {phase === 'betting' && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <button onClick={() => addBet(1)} className="chip chip-1 w-8 h-8 text-[10px]">1</button>
                <button onClick={() => addBet(5)} className="chip chip-5 w-8 h-8 text-[10px]">5</button>
                <button onClick={() => addBet(10)} className="chip chip-10 w-8 h-8 text-[10px]">10</button>
                <button onClick={() => addBet(50)} className="chip chip-50 w-8 h-8 text-[10px]">50</button>
              </div>
              <div className="flex gap-2">
                <button onClick={clearBet} className="blackjack-button text-[10px] py-1 px-2">Clear</button>
                <button 
                  onClick={deal} 
                  disabled={bet <= 0}
                  className="blackjack-button bg-yellow-500 text-black border-none hover:bg-yellow-400 py-1 px-4 text-sm"
                >
                  {t('deal')}
                </button>
              </div>
            </div>
          )}

          {phase === 'playing' && (
            <div className="flex gap-4">
              <button onClick={hit} className="blackjack-button bg-green-600 hover:bg-green-500 border-none py-1 px-6 text-sm">
                {t('hit')}
              </button>
              <button onClick={stand} className="blackjack-button bg-red-600 hover:bg-red-500 border-none py-1 px-6 text-sm">
                {t('stand')}
              </button>
            </div>
          )}

          {phase === 'dealerTurn' && (
            <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full animate-pulse border border-white/10">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isKo ? '딜러 차례...' : 'Dealer is drawing...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
