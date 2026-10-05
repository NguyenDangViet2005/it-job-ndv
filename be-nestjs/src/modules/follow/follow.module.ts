import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller.js';
import { FollowService } from './follow.service.js';
import { FollowRepository } from './follow.repository.js';

@Module({
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
