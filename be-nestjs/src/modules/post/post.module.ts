import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { PostRepository } from './post.repository.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
