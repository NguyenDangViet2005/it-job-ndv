import type { Numeric } from '@prisma/orm-postgres/target/codec-types';
import { orm, withTransaction } from './db.js';
import { SkillRepository } from '../modules/skill/skill.repository.js';
import { FollowRepository } from '../modules/follow/follow.repository.js';
import { FollowService } from '../modules/follow/follow.service.js';
import { ApplicationRepository } from '../modules/application/application.repository.js';
import { ApplicationService } from '../modules/application/application.service.js';
import {
  useDatabaseFixtures,
  skillName,
  expectSqlState,
  cleanupDatabaseFixtures,
  varchar,
} from '../../test/integration/fixtures.js';
const follows = new FollowService(new FollowRepository());
const applications = new ApplicationService(new ApplicationRepository());
const context = useDatabaseFixtures();

describe('Real PostgreSQL constraints and transaction context', () => {
  it('cleans up multiple generated companies, accounts and wards for one fixture', async () => {
    const { province, candidate } = context.fixture;
    const extraUser = await orm.User.create({
      fullname: varchar('Extra account', 100),
      email: varchar(`${context.prefix}-extra@test.local`, 100),
    });
    const ward = await orm.Wards.create({
      name: varchar(`${context.prefix}-second-ward`, 100),
      provinceid: province.id,
    });
    const company = await orm.Company.create({
      name: varchar(`${context.prefix}-second-company`, 150),
      wardid: ward.id,
      createdbyuserid: extraUser.id,
    });
    await orm.CompanyMembers.create({
      companyid: company.id,
      userid: extraUser.id,
    });
    await cleanupDatabaseFixtures(context.prefix);
    expect(await orm.Company.where({ id: company.id }).first()).toBeNull();
    expect(
      await orm.User.where((u) => u.id.in([candidate.id, extraUser.id])).all(),
    ).toEqual([]);
    expect(await orm.Wards.where({ provinceid: province.id }).all()).toEqual(
      [],
    );
    expect(await orm.Provinces.where({ id: province.id }).first()).toBeNull();
  });

  it('commits writes from multiple repositories in one transaction', async () => {
    const { candidate, company } = context.fixture;
    await withTransaction(async () => {
      await new SkillRepository().create(`${context.prefix}-committed`);
      await new FollowRepository().createFollow(candidate.id, company.id);
    });
    expect(
      await orm.Skill.where({
        name: skillName(`${context.prefix}-committed`),
      }).first(),
    ).not.toBeNull();
    expect(
      await orm.Follow.where({
        userid: candidate.id,
        companyid: company.id,
      }).first(),
    ).not.toBeNull();
  });

  it('rolls back writes from multiple repositories when later work fails', async () => {
    const { candidate, company } = context.fixture;
    await expect(
      withTransaction(async () => {
        await new SkillRepository().create(`${context.prefix}-rollback`);
        await new FollowRepository().createFollow(candidate.id, company.id);
        throw new Error('later operation failed');
      }),
    ).rejects.toThrow('later operation failed');
    expect(
      await orm.Skill.where({
        name: skillName(`${context.prefix}-rollback`),
      }).first(),
    ).toBeNull();
    expect(
      await orm.Follow.where({
        userid: candidate.id,
        companyid: company.id,
      }).first(),
    ).toBeNull();
  });

  it('keeps nested service transactions inside the outer rollback', async () => {
    const { candidate, company } = context.fixture;
    await expect(
      withTransaction(async () => {
        await follows.toggleFollow(candidate.id, company.id);
        throw new Error('outer failure');
      }),
    ).rejects.toThrow('outer failure');
    expect(
      await orm.Follow.where({
        userid: candidate.id,
        companyid: company.id,
      }).first(),
    ).toBeNull();
  });

  it('isolates concurrent async contexts and does not expose uncommitted writes', async () => {
    let release!: () => void;
    let written!: () => void;
    const ready = new Promise<void>((resolve) => {
      written = resolve;
    });
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const pending = withTransaction(async () => {
      try {
        await new SkillRepository().create(`${context.prefix}-private`);
      } finally {
        written();
      }
      await gate;
    });
    await ready;
    try {
      expect(
        await orm.Skill.where({
          name: skillName(`${context.prefix}-private`),
        }).first(),
      ).toBeNull();
      await withTransaction(() =>
        new SkillRepository().create(`${context.prefix}-independent`),
      );
    } finally {
      release();
      await pending;
    }
    expect(
      await orm.Skill.where({
        name: skillName(`${context.prefix}-private`),
      }).first(),
    ).not.toBeNull();
    expect(
      await orm.Skill.where({
        name: skillName(`${context.prefix}-independent`),
      }).first(),
    ).not.toBeNull();
  });

  it('enforces unique constraints even when bypassing service validation', async () => {
    await orm.Skill.create({ name: skillName(`${context.prefix}-unique`) });
    await expectSqlState(
      orm.Skill.create({ name: skillName(`${context.prefix}-unique`) }),
      '23505',
    );
    expect(
      await orm.Skill.where({
        name: skillName(`${context.prefix}-unique`),
      }).all(),
    ).toHaveLength(1);
  });

  it('enforces foreign keys and rolls back earlier writes on a SQL failure', async () => {
    const { company } = context.fixture;
    await expectSqlState(
      withTransaction(async () => {
        await new SkillRepository().create(`${context.prefix}-fk-rollback`);
        await new FollowRepository().createFollow(-1, company.id);
      }),
      '23503',
    );
    expect(
      await orm.Skill.where({
        name: skillName(`${context.prefix}-fk-rollback`),
      }).first(),
    ).toBeNull();
  });

  it('enforces the job salary check constraint', async () => {
    const { job } = context.fixture;
    await expectSqlState(
      orm.Job.where({ id: job.id }).update({
        isnegotiable: false,
        salarymin: '200' as Numeric<14, 2>,
        salarymax: '100' as Numeric<14, 2>,
      }),
      '23514',
    );
    expect(await orm.Job.where({ id: job.id }).first()).toMatchObject({
      isnegotiable: true,
      salarymin: null,
      salarymax: null,
    });
  });

  it('cascades job deletion to its applications', async () => {
    const { candidate, job } = context.fixture;
    await applications.create(candidate.id, { jobid: job.id });
    await orm.Job.where({ id: job.id }).delete();
    expect(await orm.Application.where({ jobid: job.id }).all()).toEqual([]);
  });
});
