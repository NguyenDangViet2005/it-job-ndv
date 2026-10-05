import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class BlogCategoryRepository {
  async findAll() {
    return orm.BlogCategory.orderBy((c: any) => c.id.asc()).all();
  }

  async findById(id: number) {
    return orm.BlogCategory.where({ id }).first();
  }
}
