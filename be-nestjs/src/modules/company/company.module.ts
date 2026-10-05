import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { CompanyController } from './company.controller.js';
import { CompanyService } from './company.service.js';
import { CompanyRepository } from './company.repository.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
