import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { CompanyController } from './company.controller.js';
import { CompanyService } from './company.service.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
