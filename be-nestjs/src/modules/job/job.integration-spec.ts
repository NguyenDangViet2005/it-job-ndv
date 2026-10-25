import { ForbiddenException } from '@nestjs/common';
import { Temporal } from '@js-temporal/polyfill';
import { orm } from '../../prisma/db.js';
import { JobService } from './job.service.js';
import { JobRepository } from './job.repository.js';
import {
  useDatabaseFixtures,
  varchar,
  expectSqlState,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new JobService(new JobRepository());
const deadline = () => Temporal.Now.plainDateISO().add({ days: 30 }).toString();

describe('Job service + repository + PostgreSQL', () => {
  it('creates a job with skills and reads joined company and salary data', async () => {
    const { owner, company } = context.fixture;
    const skill = await orm.Skill.create({
      name: varchar(`${context.prefix}-SQL`, 100),
    });
    const result = await service.create(owner.id, {
      title: `${context.prefix}-Developer`,
      deadline: deadline(),
      skillids: [skill.id],
      isnegotiable: false,
      salarymin: 1000,
      salarymax: 2000,
      currency: 'USD',
      salaryperiod: 'month',
    });
    expect(result).toMatchObject({
      companyid: company.id,
      company: { id: company.id },
      skills: [{ id: skill.id }],
      isnegotiable: false,
    });
    expect(Number(result.salarymin)).toBe(1000);
    expect(Number(result.salarymax)).toBe(2000);
    expect(await orm.SkillJob.where({ jobid: result.id }).all()).toMatchObject([
      { skillid: skill.id },
    ]);
  });

  it('rolls back the job when linking a missing skill violates a foreign key', async () => {
    const { owner, company } = context.fixture;
    await expectSqlState(
      service.create(owner.id, {
        title: `${context.prefix}-invalid`,
        deadline: deadline(),
        skillids: [-1],
      }),
      '23503',
    );
    expect(await orm.Job.where({ companyid: company.id }).all()).toHaveLength(
      1,
    );
  });

  it('protects updates and replaces skill links atomically', async () => {
    const { owner, outsider, job } = context.fixture;
    const skill = await orm.Skill.create({
      name: varchar(`${context.prefix}-Node`, 100),
    });
    await expect(
      service.update(
        job.id,
        { id: outsider.id, role: 'user' },
        { title: 'Intruder' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await service.update(
      job.id,
      { id: owner.id, role: 'employer' },
      { title: 'Updated job', skillids: [skill.id] },
    );
    expect(await service.getById(job.id)).toMatchObject({
      title: 'Updated job',
      skills: [{ id: skill.id }],
    });
    await expectSqlState(
      service.update(
        job.id,
        { id: owner.id, role: 'employer' },
        { title: 'Must rollback', skillids: [-1] },
      ),
      '23503',
    );
    expect(await service.getById(job.id)).toMatchObject({
      title: 'Updated job',
      skills: [{ id: skill.id }],
    });
  });

  it('deletes a job together with applications and skill links', async () => {
    const { owner, candidate, job } = context.fixture;
    const skill = await orm.Skill.create({
      name: varchar(`${context.prefix}-linked`, 100),
    });
    await orm.SkillJob.create({ jobid: job.id, skillid: skill.id });
    await orm.Application.create({ jobid: job.id, userid: candidate.id });
    await service.deleteJob(job.id, { id: owner.id, role: 'employer' });
    expect(await orm.Job.where({ id: job.id }).first()).toBeNull();
    expect(await orm.Application.where({ jobid: job.id }).all()).toEqual([]);
    expect(await orm.SkillJob.where({ jobid: job.id }).all()).toEqual([]);
  });
});
