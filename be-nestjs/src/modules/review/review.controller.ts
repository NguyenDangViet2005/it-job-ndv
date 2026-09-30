import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { ReviewService } from './review.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('company/:companyid')
  async getByCompanyId(
    @Param('companyid', ParseIntPipe) companyId: number,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reviewService.getReviewsByCompanyId(
      companyId,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  @Get('user/:userid')
  async getByUserId(
    @Param('userid', ParseIntPipe) userId: number,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reviewService.getReviewsByUserId(
      userId,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(
      id,
      { id: user.id, role: user.role },
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.reviewService.deleteReview(id, {
      id: user.id,
      role: user.role,
    });
  }
}
