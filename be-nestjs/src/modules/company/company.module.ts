import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { CompanyController } from './company.controller.js';
import { CompanyService } from './company.service.js';
import { CompanyRepository } from './company.repository.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [CloudinaryModule, RedisModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
