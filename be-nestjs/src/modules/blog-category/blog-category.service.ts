import { Injectable, NotFoundException } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import {
  BlogCategoryMapper,
  type BlogCategoryResponseData,
} from './blog-category.mapper.js';

export type { BlogCategoryResponseData };

@Injectable()
export class BlogCategoryService {
  /**
   * Lấy danh sách tất cả các danh mục bài viết Blog
   */
  async getAllCategories(): Promise<BlogCategoryResponseData[]> {
    const categories = await orm.BlogCategory.orderBy((c: any) =>
      c.id.asc(),
    ).all();
    return categories.map((c: any) => BlogCategoryMapper.toCategoryResponse(c));
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async getCategoryById(id: number): Promise<BlogCategoryResponseData> {
    const category = await orm.BlogCategory.where({ id }).first();
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục blog');
    }
    return BlogCategoryMapper.toCategoryResponse(category);
  }
}
