import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller.js';
import { ReviewService } from './review.service.js';
import { ReviewRepository } from './review.repository.js';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
