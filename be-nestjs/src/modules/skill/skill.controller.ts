import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SkillService } from './skill.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { SkillQueryDto } from './dto/skill-query.dto.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { RolesGuard } from '~/common/guards/roles.guard.js';
import { Roles } from '~/common/decorators/roles.decorator.js';

@Controller('skill')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async getAll(@Query() query: SkillQueryDto) {
    const result = await this.skillService.getAllSkills(
      query.pageNumber,
      query.pageSize,
      query.query,
    );
    return {
      success: true,
      message: 'Lấy danh sách kỹ năng thành công',
      ...result,
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const skill = await this.skillService.getSkillById(id);
    return {
      success: true,
      message: 'Lấy thông tin kỹ năng thành công',
      data: skill,
    };
  }

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateSkillDto) {
    const skill = await this.skillService.createSkill(dto);
    return {
      success: true,
      message: 'Tạo kỹ năng mới thành công',
      data: skill,
    };
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillDto,
  ) {
    const skill = await this.skillService.updateSkill(id, dto);
    return {
      success: true,
      message: 'Cập nhật kỹ năng thành công',
      data: skill,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.skillService.deleteSkill(id);
    return {
      success: true,
      message: 'Xóa kỹ năng thành công',
    };
  }
}
