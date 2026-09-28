import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
import { AuthModule } from '~/modules/auth/auth.module.js';
import { UserModule } from '~/modules/user/user.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
