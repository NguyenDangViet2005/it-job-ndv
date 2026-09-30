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
  BadRequestException,
} from '@nestjs/common';
import { JobService } from './job.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { JobQueryDto } from './dto/job-query.dto.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { RolesGuard } from '~/common/guards/roles.guard.js';
import { Roles } from '~/common/decorators/roles.decorator.js';
import { CurrentUser } from '~/common/decorators/current-user.decorator.js';
import type { UserPayload } from '~/common/decorators/current-user.decorator.js';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getAll(@Query() query: JobQueryDto) {
    return this.jobService.getAll(query);
  }

  @Get('today')
  async getJobsToday() {
    return this.jobService.getJobsToday();
  }

  @Get('by-skill')
  async getJobsBySkill(@Query() query: JobQueryDto) {
    if (!query.skillid) {
      throw new BadRequestException('Mã kỹ năng (skillid) là bắt buộc');
    }
    return this.jobService.getJobsBySkill(
      query.skillid,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get('by-company')
  async getJobsByCompany(@Query() query: JobQueryDto) {
    if (!query.companyid) {
      throw new BadRequestException('Mã công ty (companyid) là bắt buộc');
    }
    return this.jobService.getJobsByCompanyId(
      query.companyid,
      query.pageNumber,
      query.pageSize,
      true,
    );
  }

  @Get('by-user/:userid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async getJobsByUser(
    @Param('userid', ParseIntPipe) userid: number,
    @CurrentUser() currentUser: UserPayload,
    @Query() query: JobQueryDto,
  ) {
    if (currentUser.role !== 'admin' && currentUser.id !== userid) {
      throw new BadRequestException('Bạn không có quyền xem danh sách việc làm này');
    }

    return this.jobService.getJobsByUserId(
      userid,
      query.pageNumber,
      query.pageSize,
      false,
    );
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async create(
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: CreateJobDto,
  ) {
    return this.jobService.create(currentUser.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.update(id, currentUser, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async deleteJob(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    return this.jobService.deleteJob(id, currentUser);
  }
}
