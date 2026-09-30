import { Module } from '@nestjs/common';
import { CloudinaryModule } from '~/modules/cloudinary/cloudinary.module.js';
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
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule { }
