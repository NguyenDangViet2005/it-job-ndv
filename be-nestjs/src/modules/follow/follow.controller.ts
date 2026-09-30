import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  type UserPayload,
} from '~/common/decorators/current-user.decorator.js';
import { FollowService } from './follow.service.js';
import { ToggleFollowDto } from './dto/toggle-follow.dto.js';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async toggleFollow(
    @CurrentUser() user: UserPayload,
    @Body() dto: ToggleFollowDto,
  ) {
    const effectiveUserId = dto.userid || user.id;
    return this.followService.toggleFollow(effectiveUserId, dto.companyid);
  }

  @Get('company/:companyid')
  async getFollowsByCompany(
    @Param('companyid', ParseIntPipe) companyId: number,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.followService.getFollowsByCompany(
      companyId,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }
}
