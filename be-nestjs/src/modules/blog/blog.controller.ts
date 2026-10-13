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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  type UserPayload,
} from '~/common/decorators/current-user.decorator.js';
import { BlogService } from './blog.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { BlogQueryDto } from './dto/blog-query.dto.js';

const blogImageUploadOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const isImage = file.mimetype.startsWith('image/') && !file.mimetype.includes('svg');
    if (!isImage) {
      return cb(
        new BadRequestException('Ảnh đại diện bài viết phải là hình ảnh hợp lệ (không hỗ trợ SVG)'),
        false,
      );
    }
    cb(null, true);
  },
};

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAll(@Query() query: BlogQueryDto) {
    return this.blogService.getAllBlogs(query);
  }

  @Get('user/:userid')
  async getByUserId(
    @Param('userid', ParseIntPipe) userId: number,
    @Query() query: BlogQueryDto,
  ) {
    return this.blogService.getBlogsByUserId(userId, query);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getBlogById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', blogImageUploadOptions))
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.createBlog(user.id, dto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', blogImageUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.updateBlog(
      id,
      { id: user.id, role: user.role },
      dto,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBlog(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.blogService.deleteBlog(id, {
      id: user.id,
      role: user.role,
    });
  }
}
