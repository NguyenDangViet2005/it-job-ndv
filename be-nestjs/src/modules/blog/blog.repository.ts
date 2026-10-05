import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class BlogRepository {
  async count(categoryId?: number, keyword?: string): Promise<number> {
    let countQuery = orm.Blog;
    if (categoryId) {
      countQuery = countQuery.where({ categoryid: categoryId }) as any;
    }
    if (keyword) {
      countQuery = countQuery.where((b: any) =>
        b.title.ilike(`%${keyword}%`),
      ) as any;
    }
    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findMany(categoryId?: number, keyword?: string, offset: number = 0, limit: number = 10) {
    let dataQuery = orm.Blog;
    if (categoryId) {
      dataQuery = dataQuery.where({ categoryid: categoryId }) as any;
    }
    if (keyword) {
      dataQuery = dataQuery.where((b: any) =>
        b.title.ilike(`%${keyword}%`),
      ) as any;
    }
    return dataQuery
      .orderBy((b: any) => b.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countByUserId(userId: number): Promise<number> {
    const { count } = await orm.Blog.where({ userid: userId }).aggregate(
      (a) => ({ count: a.count() }),
    );
    return count;
  }

  async findManyByUserId(userId: number, offset: number = 0, limit: number = 10) {
    return orm.Blog.where({ userid: userId })
      .orderBy((b: any) => b.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findById(id: number) {
    return orm.Blog.where({ id }).first();
  }

  async findUserById(userId: number) {
    return orm.User.where({ id: userId }).first();
  }

  async findUsersByIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.User.where((u: any) => u.id.in(userIds)).all();
  }

  async findCategoryById(categoryId: number) {
    return orm.BlogCategory.where({ id: categoryId }).first();
  }

  async findCategoriesByIds(categoryIds: number[]) {
    if (categoryIds.length === 0) return [];
    return orm.BlogCategory.where((c: any) => c.id.in(categoryIds)).all();
  }

  async create(data: any) {
    return orm.Blog.create(data as any);
  }

  async update(id: number, data: any) {
    return orm.Blog.where({ id }).update(data);
  }

  async delete(id: number) {
    return orm.Blog.where({ id }).delete();
  }
}
