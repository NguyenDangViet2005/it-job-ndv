import { Injectable, NotFoundException } from '@nestjs/common';
import { FollowMapper, type FollowResponseData } from './follow.mapper.js';
import { FollowRepository } from './follow.repository.js';

export type { FollowResponseData };

@Injectable()
export class FollowService {
  constructor(private readonly followRepo: FollowRepository) {}

  /**
   * Theo dõi hoặc hủy theo dõi công ty
   */
  async toggleFollow(userId: number, companyId: number): Promise<{ followed: boolean }> {
    const company = await this.followRepo.findCompanyById(companyId);
    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existing = await this.followRepo.findFollow(userId, companyId);

    if (existing) {
      await this.followRepo.deleteFollow(userId, companyId);
      return { followed: false };
    }

    await this.followRepo.createFollow(userId, companyId);

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
    const offset = (pNumber - 1) * pSize;

    const count = await this.followRepo.countByCompanyId(companyId);
    const rows = await this.followRepo.findByCompanyId(companyId, offset, pSize);

    // Tối ưu truy vấn người dùng theo lô (tránh N+1)
    const userIds = [...new Set(rows.map((r: any) => r.userid))] as number[];
    let userMap = new Map<number, any>();
    if (userIds.length > 0) {
      const users = await this.followRepo.findUsersByIds(userIds);
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
