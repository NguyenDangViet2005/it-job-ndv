import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';

@Injectable()
export class FollowRepository {
  async findCompanyById(companyId: number) {
    return orm.Company.where({ id: companyId }).first();
  }

  async findFollow(userId: number, companyId: number) {
    return orm.Follow.where({
      userid: userId,
      companyid: companyId,
    }).first();
  }

  async deleteFollow(userId: number, companyId: number) {
    return orm.Follow.where({
      userid: userId,
      companyid: companyId,
    }).delete();
  }

  async createFollow(userId: number, companyId: number) {
    return orm.Follow.create({
      userid: userId,
      companyid: companyId,
      createdat: nowPlainDateTime() as any,
      updatedat: nowPlainDateTime() as any,
    });
  }

  async countByCompanyId(companyId: number): Promise<number> {
    const { count } = await orm.Follow.where({ companyid: companyId }).aggregate(
      (a) => ({ count: a.count() }),
    );
    return count;
  }

  async findByCompanyId(companyId: number, offset: number, limit: number) {
    return orm.Follow.where({ companyid: companyId })
      .orderBy((f: any) => f.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findUsersByIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.User.where((u: any) => u.id.in(userIds)).all();
  }
}
