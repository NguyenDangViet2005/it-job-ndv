import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class ReviewRepository {
  async findById(id: number) {
    return orm.Review.where({ id }).first();
  }

  async findUserById(userId: number) {
    return orm.User.where({ id: userId }).first();
  }

  async findUsersByIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.User.where((u: any) => u.id.in(userIds)).all();
  }

  async findCompanyById(companyId: number) {
    return orm.Company.where({ id: companyId }).first();
  }

  async findCompaniesByIds(companyIds: number[]) {
    if (companyIds.length === 0) return [];
    return orm.Company.where((c: any) => c.id.in(companyIds)).all();
  }

  async countByCompanyId(companyId: number): Promise<number> {
    const { count } = await orm.Review.where({ companyid: companyId }).aggregate(
      (a) => ({ count: a.count() }),
    );
    return count;
  }

  async findByCompanyId(companyId: number, offset: number, limit: number) {
    return orm.Review.where({ companyid: companyId })
      .orderBy((r: any) => r.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countByUserId(userId: number): Promise<number> {
    const { count } = await orm.Review.where({ userid: userId }).aggregate(
      (a) => ({ count: a.count() }),
    );
    return count;
  }

  async findByUserId(userId: number, offset: number, limit: number) {
    return orm.Review.where({ userid: userId })
      .orderBy((r: any) => r.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async create(data: any) {
    return orm.Review.create(data);
  }

  async update(id: number, data: any) {
    return orm.Review.where({ id }).update(data);
  }

  async delete(id: number) {
    return orm.Review.where({ id }).delete();
  }
}
