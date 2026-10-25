import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { CompanyService } from './company.service.js';
import { CompanyRepository } from './company.repository.js';
import {
  useDatabaseFixtures,
  createOfflineCloudinary,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new CompanyService(
  new CompanyRepository(),
  createOfflineCloudinary(),
);

describe('Company service + repository + PostgreSQL', () => {
  it('creates a company with its active membership and location', async () => {
    const { outsider, ward, province } = context.fixture;
    const company = await service.createCompany(outsider.id, {
      name: `${context.prefix}-new-company`,
      wardid: ward.id,
    });
    expect(company).toMatchObject({
      createdbyuserid: outsider.id,
      wardname: ward.name,
      provincename: province.name,
      membersCount: 1,
    });
    expect(
      await orm.CompanyMembers.where({
        companyid: company.id,
        userid: outsider.id,
      }).first(),
    ).toMatchObject({ status: 'active' });
    expect(await service.getCompanyByUserId(outsider.id)).toMatchObject({
      id: company.id,
    });
  });

  it('rejects an invalid location before persisting a company', async () => {
    const { outsider } = context.fixture;
    await expect(
      service.createCompany(outsider.id, {
        name: `${context.prefix}-invalid`,
        wardid: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(
      await orm.Company.where({ createdbyuserid: outsider.id }).all(),
    ).toEqual([]);
  });

  it('denies unrelated editors and allows an active company member to update', async () => {
    const { outsider, company } = context.fixture;
    await expect(
      service.updateCompany(
        company.id,
        { id: outsider.id, role: 'user' },
        { name: `${context.prefix}-changed` },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(await orm.Company.where({ id: company.id }).first()).toMatchObject({
      name: company.name,
    });
    await new CompanyRepository().addMember(company.id, outsider.id);
    expect(
      await service.updateCompany(
        company.id,
        { id: outsider.id, role: 'employer' },
        { name: `${context.prefix}-changed` },
      ),
    ).toMatchObject({ name: `${context.prefix}-changed` });
  });

  it('deletes jobs, applications, follows, reviews and memberships with the company', async () => {
    const { owner, candidate, company, job } = context.fixture;
    await orm.Application.create({ jobid: job.id, userid: candidate.id });
    await orm.Follow.create({ userid: candidate.id, companyid: company.id });
    await orm.Review.create({
      userid: candidate.id,
      companyid: company.id,
      rating: 4,
    });
    await new CompanyRepository().addMember(company.id, owner.id);
    await service.deleteCompany(company.id, { id: owner.id, role: 'employer' });
    expect(await orm.Company.where({ id: company.id }).first()).toBeNull();
    expect(await orm.Job.where({ companyid: company.id }).all()).toEqual([]);
    expect(await orm.Application.where({ jobid: job.id }).all()).toEqual([]);
    expect(await orm.Follow.where({ companyid: company.id }).all()).toEqual([]);
    expect(await orm.Review.where({ companyid: company.id }).all()).toEqual([]);
    expect(
      await orm.CompanyMembers.where({ companyid: company.id }).all(),
    ).toEqual([]);
    expect(await orm.User.where({ id: owner.id }).first()).not.toBeNull();
  });
});
