import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { BlogQueryDto } from './dto/blog-query.dto.js';
import { BlogMapper, type BlogResponseData } from './blog.mapper.js';

export type { BlogResponseData };

@Injectable()
export class BlogService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Lấy danh sách bài viết blog có phân trang và lọc theo danh mục
   */
  async getAllBlogs(query: BlogQueryDto) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize =
      query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || '').trim();

    let countQuery = orm.Blog;
    let dataQuery = orm.Blog;

    if (query.categoryid) {
      countQuery = countQuery.where({ categoryid: query.categoryid }) as any;
      dataQuery = dataQuery.where({ categoryid: query.categoryid }) as any;
    }

    if (keyword) {
      countQuery = countQuery.where((b: any) =>
        b.title.ilike(`%${keyword}%`),
      ) as any;
      dataQuery = dataQuery.where((b: any) =>
        b.title.ilike(`%${keyword}%`),
      ) as any;
    }

    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));

    const rows = await dataQuery
      .orderBy((b: any) => b.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

    // Tối ưu hóa truy vấn tác giả và danh mục theo lô (tránh N+1)
    const userIds = [...new Set(rows.map((r: any) => r.userid))];
    const categoryIds = [
      ...new Set(rows.map((r: any) => r.categoryid).filter(Boolean)),
    ];

    let userMap = new Map<number, any>();
    if (userIds.length > 0) {
      const users = await orm.User.where((u: any) => u.id.in(userIds)).all();
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    let categoryMap = new Map<number, any>();
    if (categoryIds.length > 0) {
      const categories = await orm.BlogCategory.where((c: any) =>
        c.id.in(categoryIds),
      ).all();
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
    const blog = await orm.Blog.where({ id }).first();
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const user = await orm.User.where({ id: blog.userid }).first();
    const category = blog.categoryid
      ? await orm.BlogCategory.where({ id: blog.categoryid }).first()
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

    const { count } = await orm.Blog.where({ userid: userId }).aggregate(
      (a) => ({ count: a.count() }),
    );

    const rows = await orm.Blog.where({ userid: userId })
      .orderBy((b: any) => b.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

    const categoryIds = [
      ...new Set(rows.map((r: any) => r.categoryid).filter(Boolean)),
    ];
    let categoryMap = new Map<number, any>();
    if (categoryIds.length > 0) {
      const categories = await orm.BlogCategory.where((c: any) =>
        c.id.in(categoryIds),
      ).all();
      categoryMap = new Map(categories.map((c) => [c.id, c]));
    }

    const user = await orm.User.where({ id: userId }).first();

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
    const newBlog = await orm.Blog.create(blogEntity as any);

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
    const blog = await orm.Blog.where({ id }).first();
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
    await orm.Blog.where({ id }).update(updatePayload);

    return this.getBlogById(id);
  }

  /**
   * Xóa bài viết blog
   */
  async deleteBlog(id: number, currentUser: { id: number; role: string }) {
    const blog = await orm.Blog.where({ id }).first();
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (currentUser.role !== 'admin' && blog.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
    }

    if (blog.image) {
      await this.cloudinaryService.deleteFile(blog.image).catch(() => {});
    }

    await orm.Blog.where({ id }).delete();

    return {
      success: true,
      message: 'Xóa bài viết thành công',
    };
  }
}
