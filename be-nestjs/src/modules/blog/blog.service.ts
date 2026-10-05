import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { BlogQueryDto } from './dto/blog-query.dto.js';
import { BlogMapper, type BlogResponseData } from './blog.mapper.js';
import { BlogRepository } from './blog.repository.js';

export type { BlogResponseData };

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepo: BlogRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Lấy danh sách bài viết blog có phân trang và lọc theo danh mục
   */
  async getAllBlogs(query: BlogQueryDto) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize =
      query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || '').trim();
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.blogRepo.count(query.categoryid, keyword);
    const rows = await this.blogRepo.findMany(query.categoryid, keyword, offset, pageSize);

    // Tối ưu hóa truy vấn tác giả và danh mục theo lô (tránh N+1)
    const userIds = [...new Set(rows.map((r: any) => r.userid))] as number[];
    const categoryIds = [
      ...new Set(rows.map((r: any) => r.categoryid).filter(Boolean)),
    ] as number[];

    let userMap = new Map<number, any>();
    if (userIds.length > 0) {
      const users = await this.blogRepo.findUsersByIds(userIds);
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    let categoryMap = new Map<number, any>();
    if (categoryIds.length > 0) {
      const categories = await this.blogRepo.findCategoriesByIds(categoryIds);
      categoryMap = new Map(categories.map((c) => [c.id, c]));
    }

    const formatted = rows.map((b: any) =>
      BlogMapper.toBlogResponse(
        b,
        userMap.get(b.userid),
        categoryMap.get(b.categoryid),
      ),
    );

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy chi tiết bài viết blog theo ID
   */
  async getBlogById(id: number): Promise<BlogResponseData> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const user = await this.blogRepo.findUserById(blog.userid);
    const category = blog.categoryid
      ? await this.blogRepo.findCategoryById(blog.categoryid)
      : null;

    return BlogMapper.toBlogResponse(blog, user, category);
  }

  /**
   * Lấy danh sách bài viết blog theo User ID
   */
  async getBlogsByUserId(userId: number, query: BlogQueryDto) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize =
      query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.blogRepo.countByUserId(userId);
    const rows = await this.blogRepo.findManyByUserId(userId, offset, pageSize);

    const categoryIds = [
      ...new Set(rows.map((r: any) => r.categoryid).filter(Boolean)),
    ] as number[];
    let categoryMap = new Map<number, any>();
    if (categoryIds.length > 0) {
      const categories = await this.blogRepo.findCategoriesByIds(categoryIds);
      categoryMap = new Map(categories.map((c) => [c.id, c]));
    }

    const user = await this.blogRepo.findUserById(userId);

    const formatted = rows.map((b: any) =>
      BlogMapper.toBlogResponse(b, user, categoryMap.get(b.categoryid)),
    );

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Tạo bài viết blog mới
   */
  async createBlog(
    userId: number,
    dto: CreateBlogDto,
    file?: Express.Multer.File,
  ): Promise<BlogResponseData> {
    let imageUrl: string | undefined;
    if (file) {
      const uploadRes = await this.cloudinaryService.uploadFile(
        file,
        'IT-JOB/blogs',
      );
      imageUrl = uploadRes.secure_url;
    }

    const blogEntity = BlogMapper.toCreateBlogEntity(dto, userId, imageUrl);
    const newBlog = await this.blogRepo.create(blogEntity);

    return this.getBlogById(newBlog.id);
  }

  /**
   * Cập nhật bài viết blog
   */
  async updateBlog(
    id: number,
    currentUser: { id: number; role: string },
    dto: UpdateBlogDto,
    file?: Express.Multer.File,
  ): Promise<BlogResponseData> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (currentUser.role !== 'admin' && blog.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadRes = await this.cloudinaryService.uploadFile(
        file,
        'IT-JOB/blogs',
      );
      imageUrl = uploadRes.secure_url;

      if (blog.image) {
        await this.cloudinaryService.deleteFile(blog.image).catch(() => {});
      }
    }

    const updatePayload = BlogMapper.toUpdateBlogEntity(dto, imageUrl);
    await this.blogRepo.update(id, updatePayload);

    return this.getBlogById(id);
  }

  /**
   * Xóa bài viết blog
   */
  async deleteBlog(id: number, currentUser: { id: number; role: string }) {
    const blog = await this.blogRepo.findById(id);
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (currentUser.role !== 'admin' && blog.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
    }

    if (blog.image) {
      await this.cloudinaryService.deleteFile(blog.image).catch(() => {});
    }

    await this.blogRepo.delete(id);

    return {
      success: true,
      message: 'Xóa bài viết thành công',
    };
  }
}
