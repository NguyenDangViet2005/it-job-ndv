import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller.js';
import { ApplicationService } from './application.service.js';
import { ApplicationRepository } from './application.repository.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [RedisModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
