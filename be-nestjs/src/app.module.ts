import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Core & Infrastructure Modules
import { PrismaModule } from '~/prisma/prisma.module.js';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';

// Feature Modules
import { AuthModule } from '~/modules/auth/auth.module.js';
import { UserModule } from '~/modules/user/user.module.js';
import { LocationModule } from '~/modules/location/location.module.js';
import { SkillModule } from '~/modules/skill/skill.module.js';
import { CompanyModule } from '~/modules/company/company.module.js';
import { JobModule } from '~/modules/job/job.module.js';
import { ApplicationModule } from '~/modules/application/application.module.js';
import { PostModule } from '~/modules/post/post.module.js';
import { FollowModule } from '~/modules/follow/follow.module.js';
import { ReviewModule } from '~/modules/review/review.module.js';
import { ConnectionModule } from '~/modules/connection/connection.module.js';
import { BlogCategoryModule } from '~/modules/blog-category/blog-category.module.js';
import { BlogModule } from '~/modules/blog/blog.module.js';
import { SearchModule } from '~/modules/search/search.module.js';

// Common Pipeline: Middlewares & Interceptors
import { RequestIdMiddleware, RequestLoggerMiddleware } from '~/common/middlewares/index.js';
import { SecurityInterceptor, TransformInterceptor } from '~/common/interceptors/index.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    UserModule,
    LocationModule,
    SkillModule,
    CompanyModule,
    JobModule,
    ApplicationModule,
    PostModule,
    FollowModule,
    ReviewModule,
    ConnectionModule,
    BlogCategoryModule,
    BlogModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Step 2 in Pipeline: Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Step 3 in Pipeline: Pre-controller Interceptor (Security / Check)
    {
      provide: APP_INTERCEPTOR,
      useClass: SecurityInterceptor,
    },
    // Step 6 in Pipeline: Post-controller Interceptor (Response standardizer)
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  // Step 1 in Pipeline: Middlewares
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
