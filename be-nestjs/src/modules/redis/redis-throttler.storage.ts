import {
  ThrottlerStorageService,
  type ThrottlerStorage,
} from '@nestjs/throttler';
import type { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface.js';
import { RedisCacheService } from './redis-cache.service.js';

const INCREMENT_SCRIPT = `
local hits = redis.call('INCR', KEYS[1])
if hits == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local hitTtl = redis.call('PTTL', KEYS[1])
local blockTtl = redis.call('PTTL', KEYS[2])
if blockTtl > 0 then
  return {hits, math.ceil(hitTtl / 1000), 1, math.ceil(blockTtl / 1000)}
end
if hits > tonumber(ARGV[2]) then
  if tonumber(ARGV[3]) > 0 then
    redis.call('SET', KEYS[2], '1', 'PX', ARGV[3])
    blockTtl = tonumber(ARGV[3])
  else
    blockTtl = hitTtl
  end
  return {hits, math.ceil(hitTtl / 1000), 1, math.ceil(blockTtl / 1000)}
end
return {hits, math.ceil(hitTtl / 1000), 0, 0}
`;

export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly fallback = new ThrottlerStorageService();

  constructor(private readonly redis: RedisCacheService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const baseKey = `itjob:throttle:${throttlerName}:${key}`;
    const result = await this.redis.eval(
      INCREMENT_SCRIPT,
      [`${baseKey}:hits`, `${baseKey}:block`],
      [ttl, limit, blockDuration],
    );

    if (!Array.isArray(result)) {
      return this.fallback.increment(
        key,
        ttl,
        limit,
        blockDuration,
        throttlerName,
      );
    }

    return {
      totalHits: Number(result[0]),
      timeToExpire: Number(result[1]),
      isBlocked: Number(result[2]) === 1,
      timeToBlockExpire: Number(result[3]),
    };
  }
}
