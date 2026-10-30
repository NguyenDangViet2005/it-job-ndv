import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import type { ReviewRepository } from './review.repository.js';

vi.mock('~/prisma/db.js', () => ({}));

describe('ReviewService', () => {
  const repo = {
    findById: vi.fn(),
    findUserById: vi.fn(),
    findCompanyById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  let service: ReviewService;
  const review = {
    id: 5,
    userid: 1,
    companyid: 10,
    rating: 4,
    comment: 'Good',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ReviewService(repo as unknown as ReviewRepository);
    repo.findById.mockResolvedValue(review);
    repo.findUserById.mockResolvedValue({ id: 1, fullname: 'An' });
    repo.findCompanyById.mockResolvedValue({ id: 10, name: 'Acme' });
    repo.create.mockResolvedValue(review);
  });

  it('does not create a review for an unknown company', async () => {
    repo.findCompanyById.mockResolvedValue(null);
    await expect(
      service.createReview(1, { companyid: 10, rating: 4 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('creates a review for the authenticated user and returns enriched data', async () => {
    const result = await service.createReview(1, {
      companyid: 10,
      rating: 4,
      comment: ' Good ',
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userid: 1,
        companyid: 10,
        rating: 4,
        comment: 'Good',
      }),
    );
    expect(result).toMatchObject({
      id: 5,
      userName: 'An',
      companyName: 'Acme',
    });
  });

  describe.each(['update', 'delete'] as const)(
    '%s permissions',
    (operation) => {
      const act = (
        service: ReviewService,
        user: { id: number; role: string },
      ) =>
        operation === 'update'
          ? service.updateReview(5, user, { rating: 5 })
          : service.deleteReview(5, user);

      it.each([
        { id: 1, role: 'user' },
        { id: 9, role: 'admin' },
      ])('allows $role with ID $id', async (user) => {
        await act(service, user);
        expect(repo[operation]).toHaveBeenCalled();
      });

      it('rejects a different user before writing', async () => {
        await expect(
          act(service, { id: 2, role: 'user' }),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(repo[operation]).not.toHaveBeenCalled();
      });

      it('rejects a missing review', async () => {
        repo.findById.mockResolvedValue(null);
        await expect(
          act(service, { id: 1, role: 'user' }),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(repo[operation]).not.toHaveBeenCalled();
      });
    },
  );
});
