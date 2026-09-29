import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller.js';
import { SkillService } from './skill.service.js';

@Module({
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
