import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';

@Injectable()
export class CompanyRepository {
  async count(keyword?: string): Promise<number> {
    if (keyword) {
      const agg = await orm.Company
        .where((c: any) => c.name.ilike(`%${keyword}%`))
        .aggregate((a) => ({ count: a.count() }));
      return agg.count;
    }
    const agg = await orm.Company.aggregate((a) => ({
      count: a.count(),
    }));
    return agg.count;
  }

  async findCompanies(keyword?: string, offset: number = 0, limit: number = 10) {
    let query = orm.Company;
    if (keyword) {
      query = query.where((c: any) => c.name.ilike(`%${keyword}%`)) as any;
    }
    return query
      .include('companyMembers')
      .include('jobs')
      .include('posts')
      .include('reviews')
      .include('follows')
      .orderBy((c: any) => c.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countLogos(): Promise<number> {
    const { count } = await orm.Company.aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findCompanyLogos(offset: number = 0, limit: number = 10) {
    return orm.Company
      .orderBy((c: any) => c.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findById(id: number) {
    return orm.Company
      .where({ id })
      .include('companyMembers')
      .include('jobs')
      .include('posts')
      .include('reviews')
      .include('follows')
      .first();
  }

  async findSimpleById(id: number) {
    return orm.Company.where({ id }).first();
  }

  async findMemberByUserId(userId: number) {
    return orm.CompanyMembers
      .where({ userid: userId, status: 'active' as any })
      .first();
  }

  async findMember(companyId: number, userId: number) {
    return orm.CompanyMembers
      .where({ companyid: companyId, userid: userId, status: 'active' as any })
      .first();
  }

  async findByCreatorId(userId: number) {
    return orm.Company
      .where({ createdbyuserid: userId })
      .first();
  }

  async findWardById(wardId: number) {
    return orm.Wards
      .where({ id: wardId })
      .include('provinces')
      .first();
  }

  async findWardsByIds(wardIds: number[]) {
    if (wardIds.length === 0) return [];
    return orm.Wards
      .where((w: any) => w.id.in(wardIds))
      .include('provinces')
      .all();
  }

  async create(data: any) {
    return orm.Company.create(data);
  }

  async addMember(companyId: number, userId: number, status: string = 'active') {
    return orm.CompanyMembers.create({
      companyid: companyId as any,
      userid: userId as any,
      status: status as any,
      joinedat: nowPlainDateTime() as any,
    });
  }

  async update(id: number, data: any) {
    return orm.Company.where({ id }).update(data);
  }

  async updateAvatar(id: number, avatar: string) {
    return orm.Company.where({ id }).update({
      avatar: avatar as any,
      updatedat: nowPlainDateTime() as any,
    });
  }

  async updateCover(id: number, coverimage: string) {
    return orm.Company.where({ id }).update({
      coverimage: coverimage as any,
      updatedat: nowPlainDateTime() as any,
    });
  }

  // Phục vụ xóa sạch liên kết công ty
  async findJobsByCompanyId(companyId: number) {
    return orm.Job.where({ companyid: companyId }).all();
  }

  async deleteJobsAndApplications(jobIds: number[]) {
    if (jobIds.length === 0) return;
    await orm.Application.where((a: any) => a.jobid.in(jobIds)).delete();
    await orm.SkillJob.where((sj: any) => sj.jobid.in(jobIds)).delete();
    await orm.Job.where((j: any) => j.id.in(jobIds)).delete();
  }

  async findPostsByCompanyId(companyId: number) {
    return orm.Post.where({ companyid: companyId }).all();
  }

  async findAttachmentsByPostIds(postIds: number[]) {
    if (postIds.length === 0) return [];
    return orm.Attachment.where((att: any) => att.postid.in(postIds)).all();
  }

  async deletePostsAndRelations(postIds: number[]) {
    if (postIds.length === 0) return;
    await orm.Attachment.where((att: any) => att.postid.in(postIds)).delete();
    await orm.Interaction.where((it: any) => it.postid.in(postIds)).delete();
    await orm.Post.where((p: any) => p.id.in(postIds)).delete();
  }

  async deleteFollowsReviewsMembersAndCompany(companyId: number) {
    await orm.Follow.where({ companyid: companyId }).delete();
    await orm.Review.where({ companyid: companyId }).delete();
    await orm.CompanyMembers.where({ companyid: companyId }).delete();
    await orm.Company.where({ id: companyId }).delete();
  }
}
