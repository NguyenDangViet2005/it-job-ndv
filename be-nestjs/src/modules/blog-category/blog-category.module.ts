import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller.js';
import { BlogCategoryService } from './blog-category.service.js';
import { BlogCategoryRepository } from './blog-category.repository.js';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService, BlogCategoryRepository],
  exports: [BlogCategoryService, BlogCategoryRepository],
})
export class BlogCategoryModule {}
