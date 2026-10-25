import { ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { ReviewService } from './review.service.js';
import { ReviewRepository } from './review.repository.js';
import {
  useDatabaseFixtures,
  expectSqlState,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new ReviewService(new ReviewRepository());
const create = () =>
  service.createReview(context.fixture.candidate.id, {
    companyid: context.fixture.company.id,
    rating: 4,
    comment: ' Helpful team ',
  });

describe('Review service + repository + PostgreSQL', () => {
  it('creates an enriched review and allows its author to update and delete it', async () => {
    const { candidate, company } = context.fixture;
    const review = await create();
    expect(review).toMatchObject({
      rating: 4,
      comment: 'Helpful team',
      userName: candidate.fullname,
      companyName: company.name,
    });
    await service.updateReview(
      review.id,
      { id: candidate.id, role: 'user' },
      { rating: 5 },
    );
    expect(await orm.Review.where({ id: review.id }).first()).toMatchObject({
      rating: 5,
    });
    await service.deleteReview(review.id, { id: candidate.id, role: 'user' });
    expect(await orm.Review.where({ id: review.id }).first()).toBeNull();
  });

  it('denies an unrelated user permission to edit or delete a review', async () => {
    const { outsider } = context.fixture;
    const review = await create();
    await expect(
      service.updateReview(
        review.id,
        { id: outsider.id, role: 'user' },
        { rating: 1 },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.deleteReview(review.id, { id: outsider.id, role: 'user' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(await orm.Review.where({ id: review.id }).first()).toMatchObject({
      rating: 4,
    });
  });

  it('enforces the rating range even when HTTP validation is bypassed', async () => {
    await expectSqlState(
      service.createReview(context.fixture.candidate.id, {
        companyid: context.fixture.company.id,
        rating: 6,
      }),
      '23514',
    );
    expect(
      await orm.Review.where({ companyid: context.fixture.company.id }).all(),
    ).toEqual([]);
  });
});
