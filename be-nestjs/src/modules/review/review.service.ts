import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { ReviewMapper, type ReviewResponseData } from './review.mapper.js';

export type { ReviewResponseData };

@Injectable()
export class ReviewService {
  /**
   * Lấy chi tiết đánh giá theo ID
   */
  async getReviewById(id: number): Promise<ReviewResponseData> {
    const review = await orm.Review.where({ id }).first();
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    const user = await orm.User.where({ id: review.userid }).first();
    const company = await orm.Company.where({ id: review.companyid }).first();

    return ReviewMapper.toReviewResponse(review, user, company);
  }

  /**
   * Lấy danh sách đánh giá của công ty có phân trang
   */
  async getReviewsByCompanyId(
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const { count } = await orm.Review.where({ companyid: companyId }).aggregate(
      (a) => ({ count: a.count() }),
    );

    const rows = await orm.Review.where({ companyid: companyId })
      .orderBy((r: any) => r.createdat.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Tối ưu truy vấn tác giả theo lô (tránh N+1)
    const userIds = [...new Set(rows.map((r: any) => r.userid))];
    let userMap = new Map<number, any>();
    if (userIds.length > 0) {
      const users = await orm.User.where((u: any) => u.id.in(userIds)).all();
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    const company = await orm.Company.where({ id: companyId }).first();

    const formatted = rows.map((r: any) =>
      ReviewMapper.toReviewResponse(r, userMap.get(r.userid), company),
    );

    return {
      reviews: formatted,
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Lấy danh sách đánh giá do người dùng viết
   */
  async getReviewsByUserId(
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const { count } = await orm.Review.where({ userid: userId }).aggregate(
      (a) => ({ count: a.count() }),
    );

    const rows = await orm.Review.where({ userid: userId })
      .orderBy((r: any) => r.createdat.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Tối ưu truy vấn công ty theo lô (tránh N+1)
    const companyIds = [...new Set(rows.map((r: any) => r.companyid))];
    let compMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const comps = await orm.Company.where((c: any) => c.id.in(companyIds)).all();
      compMap = new Map(comps.map((c) => [c.id, c]));
    }

    const user = await orm.User.where({ id: userId }).first();

    const formatted = rows.map((r: any) =>
      ReviewMapper.toReviewResponse(r, user, compMap.get(r.companyid)),
    );

    return {
      reviews: formatted,
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Tạo đánh giá công ty mới
   */
  async createReview(userId: number, dto: CreateReviewDto): Promise<ReviewResponseData> {
    const company = await orm.Company.where({ id: dto.companyid }).first();
    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const reviewEntity = ReviewMapper.toCreateReviewEntity(dto, userId);
    const newReview = await orm.Review.create(reviewEntity);

    return this.getReviewById(newReview.id);
  }

  /**
   * Cập nhật đánh giá
   */
  async updateReview(
    id: number,
    currentUser: { id: number; role: string },
    dto: UpdateReviewDto,
  ): Promise<ReviewResponseData> {
    const review = await orm.Review.where({ id }).first();
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (currentUser.role !== 'admin' && review.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    const updatePayload = ReviewMapper.toUpdateReviewEntity(dto);
    await orm.Review.where({ id }).update(updatePayload);

    return this.getReviewById(id);
  }

  /**
   * Xóa đánh giá
   */
  async deleteReview(id: number, currentUser: { id: number; role: string }) {
    const review = await orm.Review.where({ id }).first();
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (currentUser.role !== 'admin' && review.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    await orm.Review.where({ id }).delete();

    return {
      success: true,
      message: 'Xóa đánh giá thành công',
    };
  }
}
