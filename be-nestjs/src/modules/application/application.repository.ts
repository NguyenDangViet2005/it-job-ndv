import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class ApplicationRepository {
  async countAll(): Promise<number> {
    const { count } = await orm.Application.aggregate((a) => ({
      count: a.count(),
    }));
    return count;
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return orm.Application
      .orderBy((a: any) => a.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findByJobAndUser(jobId: number, userId: number) {
    return orm.Application
      .where({ jobid: jobId, userid: userId })
      .first();
  }

  async countByUserId(userId: number): Promise<number> {
    const { count } = await orm.Application
      .where({ userid: userId })
      .aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findByUserId(userId: number, offset: number = 0, limit: number = 10) {
    return orm.Application
      .where({ userid: userId })
      .orderBy((a: any) => a.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countByJobId(jobId: number): Promise<number> {
    const { count } = await orm.Application
      .where({ jobid: jobId })
      .aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findByJobId(jobId: number, offset: number = 0, limit: number = 10) {
    return orm.Application
      .where({ jobid: jobId })
      .orderBy((a: any) => a.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countByJobIds(jobIds: number[]): Promise<number> {
    if (jobIds.length === 0) return 0;
    const { count } = await orm.Application
      .where((a: any) => a.jobid.in(jobIds))
      .aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findByJobIds(jobIds: number[], offset: number = 0, limit: number = 10) {
    if (jobIds.length === 0) return [];
    return orm.Application
      .where((a: any) => a.jobid.in(jobIds))
      .orderBy((a: any) => a.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async create(data: any) {
    return orm.Application.create(data);
  }

  async updateStatus(jobId: number, userId: number, data: any) {
    return orm.Application
      .where({ jobid: jobId, userid: userId })
      .update(data);
  }

  async delete(jobId: number, userId: number) {
    return orm.Application.where({ jobid: jobId, userid: userId }).delete();
  }

  // Relations
  async findJobById(jobId: number) {
    return orm.Job.where({ id: jobId }).first();
  }

  async findJobsByCompanyId(companyId: number) {
    return orm.Job.where({ companyid: companyId }).all();
  }

  async findJobsWithCompanyByIds(jobIds: number[]) {
    if (jobIds.length === 0) return [];
    return orm.Job
      .where((j: any) => j.id.in(jobIds))
      .include('company')
      .all();
  }

  async findUserById(userId: number) {
    return orm.User.where({ id: userId }).first();
  }

  async findUsersByIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.User
      .where((u: any) => u.id.in(userIds))
      .all();
  }

  async findCompanyMember(companyId: number, userId: number) {
    return orm.CompanyMembers
      .where({ companyid: companyId, userid: userId, status: 'active' as any })
      .first();
  }

  async findCompanyById(companyId: number) {
    return orm.Company.where({ id: companyId }).first();
  }
}
