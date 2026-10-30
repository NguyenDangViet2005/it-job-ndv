import { ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { BlogService } from './blog.service.js';
import { BlogRepository } from './blog.repository.js';
import {
  useDatabaseFixtures,
  createOfflineCloudinary,
  expectSqlState,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new BlogService(
  new BlogRepository(),
  createOfflineCloudinary(),
);
const create = () =>
  service.createBlog(context.fixture.candidate.id, {
    title: `${context.prefix}-Article`,
    content: ' Article body ',
    categoryid: context.fixture.category.id,
  });

describe('Blog service + repository + PostgreSQL', () => {
  it('creates, enriches, updates and deletes an article', async () => {
    const { candidate, category } = context.fixture;
    const blog = await create();
    expect(blog).toMatchObject({
      content: 'Article body',
      author: candidate.fullname,
      category: category.name,
    });
    expect(
      await service.updateBlog(
        blog.id,
        { id: candidate.id, role: 'user' },
        { content: 'Updated body' },
      ),
    ).toMatchObject({ content: 'Updated body' });
    expect(await orm.Blog.where({ id: blog.id }).first()).toMatchObject({
      content: 'Updated body',
    });
    await service.deleteBlog(blog.id, { id: candidate.id, role: 'user' });
    expect(await orm.Blog.where({ id: blog.id }).first()).toBeNull();
  });

  it('denies an unrelated author and leaves the article unchanged', async () => {
    const { outsider } = context.fixture;
    const blog = await create();
    await expect(
      service.updateBlog(
        blog.id,
        { id: outsider.id, role: 'user' },
        { title: 'Intruder' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.deleteBlog(blog.id, { id: outsider.id, role: 'user' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(await orm.Blog.where({ id: blog.id }).first()).toMatchObject({
      title: blog.title,
    });
  });

  it('filters by category and keyword and paginates in newest-first order', async () => {
    const { candidate, category } = context.fixture;
    const first = await create();
    const second = await service.createBlog(candidate.id, {
      title: `${context.prefix}-Second`,
      content: 'Body',
      categoryid: category.id,
    });
    const page = await service.getAllBlogs({
      categoryid: category.id,
      keyword: context.prefix.toUpperCase(),
      pageNumber: 1,
      pageSize: 1,
    });
    expect(page.totalItems).toBe(2);
    expect(page.data).toMatchObject([{ id: second.id }]);
    const next = await service.getAllBlogs({
      categoryid: category.id,
      keyword: context.prefix,
      pageNumber: 2,
      pageSize: 1,
    });
    expect(next.data).toMatchObject([{ id: first.id }]);
  });

  it('rejects a missing category through the database foreign key', async () => {
    await expectSqlState(
      service.createBlog(context.fixture.candidate.id, {
        title: `${context.prefix}-invalid`,
        content: 'Body',
        categoryid: -1,
      }),
      '23503',
    );
    expect(
      await orm.Blog.where({ userid: context.fixture.candidate.id }).all(),
    ).toEqual([]);
  });
});
