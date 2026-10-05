import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller.js';
import { ApplicationService } from './application.service.js';
import { ApplicationRepository } from './application.repository.js';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
