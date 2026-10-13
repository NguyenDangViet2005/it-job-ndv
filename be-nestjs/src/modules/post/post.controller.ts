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
  BadRequestException,
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
import { BurstLimit } from '~/common/decorators/rate-limit.decorator.js';

const postMediaUploadOptions = {
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const isImage = file.mimetype.startsWith('image/') && !file.mimetype.includes('svg');
    const isVideo = file.mimetype.startsWith('video/');
    if (!isImage && !isVideo) {
      return cb(
        new BadRequestException(
          'Chỉ chấp nhận tệp đính kèm là hình ảnh (jpg, png, webp...) hoặc video (không hỗ trợ SVG)',
        ),
        false,
      );
    }
    cb(null, true);
  },
};

const commentMediaUploadOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const isImage = file.mimetype.startsWith('image/') && !file.mimetype.includes('svg');
    if (!isImage) {
      return cb(
        new BadRequestException(
          'Bình luận chỉ hỗ trợ đính kèm hình ảnh hợp lệ (không hỗ trợ SVG)',
        ),
        false,
      );
    }
    cb(null, true);
  },
};

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
  @UseInterceptors(AnyFilesInterceptor(postMediaUploadOptions))
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.postService.createPost(user.id, dto, files);
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
  @BurstLimit({ capacity: 5, refillRate: 1 }) // Cho phép tối đa 5 like liên tục, sau đó nạp lại 1 like / giây
  async toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.toggleLike(id, user.id);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  @BurstLimit({ capacity: 3, refillRate: 0.5 }) // Tối đa 3 bình luận nhanh, nạp lại 1 token mỗi 2 giây
  @UseInterceptors(AnyFilesInterceptor(commentMediaUploadOptions))
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateCommentDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.postService.addComment(id, user.id, dto, files);
  }

  @Put(':id/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(commentMediaUploadOptions))
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
  @UseInterceptors(AnyFilesInterceptor(postMediaUploadOptions))
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
