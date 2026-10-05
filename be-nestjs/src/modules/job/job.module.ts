import { Module } from '@nestjs/common';
import { JobController } from './job.controller.js';
import { JobService } from './job.service.js';
import { JobRepository } from './job.repository.js';

@Module({
  controllers: [JobController],
  providers: [JobService, JobRepository],
  exports: [JobService, JobRepository],
})
export class JobModule {}
