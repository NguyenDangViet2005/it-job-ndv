import { describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { LocationService } from './location.service.js';
import type { LocationRepository } from './location.repository.js';
import type { RedisCacheService } from '../redis/redis-cache.service.js';

vi.mock('~/prisma/db.js', () => ({}));

function setup() {
  const repo = {
    findAllProvinces: vi.fn().mockResolvedValue([{ id: 1 }]),
    findProvinceById: vi.fn().mockResolvedValue({ id: 1 }),
    findWardsByProvinceId: vi.fn().mockResolvedValue([]),
  };
  const remember = vi.fn(
    async (_key: string, _ttl: number, load: () => Promise<unknown>) => load(),
  );
  const service = new LocationService(
    repo as unknown as LocationRepository,
    { remember } as unknown as RedisCacheService,
  );
  return { repo, remember, service };
}

describe('LocationService cache', () => {
  it('uses a shared provinces key and its domain TTL', async () => {
    const { service, remember } = setup();
    await expect(service.getAllProvinces()).resolves.toEqual([{ id: 1 }]);
    expect(remember).toHaveBeenCalledWith(
      'itjob:locations:provinces',
      86400,
      expect.any(Function),
    );
  });
  it('uses distinct ward keys per province and its domain TTL', async () => {
    const { service, remember, repo } = setup();
    await service.getWardsByProvinceId(1);
    await service.getWardsByProvinceId(2);
    expect(remember.mock.calls.map(([key]) => key)).toEqual([
      'itjob:locations:wards:province:1',
      'itjob:locations:wards:province:2',
    ]);
    expect(remember.mock.calls[0][1]).toBe(86400);
    expect(repo.findWardsByProvinceId).toHaveBeenCalledWith(2);
  });
  it('preserves 404 for a nonexistent province', async () => {
    const { service, repo } = setup();
    repo.findProvinceById.mockResolvedValue(null);
    await expect(service.getWardsByProvinceId(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.findWardsByProvinceId).not.toHaveBeenCalled();
  });
});
