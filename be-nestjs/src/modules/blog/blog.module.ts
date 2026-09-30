import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { BlogController } from './blog.controller.js';
import { BlogService } from './blog.service.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
