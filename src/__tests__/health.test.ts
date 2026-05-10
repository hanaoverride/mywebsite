import { describe, it, expect } from 'vitest';

describe('Health endpoint', () => {
  it('should export dynamic = force-dynamic', async () => {
    const mod = await import('@/app/api/health/route');
    expect(mod.dynamic).toBe('force-dynamic');
  });

  it('GET returns healthy response', async () => {
    const { GET } = await import('@/app/api/health/route');
    const response = await GET();
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBe('0.1.0');
    expect(response.status).toBe(200);
  });
});
