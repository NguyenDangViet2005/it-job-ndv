import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisCacheService } from './redis-cache.service.js';

const redis = vi.hoisted(() => ({
  status: 'ready',
  get: vi.fn(),
  getdel: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  scan: vi.fn(),
  eval: vi.fn(),
  on: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
}));
vi.mock('ioredis', () => ({
  Redis: vi.fn(function () {
    return redis;
  }),
}));

describe('RedisCacheService', () => {
  let cache: RedisCacheService;
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('REDIS_URL', 'redis://localhost:6379');
    redis.status = 'ready';
    redis.connect.mockResolvedValue(undefined);
    redis.get.mockResolvedValue(null);
    redis.set.mockResolvedValue('OK');
    redis.del.mockResolvedValue(1);
    redis.scan.mockResolvedValue(['0', []]);
    cache = new RedisCacheService();
    cache.onModuleInit();
  });
  afterEach(() => {
    cache.onModuleDestroy();
    vi.unstubAllEnvs();
  });

  it('serves a hit without querying the DB', async () => {
    redis.get.mockResolvedValue('[{"id":1}]');
    const load = vi.fn();
    await expect(cache.remember('key', 30, load)).resolves.toEqual([{ id: 1 }]);
    expect(load).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('caches an empty DB result with an expiry on a miss', async () => {
    await expect(cache.remember('key', 30, async () => [])).resolves.toEqual(
      [],
    );
    expect(redis.set).toHaveBeenCalledWith('key', '[]', 'EX', 30);
  });

  it('bypasses a disconnected client', async () => {
    redis.status = 'reconnecting';
    await expect(cache.remember('key', 30, async () => [1])).resolves.toEqual([
      1,
    ]);
    expect(redis.get).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it.each(['invalid JSON', 'read failure'])(
    'falls back on %s',
    async (scenario) => {
      if (scenario === 'read failure') redis.get.mockRejectedValue(new Error());
      else redis.get.mockResolvedValue('{invalid');
      await expect(cache.remember('key', 30, async () => [1])).resolves.toEqual(
        [1],
      );
    },
  );

  it('returns DB data even if writing Redis fails', async () => {
    redis.set.mockRejectedValue(new Error());
    await expect(cache.remember('key', 30, async () => [1])).resolves.toEqual([
      1,
    ]);
  });

  it('propagates DB failures without caching them', async () => {
    const error = new Error('DB unavailable');
    await expect(
      cache.remember('key', 30, async () => {
        throw error;
      }),
    ).rejects.toBe(error);
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('works without REDIS_URL', async () => {
    vi.stubEnv('REDIS_URL', '');
    const disabled = new RedisCacheService();
    disabled.onModuleInit();
    await expect(
      disabled.remember('key', 30, async () => [1]),
    ).resolves.toEqual([1]);
    expect(redis.get).not.toHaveBeenCalled();
  });

  it('atomically consumes a one-time value', async () => {
    redis.getdel.mockResolvedValue('42');
    await expect(cache.getDel('oauth-code')).resolves.toBe('42');
    expect(redis.getdel).toHaveBeenCalledWith('oauth-code');
  });

  it('scans and deletes every page matching a pattern', async () => {
    redis.scan
      .mockResolvedValueOnce(['7', ['a', 'b']])
      .mockResolvedValueOnce(['0', ['c']]);
    await cache.deleteByPattern('itjob:jobs:*');
    expect(redis.del.mock.calls).toEqual([['a', 'b'], ['c']]);
  });
});
