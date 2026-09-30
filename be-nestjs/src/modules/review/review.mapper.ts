import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

export interface ReviewResponseData {
  id: number;
  userid: number;
  userName: string | null;
  userAvatar: string | null;
  companyid: number;
  companyName: string | null;
  rating: number | null;
  comment: string | null;
  createdat: string | Date | null;
  updatedat: string | Date | null;
}

export class ReviewMapper {
  static toReviewResponse(
    review: any,
    user?: any,
    company?: any,
  ): ReviewResponseData {
    const finalUser = user || review.user || review.User || null;
    const finalCompany = company || review.company || review.Company || null;

    return {
      id: review.id,
      userid: review.userid,
      userName: finalUser ? finalUser.fullname || null : null,
      userAvatar: finalUser ? finalUser.avatar || null : null,
      companyid: review.companyid,
      companyName: finalCompany ? finalCompany.name || null : null,
      rating: review.rating ?? null,
      comment: review.comment || null,
      createdat: review.createdat,
      updatedat: review.updatedat,
    };
  }

  static toCreateReviewEntity(dto: CreateReviewDto, userId: number) {
    return {
      userid: userId,
      companyid: dto.companyid,
      rating: dto.rating,
      comment: dto.comment?.trim() || null,
      createdat: new Date() as any,
      updatedat: new Date() as any,
    };
  }

  static toUpdateReviewEntity(dto: UpdateReviewDto) {
    const data: Record<string, any> = {
      updatedat: new Date() as any,
    };
    if (dto.rating !== undefined) {
      data.rating = dto.rating;
    }
    if (dto.comment !== undefined) {
      data.comment = dto.comment.trim() || null;
    }
    return data;
  }
}
