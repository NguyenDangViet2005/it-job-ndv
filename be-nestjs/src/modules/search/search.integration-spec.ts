import { Temporal } from '@js-temporal/polyfill';
import { orm } from '../../prisma/db.js';
import { SearchService } from './search.service.js';
import { SearchRepository } from './search.repository.js';
import {
  useDatabaseFixtures,
  varchar,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new SearchService(new SearchRepository());

describe('Search service + repository + PostgreSQL', () => {
  it('finds jobs, companies and skills case-insensitively with joined details', async () => {
    const { job, company, ward, province } = context.fixture;
    await orm.Job.where({ id: job.id }).update({
      title: varchar(`${context.prefix}-Developer`, 150),
    });
    const skill = await orm.Skill.create({
      name: varchar(`${context.prefix}-SQL`, 100),
    });
    await orm.SkillJob.create({ jobid: job.id, skillid: skill.id });
    const result = await service.search({
      keyword: ` ${context.prefix.toUpperCase()} `,
    });
    expect(result.jobs).toMatchObject([
      { id: job.id, company: { id: company.id }, skills: [{ id: skill.id }] },
    ]);
    expect(result.companies).toMatchObject([
      { id: company.id, wardname: ward.name, provincename: province.name },
    ]);
    expect(result.skills).toMatchObject([{ id: skill.id }]);
  });

  it('excludes closed and expired jobs while including jobs due today', async () => {
    const { company, job } = context.fixture;
    const title = varchar(`${context.prefix}-Developer`, 150);
    const today = Temporal.Now.plainDateISO();
    await orm.Job.where({ id: job.id }).update({ title, deadline: today });
    await orm.Job.create({
      companyid: company.id,
      title,
      status: varchar('closed', 20),
      deadline: today.add({ days: 1 }),
    });
    await orm.Job.create({
      companyid: company.id,
      title,
      deadline: today.subtract({ days: 1 }),
    });
    expect(
      (await service.search({ keyword: context.prefix })).jobs,
    ).toMatchObject([{ id: job.id }]);
    expect(
      (await service.search({ keyword: context.prefix })).jobs,
    ).toHaveLength(1);
  });

  it('paginates matching skills independently of other result types', async () => {
    for (const suffix of ['Charlie', 'Alpha', 'Bravo']) {
      await orm.Skill.create({
        name: varchar(`${context.prefix}-${suffix}`, 100),
      });
    }
    const result = await service.search({
      keyword: context.prefix,
      page: 2,
      pageSize: 1,
    });
    expect(result.skills.map((s) => s.name)).toEqual([
      `${context.prefix}-Bravo`,
    ]);
    expect(result.companies).toEqual([]);
  });
});
