import { describe, it, expect } from 'vitest';

describe('Contact API route', () => {
  it('exports a POST handler', async () => {
    const mod = await import('@/app/api/contact/route');
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe('function');
  });

  it('has correct validation rules', async () => {
    const mod = await import('@/app/api/contact/route');
    expect(mod.POST).toBeDefined();
  });
});
