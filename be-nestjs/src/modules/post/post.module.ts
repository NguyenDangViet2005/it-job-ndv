import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
