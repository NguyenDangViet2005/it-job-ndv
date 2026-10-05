import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { BlogController } from './blog.controller.js';
import { BlogService } from './blog.service.js';
import { BlogRepository } from './blog.repository.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService, BlogRepository],
})
export class BlogModule {}
