import { randomUUID } from 'node:crypto';
import { Temporal } from '@js-temporal/polyfill';
import { beforeEach, afterEach, expect, vi } from 'vitest';
import type { Varchar } from '@prisma/orm-postgres/target/codec-types';
import { orm, withTransaction } from '../../src/prisma/db.js';
import { CloudinaryService } from '../../src/modules/cloudinary/cloudinary.service.js';

// Only the external media boundary is replaced; services and repositories stay real.
export function createOfflineCloudinary() {
  return Object.assign(new CloudinaryService(), {
    uploadFile: vi
      .fn<CloudinaryService['uploadFile']>()
      .mockRejectedValue(
        new Error('Unexpected external upload in database integration test'),
      ),
    deleteFile: vi
      .fn<CloudinaryService['deleteFile']>()
      .mockResolvedValue(true),
  });
}

// The emitted Prisma contract brands VARCHAR values by their maximum length.
export function varchar<N extends number>(
  value: string,
  length: N,
): Varchar<N> {
  if (value.length > length) throw new Error('Fixture exceeds VARCHAR length');
  return value as Varchar<N>;
}
export const skillName = (value: string) => varchar(value, 100);

export async function expectSqlState(
  operation: Promise<unknown>,
  state: string,
) {
  const error: unknown = await operation.then(
    () => {
      throw new Error(`Expected PostgreSQL SQLSTATE ${state}`);
    },
    (failure: unknown) => failure,
  );
  const codes: unknown[] = [];
  const seen = new Set<unknown>();
  let current = error as
    | {
        code?: string;
        sqlState?: string;
        meta?: { code?: string; sqlState?: string };
        cause?: unknown;
      }
    | undefined;
  while (current && !seen.has(current)) {
    seen.add(current);
    codes.push(
      current.code,
      current.sqlState,
      current.meta?.code,
      current.meta?.sqlState,
    );
    current = current.cause as typeof current;
  }
  expect(codes, 'Expected a real PostgreSQL constraint failure').toContain(
    state,
  );
}

async function seed(prefix: string) {
  return withTransaction(async () => {
    const owner = await orm.User.create({
      fullname: varchar('Employer', 100),
      email: varchar(`${prefix}-owner@test.local`, 100),
      role: varchar('employer', 20),
    });
    const candidate = await orm.User.create({
      fullname: varchar('Candidate', 100),
      email: varchar(`${prefix}-candidate@test.local`, 100),
      cvurl: varchar('https://example.com/cv.pdf', 255),
    });
    const outsider = await orm.User.create({
      fullname: varchar('Other user', 100),
      email: varchar(`${prefix}-other@test.local`, 100),
    });
    const province = await orm.Provinces.create({
      name: varchar(`${prefix}-province`, 100),
    });
    const ward = await orm.Wards.create({
      name: varchar(`${prefix}-ward`, 100),
      provinceid: province.id,
    });
    const category = await orm.BlogCategory.create({
      name: varchar(`${prefix}-category`, 100),
    });
    const company = await orm.Company.create({
      name: varchar(`${prefix}-company`, 150),
      createdbyuserid: owner.id,
      wardid: ward.id,
    });
    const job = await orm.Job.create({
      companyid: company.id,
      title: varchar('Backend Developer', 150),
      deadline: Temporal.Now.plainDateISO().add({ days: 30 }),
    });
    return {
      owner,
      candidate,
      outsider,
      company,
      job,
      province,
      ward,
      category,
    };
  });
}

export function useDatabaseFixtures() {
  let prefix: string;
  let fixture: Awaited<ReturnType<typeof seed>> | undefined;

  beforeEach(async () => {
    prefix = `it-${randomUUID()}`;
    fixture = undefined;
    fixture = await seed(prefix);
  });

  afterEach(async () => {
    if (fixture) await cleanupDatabaseFixtures(prefix);
  });

  return {
    get prefix() {
      return prefix;
    },
    get fixture() {
      if (!fixture)
        throw new Error('Database fixture has not been initialized');
      return fixture;
    },
  };
}

export async function cleanupDatabaseFixtures(prefix: string) {
  if (
    !/^it-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      prefix,
    )
  ) {
    throw new Error(
      'Cleanup requires an exact integration fixture UUID prefix',
    );
  }
  await withTransaction(async () => {
    // Discover additional accounts/companies made by register/create flows too.
    const users = await orm.User.where((u) =>
      u.email.ilike(`${prefix}%`),
    ).all();
    const userIds = users.map((u) => u.id);
    const companies = await orm.Company.where((c) =>
      c.name.ilike(`${prefix}%`),
    ).all();
    const companyIds = companies.map((c) => c.id);
    const jobs = await orm.Job.where((j) => j.companyid.in(companyIds)).all();
    const jobIds = jobs.map((j) => j.id);
    await orm.Application.where((a) => a.jobid.in(jobIds)).deleteAndCount();
    await orm.Application.where((a) => a.userid.in(userIds)).deleteAndCount();
    await orm.Follow.where((f) => f.companyid.in(companyIds)).deleteAndCount();
    await orm.Follow.where((f) => f.userid.in(userIds)).deleteAndCount();
    await orm.Review.where((r) => r.companyid.in(companyIds)).deleteAndCount();
    await orm.Connection.where((c) => c.userid.in(userIds)).deleteAndCount();
    await orm.Connection.where((c) =>
      c.connecteduserid.in(userIds),
    ).deleteAndCount();
    // Post deletion cascades to interactions and both attachment targets.
    await orm.Post.where((p) => p.userid.in(userIds)).deleteAndCount();
    await orm.Blog.where((b) => b.userid.in(userIds)).deleteAndCount();
    await orm.SessionLogins.where((s) => s.userid.in(userIds)).deleteAndCount();
    await orm.CompanyMembers.where((m) =>
      m.companyid.in(companyIds),
    ).deleteAndCount();
    await orm.SkillUser.where((s) => s.userid.in(userIds)).deleteAndCount();
    await orm.SkillJob.where((s) => s.jobid.in(jobIds)).deleteAndCount();
    await orm.Job.where((j) => j.id.in(jobIds)).deleteAndCount();
    await orm.Company.where((c) => c.id.in(companyIds)).deleteAndCount();
    await orm.User.where((u) => u.id.in(userIds)).deleteAndCount();
    await orm.Skill.where((s) => s.name.ilike(`${prefix}%`)).deleteAndCount();
    await orm.BlogCategory.where((c) =>
      c.name.ilike(`${prefix}%`),
    ).deleteAndCount();
    const provinces = await orm.Provinces.where((p) =>
      p.name.ilike(`${prefix}%`),
    ).all();
    const provinceIds = provinces.map((p) => p.id);
    await orm.Wards.where((w) => w.provinceid.in(provinceIds)).deleteAndCount();
    await orm.Provinces.where((p) => p.id.in(provinceIds)).deleteAndCount();
  });
}
