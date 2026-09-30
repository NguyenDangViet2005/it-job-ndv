import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller.js';
import { BlogCategoryService } from './blog-category.service.js';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
