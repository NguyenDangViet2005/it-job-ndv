import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';


@Module({
  imports: [
    CloudinaryModule,
  ],
  controllers: [
    AppController],
  providers: [AppService],
})
export class AppModule { }
