import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller.js';
import { SkillService } from './skill.service.js';
import { SkillRepository } from './skill.repository.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [RedisModule],
  controllers: [SkillController],
  providers: [SkillService, SkillRepository],
  exports: [SkillService, SkillRepository],
})
export class SkillModule {}
