import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import {
  nowPlainDate,
  startOfTodayPlainDateTime,
  endOfTodayPlainDateTime,
} from '~/common/utils/temporal.util.js';

@Injectable()
export class JobRepository {
  async countOpenJobs(keyword?: string): Promise<number> {
    const today = nowPlainDate();
    let countQuery = orm.Job
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today));

    if (keyword) {
      countQuery = countQuery.where((j: any) => j.title.ilike(`%${keyword}%`)) as any;
    }

    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findOpenJobs(keyword?: string, offset: number = 0, limit: number = 10) {
    const today = nowPlainDate();
    let dataQuery = orm.Job
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today));

    if (keyword) {
      dataQuery = dataQuery.where((j: any) => j.title.ilike(`%${keyword}%`)) as any;
    }

    return dataQuery
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findById(id: number) {
    return orm.Job
      .where({ id })
      .include('company')
      .first();
  }

  async findJobsToday() {
    const today = nowPlainDate();
    const startOfToday = startOfTodayPlainDateTime();
    const endOfToday = endOfTodayPlainDateTime();

    return orm.Job
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today))
      .where((j: any) => j.createdat.gte(startOfToday))
      .where((j: any) => j.createdat.lt(endOfToday))
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .all();
  }

  async findSkillJobsBySkillId(skillId: number) {
    return orm.SkillJob.where({ skillid: skillId }).all();
  }

  async countJobsByIds(jobIds: number[]): Promise<number> {
    if (jobIds.length === 0) return 0;
    const today = nowPlainDate();
    const { count } = await orm.Job
      .where((j: any) => j.id.in(jobIds))
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today))
      .aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findJobsByIds(jobIds: number[], offset: number = 0, limit: number = 10) {
    if (jobIds.length === 0) return [];
    const today = nowPlainDate();
    return orm.Job
      .where((j: any) => j.id.in(jobIds))
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today))
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countJobsByCompanyId(companyId: number, onlyActive: boolean = false): Promise<number> {
    let queryBuilder = orm.Job.where({ companyid: companyId });
    if (onlyActive) {
      const today = nowPlainDate();
      queryBuilder = queryBuilder
        .where((j: any) => j.status.neq('closed'))
        .where((j: any) => j.deadline.gte(today)) as any;
    }
    const { count } = await queryBuilder.aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findJobsByCompanyId(companyId: number, offset: number = 0, limit: number = 10, onlyActive: boolean = false) {
    let queryBuilder = orm.Job.where({ companyid: companyId });
    if (onlyActive) {
      const today = nowPlainDate();
      queryBuilder = queryBuilder
        .where((j: any) => j.status.neq('closed'))
        .where((j: any) => j.deadline.gte(today)) as any;
    }
    return queryBuilder
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findCompanyMemberByUserId(userId: number) {
    return orm.CompanyMembers
      .where({ userid: userId, status: 'active' as any })
      .first();
  }

  async findCompanyMember(companyId: number, userId: number) {
    return orm.CompanyMembers
      .where({ companyid: companyId, userid: userId, status: 'active' as any })
      .first();
  }

  async findCompanyByCreatorId(userId: number) {
    return orm.Company
      .where({ createdbyuserid: userId })
      .first();
  }

  async findCompanyById(companyId: number) {
    return orm.Company.where({ id: companyId }).first();
  }

  async create(data: any) {
    return orm.Job.create(data);
  }

  async update(id: number, data: any) {
    return orm.Job.where({ id }).update(data);
  }

  async delete(id: number) {
    await orm.SkillJob.where({ jobid: id }).delete();
    await orm.Application.where({ jobid: id }).delete();
    return orm.Job.where({ id }).delete();
  }

  async addSkillJob(jobId: number, skillId: number) {
    return orm.SkillJob.create({
      jobid: jobId as any,
      skillid: skillId as any,
    });
  }

  async deleteSkillJobsByJobId(jobId: number) {
    return orm.SkillJob.where({ jobid: jobId }).delete();
  }

  async findSkillJobsByJobIds(jobIds: number[]) {
    if (jobIds.length === 0) return [];
    return orm.SkillJob
      .where((sj: any) => sj.jobid.in(jobIds))
      .include('skill')
      .all();
  }

  async findApplicationsByJobIds(jobIds: number[]) {
    if (jobIds.length === 0) return [];
    return orm.Application
      .where((a: any) => a.jobid.in(jobIds))
      .all();
  }

  async findCompaniesByIds(companyIds: number[]) {
    if (companyIds.length === 0) return [];
    return orm.Company
      .where((c: any) => c.id.in(companyIds))
      .include('companyMembers')
      .all();
  }
}
