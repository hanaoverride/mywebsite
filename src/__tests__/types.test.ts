import { describe, it, expect } from 'vitest';
import type { AppId, WindowState, BlackjackState, Locale } from '@/types';

describe('TypeScript types', () => {
  it('AppId should accept valid app IDs', () => {
    const validIds: AppId[] = ['terminal', 'browser', 'mail', 'video', 'textviewer', 'blackjack'];
    expect(validIds.length).toBe(6);
  });

  it('WindowState should have all required fields', () => {
    const window: WindowState = {
      id: 'terminal',
      title: 'Terminal',
      x: 100,
      y: 100,
      width: 800,
      height: 600,
      minimized: false,
      maximized: false,
      zIndex: 1,
      isNew: false,
    };
    expect(window.id).toBe('terminal');
    expect(window.zIndex).toBe(1);
  });

  it('BlackjackState should have valid phases', () => {
    const state: BlackjackState = {
      deck: [],
      playerHand: [],
      dealerHand: [],
      bet: 5,
      balance: 100,
      gamePhase: 'betting',
      result: null,
      gameOver: false,
    };
    const validPhases = ['betting', 'playing', 'dealerTurn', 'result'];
    expect(validPhases).toContain(state.gamePhase);
  });

  it('Locale should only accept ko or en', () => {
    const locales: Locale[] = ['ko', 'en'];
    expect(locales.length).toBe(2);
  });
});
