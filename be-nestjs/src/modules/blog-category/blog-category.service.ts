import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCategoryRepository } from './blog-category.repository.js';
import {
  BlogCategoryMapper,
  type BlogCategoryResponseData,
} from './blog-category.mapper.js';

export type { BlogCategoryResponseData };

@Injectable()
export class BlogCategoryService {
  constructor(private readonly blogCategoryRepo: BlogCategoryRepository) {}

  /**
   * Lấy danh sách tất cả các danh mục bài viết Blog
   */
  async getAllCategories(): Promise<BlogCategoryResponseData[]> {
    const categories = await this.blogCategoryRepo.findAll();
    return categories.map((c: any) => BlogCategoryMapper.toCategoryResponse(c));
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async getCategoryById(id: number): Promise<BlogCategoryResponseData> {
    const category = await this.blogCategoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục blog');
    }
    return BlogCategoryMapper.toCategoryResponse(category);
  }
}
