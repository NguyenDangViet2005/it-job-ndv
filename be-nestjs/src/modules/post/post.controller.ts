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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  type UserPayload,
} from '~/common/decorators/current-user.decorator.js';
import { PostService } from './post.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PostQueryDto } from './dto/post-query.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query() query: PostQueryDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.getAllPosts(query, user.id);
  }

  @Get('user/:userid')
  @UseGuards(JwtAuthGuard)
  async getByUserId(
    @Param('userid', ParseIntPipe) userId: number,
    @Query() query: PostQueryDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.getPostsByUserId(userId, query, user.id);
  }

  @Get('company/:companyid')
  async getByCompanyId(
    @Param('companyid', ParseIntPipe) companyId: number,
    @Query() query: PostQueryDto,
  ) {
    return this.postService.getPostsByCompanyId(companyId, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const effectiveUserId = dto.userid || user.id;
    return this.postService.createPost(effectiveUserId, dto, files);
  }

  @Get(':id/comments')
  async getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.postService.getComments(
      id,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Body('userid') bodyUserId?: number,
  ) {
    const effectiveUserId = bodyUserId || user.id;
    return this.postService.toggleLike(id, effectiveUserId);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateCommentDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const effectiveUserId = dto.userid || user.id;
    return this.postService.addComment(id, effectiveUserId, dto, files);
  }

  @Put(':id/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateCommentDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.postService.updateComment(
      commentId,
      { id: user.id, role: user.role },
      dto,
      files,
    );
  }

  @Delete(':id/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.deleteComment(commentId, {
      id: user.id,
      role: user.role,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.getPostById(id, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.postService.updatePost(
      id,
      { id: user.id, role: user.role },
      dto,
      files,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.deletePost(id, {
      id: user.id,
      role: user.role,
    });
  }
}
