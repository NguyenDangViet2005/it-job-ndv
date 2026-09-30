import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service.js';

@Controller('blogcategory')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Get()
  async getAll() {
    return this.blogCategoryService.getAllCategories();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogCategoryService.getCategoryById(id);
  }
}
