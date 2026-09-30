import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';

export interface BlogResponseData {
  id: number;
  userid: number;
  categoryid: number | null;
  title: string;
  excerpt: string | null;
  content: string;
  readtime: number | null;
  image: string | null;
  author: string | null;
  avatar: string | null;
  category: string | null;
  date: string | Date | null;
  createdat: string | Date | null;
  updatedat: string | Date | null;
}

export class BlogMapper {
  static toBlogResponse(blog: any, user?: any, category?: any): BlogResponseData {
    const finalUser = user || blog.user || blog.User || null;
    const finalCategory = category || blog.blogCategory || blog.BlogCategory || null;

    return {
      id: blog.id,
      userid: blog.userid,
      categoryid: blog.categoryid || null,
      title: blog.title,
      excerpt: blog.excerpt || null,
      content: blog.content,
      readtime: blog.readtime || null,
      image: blog.image || null,
      author: finalUser ? finalUser.fullname || null : null,
      avatar: finalUser ? finalUser.avatar || null : null,
      category: finalCategory ? finalCategory.name || null : null,
      date: blog.createdat || null,
      createdat: blog.createdat || null,
      updatedat: blog.updatedat || null,
    };
  }

  static toCreateBlogEntity(dto: CreateBlogDto, userId: number, imageUrl?: string) {
    const entity: Record<string, any> = {
      userid: userId,
      title: dto.title.trim() as any,
      content: dto.content.trim(),
      createdat: new Date() as any,
      updatedat: new Date() as any,
    };
    if (dto.categoryid) {
      entity.categoryid = dto.categoryid;
    }
    if (dto.excerpt) {
      entity.excerpt = dto.excerpt.trim();
    }
    if (dto.readtime) {
      entity.readtime = dto.readtime;
    }
    if (imageUrl) {
      entity.image = imageUrl as any;
    }
    return entity;
  }

  static toUpdateBlogEntity(dto: UpdateBlogDto, imageUrl?: string) {
    const data: Record<string, any> = {
      updatedat: new Date() as any,
    };
    if (dto.title !== undefined) {
      data.title = dto.title.trim() as any;
    }
    if (dto.content !== undefined) {
      data.content = dto.content.trim();
    }
    if (dto.excerpt !== undefined) {
      data.excerpt = dto.excerpt.trim() || null;
    }
    if (dto.categoryid !== undefined) {
      data.categoryid = dto.categoryid;
    }
    if (dto.readtime !== undefined) {
      data.readtime = dto.readtime;
    }
    if (imageUrl !== undefined) {
      data.image = imageUrl as any;
    }
    return data;
  }
}
