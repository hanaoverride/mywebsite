import { describe, it, expect } from 'vitest';

describe('i18n routing config', () => {
  it('should have ko and en locales', async () => {
    const { routing } = await import('@/i18n/routing');
    expect(routing.locales).toContain('ko');
    expect(routing.locales).toContain('en');
    expect(routing.defaultLocale).toBe('ko');
  });
});
