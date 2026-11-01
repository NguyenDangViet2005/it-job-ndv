import {
  Injectable,
  Logger,
  type OnModuleInit,
  type OnModuleDestroy,
} from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client?: Redis;

  onModuleInit() {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logger.log('REDIS_URL is not set; cache disabled, reading from DB.');
      return;
    }

    this.client = new Redis(url, {
      lazyConnect: true,
      enableOfflineQueue: false,
      connectTimeout: 1000,
      commandTimeout: 1000,
      maxRetriesPerRequest: 0,
      retryStrategy: (attempt) => Math.min(attempt * 500, 5000),
    });
    // Do not log connection errors verbatim: URLs can contain credentials.
    this.client.on('error', () => {
      this.logger.warn('Redis unavailable; cache requests fall back to DB.');
    });
    this.client.on('ready', () => this.logger.log('Redis connected.'));
    void this.client.connect().catch(() => {});
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }

  get isReady(): boolean {
    return this.client?.status === 'ready';
  }

  async remember<T>(
    key: string,
    ttlSeconds: number,
    load: () => Promise<T>,
  ): Promise<T> {
    if (this.client?.status !== 'ready') {
      this.trace(`BYPASS ${key}`);
      return load();
    }

    try {
      const cached = await this.client.get(key);
      if (cached !== null) {
        const value = JSON.parse(cached) as T;
        this.trace(`HIT ${key}`);
        return value;
      }
      this.trace(`MISS ${key}`);
    } catch {
      this.trace(`READ ERROR ${key}; reading from DB`);
    }

    // Keep DB errors outside the Redis catch: a failed load must not be cached.
    const value = await load();
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      this.trace(`WRITE ERROR ${key}; returning DB result`);
    }
    return value;
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isReady) return false;
    try {
      await this.client!.set(key, value, 'EX', ttlSeconds);
      return true;
    } catch {
      return false;
    }
  }

  /** undefined: Redis unavailable; null: Redis available but key absent. */
  async getDel(key: string): Promise<string | null | undefined> {
    if (!this.isReady) return undefined;
    try {
      return await this.client!.getdel(key);
    } catch {
      return undefined;
    }
  }

  async delete(...keys: string[]): Promise<void> {
    if (!this.isReady || keys.length === 0) return;
    try {
      await this.client!.del(...keys);
    } catch {
      this.trace(`DELETE ERROR ${keys.join(',')}`);
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    if (!this.isReady) return;
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client!.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) await this.client!.del(...keys);
      } while (cursor !== '0');
    } catch {
      this.trace(`PATTERN DELETE ERROR ${pattern}`);
    }
  }

  async eval(
    script: string,
    keys: string[],
    args: Array<string | number>,
  ): Promise<unknown | undefined> {
    if (!this.isReady) return undefined;
    try {
      return await this.client!.eval(
        script,
        keys.length,
        ...keys,
        ...args.map(String),
      );
    } catch {
      return undefined;
    }
  }

  private trace(message: string) {
    if (process.env.REDIS_CACHE_DEBUG === 'true') this.logger.log(message);
  }
}
