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
import { ApplicationService } from './application.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ApplicationQueryDto } from './dto/application-query.dto.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { RolesGuard } from '~/common/guards/roles.guard.js';
import { Roles } from '~/common/decorators/roles.decorator.js';
import { CurrentUser } from '~/common/decorators/current-user.decorator.js';
import type { UserPayload } from '~/common/decorators/current-user.decorator.js';

@Controller('application')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @Roles('admin')
  async getAll(@Query() query: ApplicationQueryDto) {
    return this.applicationService.getAll(query);
  }

  @Post()
  @Roles('user')
  async create(
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationService.create(currentUser.id, dto);
  }

  @Get('user/:userid')
  async getByUserId(
    @Param('userid', ParseIntPipe) userid: number,
    @CurrentUser() currentUser: UserPayload,
    @Query() query: ApplicationQueryDto,
  ) {
    return this.applicationService.getByUserId(
      userid,
      currentUser,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get('job/:jobid')
  @Roles('employer', 'admin')
  async getByJobId(
    @Param('jobid', ParseIntPipe) jobid: number,
    @CurrentUser() currentUser: UserPayload,
    @Query() query: ApplicationQueryDto,
  ) {
    return this.applicationService.getByJobId(
      jobid,
      currentUser,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get('company/:companyid')
  @Roles('employer', 'admin')
  async getByCompanyId(
    @Param('companyid', ParseIntPipe) companyid: number,
    @CurrentUser() currentUser: UserPayload,
    @Query() query: ApplicationQueryDto,
  ) {
    return this.applicationService.getByCompanyId(
      companyid,
      currentUser,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get(':jobid/:userid')
  async getById(
    @Param('jobid', ParseIntPipe) jobid: number,
    @Param('userid', ParseIntPipe) userid: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    return this.applicationService.getById(jobid, userid, currentUser);
  }

  @Put(':jobid/:userid')
  @Roles('employer', 'admin')
  async updateStatus(
    @Param('jobid', ParseIntPipe) jobid: number,
    @Param('userid', ParseIntPipe) userid: number,
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(
      jobid,
      userid,
      currentUser,
      dto,
    );
  }

  @Delete(':jobid/:userid')
  async deleteApplication(
    @Param('jobid', ParseIntPipe) jobid: number,
    @Param('userid', ParseIntPipe) userid: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    return this.applicationService.deleteApplication(
      jobid,
      userid,
      currentUser,
    );
  }
}
