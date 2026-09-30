import { Injectable, NotFoundException } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { FollowMapper, type FollowResponseData } from './follow.mapper.js';

export type { FollowResponseData };

@Injectable()
export class FollowService {
  /**
   * Theo dõi hoặc hủy theo dõi công ty
   */
  async toggleFollow(userId: number, companyId: number): Promise<{ followed: boolean }> {
    const company = await orm.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existing = await orm.Follow.where({
      userid: userId,
      companyid: companyId,
    }).first();

    if (existing) {
      await orm.Follow.where({
        userid: userId,
        companyid: companyId,
      }).delete();
      return { followed: false };
    }

    await orm.Follow.create({
      userid: userId,
      companyid: companyId,
      createdat: new Date() as any,
      updatedat: new Date() as any,
    });

    return { followed: true };
  }

  /**
   * Lấy danh sách người theo dõi của công ty
   */
  async getFollowsByCompany(
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const { count } = await orm.Follow.where({ companyid: companyId }).aggregate(
      (a) => ({ count: a.count() }),
    );

    const rows = await orm.Follow.where({ companyid: companyId })
      .orderBy((f: any) => f.createdat.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Tối ưu truy vấn người dùng theo lô (tránh N+1)
    const userIds = [...new Set(rows.map((r: any) => r.userid))];
    let userMap = new Map<number, any>();
    if (userIds.length > 0) {
      const users = await orm.User.where((u: any) => u.id.in(userIds)).all();
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    const follows = rows.map((f: any) =>
      FollowMapper.toFollowResponse(f, userMap.get(f.userid)),
    );

    return {
      follows,
      data: follows,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }
}
