import { NotFoundException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { BlogCategoryService } from './blog-category.service.js';
import { BlogCategoryRepository } from './blog-category.repository.js';
import {
  useDatabaseFixtures,
  varchar,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new BlogCategoryService(new BlogCategoryRepository());

describe('Blog category service + repository + PostgreSQL', () => {
  it('loads a persisted category by id and includes it in the ordered list', async () => {
    const { category } = context.fixture;
    const second = await orm.BlogCategory.create({
      name: varchar(`${context.prefix}-second-category`, 100),
    });
    expect(await service.getCategoryById(category.id)).toMatchObject({
      id: category.id,
      name: category.name,
    });
    const own = (await service.getAllCategories()).filter((c) =>
      [category.id, second.id].includes(c.id),
    );
    expect(own.map((c) => c.id)).toEqual([category.id, second.id]);
  });

  it('returns not found for a missing category', async () => {
    await expect(service.getCategoryById(-1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
