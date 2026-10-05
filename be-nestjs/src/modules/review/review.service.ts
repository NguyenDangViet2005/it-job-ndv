import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { ReviewMapper, type ReviewResponseData } from './review.mapper.js';
import { ReviewRepository } from './review.repository.js';

export type { ReviewResponseData };

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  /**
   * Lấy chi tiết đánh giá theo ID
   */
  async getReviewById(id: number): Promise<ReviewResponseData> {
    const review = await this.reviewRepo.findById(id);
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    const user = await this.reviewRepo.findUserById(review.userid);
    const company = await this.reviewRepo.findCompanyById(review.companyid);

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
    const offset = (pNumber - 1) * pSize;

    const count = await this.reviewRepo.countByCompanyId(companyId);
    const rows = await this.reviewRepo.findByCompanyId(companyId, offset, pSize);

    // Tối ưu truy vấn tác giả theo lô (tránh N+1)
    const userIds = [...new Set(rows.map((r: any) => r.userid))] as number[];
    let userMap = new Map<number, any>();
    if (userIds.length > 0) {
      const users = await this.reviewRepo.findUsersByIds(userIds);
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    const company = await this.reviewRepo.findCompanyById(companyId);

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
    const offset = (pNumber - 1) * pSize;

    const count = await this.reviewRepo.countByUserId(userId);
    const rows = await this.reviewRepo.findByUserId(userId, offset, pSize);

    // Tối ưu truy vấn công ty theo lô (tránh N+1)
    const companyIds = [...new Set(rows.map((r: any) => r.companyid))] as number[];
    let compMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const comps = await this.reviewRepo.findCompaniesByIds(companyIds);
      compMap = new Map(comps.map((c) => [c.id, c]));
    }

    const user = await this.reviewRepo.findUserById(userId);

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
    const company = await this.reviewRepo.findCompanyById(dto.companyid);
    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const reviewEntity = ReviewMapper.toCreateReviewEntity(dto, userId);
    const newReview = await this.reviewRepo.create(reviewEntity);

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
    const review = await this.reviewRepo.findById(id);
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (currentUser.role !== 'admin' && review.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    const updatePayload = ReviewMapper.toUpdateReviewEntity(dto);
    await this.reviewRepo.update(id, updatePayload);

    return this.getReviewById(id);
  }

  /**
   * Xóa đánh giá
   */
  async deleteReview(id: number, currentUser: { id: number; role: string }) {
    const review = await this.reviewRepo.findById(id);
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (currentUser.role !== 'admin' && review.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    await this.reviewRepo.delete(id);

    return {
      success: true,
      message: 'Xóa đánh giá thành công',
    };
  }
}
