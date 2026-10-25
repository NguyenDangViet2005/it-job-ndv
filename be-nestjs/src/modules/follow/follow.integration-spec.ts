import { orm } from '../../prisma/db.js';
import { FollowRepository } from './follow.repository.js';
import { FollowService } from './follow.service.js';
import { useDatabaseFixtures } from '../../../test/integration/fixtures.js';
const follows = new FollowService(new FollowRepository());
const context = useDatabaseFixtures();

describe('Follow service + repository + PostgreSQL', () => {
  it('persists a follow and removes it on the next toggle', async () => {
    const { candidate, company } = context.fixture;
    expect(await follows.toggleFollow(candidate.id, company.id)).toEqual({
      followed: true,
    });
    const result = await follows.getFollowsByCompany(company.id);
    expect(result.totalItems).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(
      await orm.Follow.where({
        userid: candidate.id,
        companyid: company.id,
      }).first(),
    ).not.toBeNull();
    expect(await follows.toggleFollow(candidate.id, company.id)).toEqual({
      followed: false,
    });
    expect((await follows.getFollowsByCompany(company.id)).totalItems).toBe(0);
  });

  it('handles two concurrent toggles without a duplicate or lost toggle', async () => {
    const { candidate, company } = context.fixture;
    const results = await Promise.all([
      follows.toggleFollow(candidate.id, company.id),
      follows.toggleFollow(candidate.id, company.id),
    ]);
    expect(
      results.map((r) => r.followed).sort((a, b) => Number(a) - Number(b)),
    ).toEqual([false, true]);
    expect(
      await orm.Follow.where({
        userid: candidate.id,
        companyid: company.id,
      }).first(),
    ).toBeNull();
  });
});
