import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SkillService } from './skill.service.js';
import type { SkillRepository } from './skill.repository.js';
import type { RedisCacheService } from '../redis/redis-cache.service.js';

vi.mock('~/prisma/db.js', () => ({}));

describe('SkillService', () => {
  const repo = {
    findById: vi.fn(),
    findByNameCaseInsensitive: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    isUsed: vi.fn(),
    delete: vi.fn(),
  };
  let service: SkillService;
  const cache = {
    remember: vi.fn(
      async (_key: string, _ttl: number, load: () => Promise<unknown>) =>
        load(),
    ),
    deleteByPattern: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    service = new SkillService(
      repo as unknown as SkillRepository,
      cache as unknown as RedisCacheService,
    );
    repo.findById.mockResolvedValue({ id: 1, name: 'TypeScript' });
  });

  it('trims the name before duplicate lookup and creation', async () => {
    repo.create.mockResolvedValue({ id: 2, name: 'Jest' });
    await expect(service.createSkill({ name: '  Jest  ' })).resolves.toEqual({
      id: 2,
      name: 'Jest',
    });
    expect(repo.findByNameCaseInsensitive).toHaveBeenCalledWith('Jest');
    expect(repo.create).toHaveBeenCalledWith('Jest');
  });

  it('caches skill detail with a domain-specific key and TTL', async () => {
    await service.getSkillById(1);
    expect(cache.remember).toHaveBeenCalledWith(
      'itjob:skills:detail:1',
      3600,
      expect.any(Function),
    );
  });

  it('rejects a duplicate skill without creating it', async () => {
    repo.findByNameCaseInsensitive.mockResolvedValue({ id: 2, name: 'jest' });
    await expect(service.createSkill({ name: 'JEST' })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('allows updating a skill without changing its identity', async () => {
    repo.findByNameCaseInsensitive.mockResolvedValue({ id: 1 });
    repo.update.mockResolvedValue({ id: 1, name: 'TYPESCRIPT' });
    await expect(
      service.updateSkill(1, { name: ' TYPESCRIPT ' }),
    ).resolves.toMatchObject({ id: 1 });
    expect(repo.update).toHaveBeenCalledWith(1, 'TYPESCRIPT');
  });

  it('rejects renaming to another skill name', async () => {
    repo.findByNameCaseInsensitive.mockResolvedValue({ id: 2 });
    await expect(
      service.updateSkill(1, { name: 'Jest' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it.each(['get', 'update', 'delete'] as const)(
    'rejects %s for an unknown skill',
    async (operation) => {
      repo.findById.mockResolvedValue(null);
      const result =
        operation === 'get'
          ? service.getSkillById(99)
          : operation === 'update'
            ? service.updateSkill(99, { name: 'Jest' })
            : service.deleteSkill(99);
      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.update).not.toHaveBeenCalled();
      expect(repo.delete).not.toHaveBeenCalled();
    },
  );

  it('prevents deleting a skill used by users or jobs', async () => {
    repo.isUsed.mockResolvedValue(true);
    await expect(service.deleteSkill(1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('deletes an unused skill', async () => {
    repo.isUsed.mockResolvedValue(false);
    await expect(service.deleteSkill(1)).resolves.toBe(true);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(cache.deleteByPattern).toHaveBeenCalledWith('itjob:skills:*');
    expect(cache.deleteByPattern).toHaveBeenCalledWith('itjob:jobs:*');
  });
});
