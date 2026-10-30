import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { FollowService } from './follow.service.js';
import type { FollowRepository } from './follow.repository.js';

// Chỉ chạy callback nghiệp vụ; rollback/locking thật thuộc integration test.
vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));

describe('FollowService', () => {
  const repo = {
    findCompanyById: vi.fn(),
    findFollow: vi.fn(),
    createFollow: vi.fn(),
    deleteFollow: vi.fn(),
    countByCompanyId: vi.fn(),
    findByCompanyId: vi.fn(),
    findUsersByIds: vi.fn(),
  };
  let service: FollowService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new FollowService(repo as unknown as FollowRepository);
    repo.findCompanyById.mockResolvedValue({ id: 10 });
  });

  describe('toggleFollow', () => {
    it('rejects a missing company without writing anything', async () => {
      // Arrange: giả lập dữ liệu repository trả về.
      repo.findCompanyById.mockResolvedValue(null);
      // Act + Assert: gọi hàm thật, kiểm tra lỗi và tác dụng phụ.
      await expect(service.toggleFollow(1, 10)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.createFollow).not.toHaveBeenCalled();
      expect(repo.deleteFollow).not.toHaveBeenCalled();
    });

    it('creates a follow when the user is not following yet', async () => {
      repo.findFollow.mockResolvedValue(null);

      await expect(service.toggleFollow(1, 10)).resolves.toEqual({
        followed: true,
      });
      expect(repo.findFollow).toHaveBeenCalledWith(1, 10);
      expect(repo.createFollow).toHaveBeenCalledWith(1, 10);
      expect(repo.deleteFollow).not.toHaveBeenCalled();
    });

    it('removes an existing follow', async () => {
      repo.findFollow.mockResolvedValue({ userid: 1, companyid: 10 });

      await expect(service.toggleFollow(1, 10)).resolves.toEqual({
        followed: false,
      });
      expect(repo.deleteFollow).toHaveBeenCalledWith(1, 10);
      expect(repo.createFollow).not.toHaveBeenCalled();
    });

    it('propagates write failures instead of reporting success', async () => {
      const error = new Error('database unavailable');
      repo.createFollow.mockRejectedValue(error);
      await expect(service.toggleFollow(1, 10)).rejects.toBe(error);
    });
  });

  it('normalizes pagination and joins users by ID, not array position', async () => {
    repo.countByCompanyId.mockResolvedValue(2);
    repo.findByCompanyId.mockResolvedValue([
      { userid: 1, companyid: 10 },
      { userid: 2, companyid: 10 },
    ]);
    repo.findUsersByIds.mockResolvedValue([
      { id: 2, fullname: 'Binh' },
      { id: 1, fullname: 'An' },
    ]);

    const result = await service.getFollowsByCompany(10, 0, -1);
    expect(repo.findByCompanyId).toHaveBeenCalledWith(10, 0, 10);
    expect(result).toMatchObject({
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    });
    expect(result.data.map((follow) => follow.user?.fullname)).toEqual([
      'An',
      'Binh',
    ]);
  });

  it('does not load users for an empty follow list', async () => {
    repo.countByCompanyId.mockResolvedValue(0);
    repo.findByCompanyId.mockResolvedValue([]);
    await expect(service.getFollowsByCompany(10)).resolves.toMatchObject({
      data: [],
      totalPages: 0,
    });
    expect(repo.findUsersByIds).not.toHaveBeenCalled();
  });
});
