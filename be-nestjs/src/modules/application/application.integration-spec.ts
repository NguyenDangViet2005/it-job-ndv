import { Temporal } from '@js-temporal/polyfill';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { ApplicationRepository } from './application.repository.js';
import { ApplicationService } from './application.service.js';
import {
  useDatabaseFixtures,
  varchar,
} from '../../../test/integration/fixtures.js';
const applications = new ApplicationService(new ApplicationRepository());
const context = useDatabaseFixtures();

describe('Application service + repository + PostgreSQL', () => {
  it('uses the profile CV and enriches the application with related entities', async () => {
    const { candidate, company, job } = context.fixture;
    const result = await applications.create(candidate.id, { jobid: job.id });
    expect(result).toMatchObject({
      userid: candidate.id,
      jobid: job.id,
      status: 'pending',
      cvurl: candidate.cvurl,
      jobTitle: job.title,
      companyName: company.name,
      userEmail: candidate.email,
    });
    expect(
      await orm.Application.where({
        jobid: job.id,
        userid: candidate.id,
      }).first(),
    ).toMatchObject({ status: 'pending' });
  });

  it('rejects a duplicate application and retains one row', async () => {
    const { candidate, job } = context.fixture;
    await applications.create(candidate.id, { jobid: job.id });
    await expect(
      applications.create(candidate.id, { jobid: job.id }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await orm.Application.where({ jobid: job.id }).all()).toHaveLength(
      1,
    );
  });

  it.each(['closed', 'expired'] as const)(
    'rejects a %s job without persisting an application',
    async (state) => {
      const { candidate, job } = context.fixture;
      if (state === 'closed')
        await orm.Job.where({ id: job.id }).update({
          status: varchar('closed', 20),
        });
      else
        await orm.Job.where({ id: job.id }).update({
          deadline: Temporal.Now.plainDateISO().subtract({ days: 1 }),
        });
      await expect(
        applications.create(candidate.id, { jobid: job.id }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(await orm.Application.where({ jobid: job.id }).all()).toEqual([]);
    },
  );

  it('rejects a candidate without a CV', async () => {
    const { outsider, job } = context.fixture;
    await expect(
      applications.create(outsider.id, { jobid: job.id }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await orm.Application.where({ jobid: job.id }).all()).toEqual([]);
  });

  it('authorizes the company owner to update status and denies an unrelated user', async () => {
    const { owner, candidate, outsider, job } = context.fixture;
    await applications.create(candidate.id, { jobid: job.id });
    await expect(
      applications.updateStatus(
        job.id,
        candidate.id,
        { id: outsider.id, role: 'user' },
        { status: 'rejected' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(
      await orm.Application.where({
        jobid: job.id,
        userid: candidate.id,
      }).first(),
    ).toMatchObject({ status: 'pending' });
    expect(
      await applications.updateStatus(
        job.id,
        candidate.id,
        { id: owner.id, role: 'employer' },
        { status: 'accepted' },
      ),
    ).toMatchObject({ status: 'accepted' });
  });

  it('allows the candidate to withdraw their application', async () => {
    const { candidate, job } = context.fixture;
    await applications.create(candidate.id, { jobid: job.id });
    await applications.deleteApplication(job.id, candidate.id, {
      id: candidate.id,
      role: 'user',
    });
    expect(
      await orm.Application.where({
        jobid: job.id,
        userid: candidate.id,
      }).first(),
    ).toBeNull();
  });
});
