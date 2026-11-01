import { describe, expect, it, vi } from 'vitest';
import { RedisThrottlerStorage } from './redis-throttler.storage.js';
import type { RedisCacheService } from './redis-cache.service.js';

describe('RedisThrottlerStorage', () => {
  it('maps the atomic Redis result to the Nest throttler record', async () => {
    const redis = { eval: vi.fn().mockResolvedValue([3, 45, 1, 10]) };
    const storage = new RedisThrottlerStorage(
      redis as unknown as RedisCacheService,
    );
    await expect(
      storage.increment('client', 60000, 2, 10000, 'default'),
    ).resolves.toEqual({
      totalHits: 3,
      timeToExpire: 45,
      isBlocked: true,
      timeToBlockExpire: 10,
    });
    expect(redis.eval).toHaveBeenCalledWith(
      expect.any(String),
      [
        'itjob:throttle:default:client:hits',
        'itjob:throttle:default:client:block',
      ],
      [60000, 2, 10000],
    );
  });

  it('falls back to in-memory throttling when Redis is unavailable', async () => {
    const redis = { eval: vi.fn().mockResolvedValue(undefined) };
    const storage = new RedisThrottlerStorage(
      redis as unknown as RedisCacheService,
    );
    const result = await storage.increment('client', 60000, 2, 0, 'default');
    expect(result).toMatchObject({ totalHits: 1, isBlocked: false });
  });
});
