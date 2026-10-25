import { ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { PostService } from './post.service.js';
import { PostRepository } from './post.repository.js';
import {
  useDatabaseFixtures,
  createOfflineCloudinary,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const media = createOfflineCloudinary();
const repo = new PostRepository();
const service = new PostService(repo, media);
const create = () =>
  service.createPost(context.fixture.candidate.id, {
    content: `${context.prefix}-post`,
  });

beforeEach(() => {
  media.deleteFile.mockClear();
});

describe('Post service + repository + PostgreSQL', () => {
  it('creates and updates a post and rejects an unrelated editor', async () => {
    const { candidate, outsider } = context.fixture;
    const post = await create();
    expect(await orm.Post.where({ id: post.id }).first()).toMatchObject({
      userid: candidate.id,
      content: `${context.prefix}-post`,
    });
    await expect(
      service.updatePost(
        post.id,
        { id: outsider.id, role: 'user' },
        { content: 'Intruder' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await service.updatePost(
      post.id,
      { id: candidate.id, role: 'user' },
      { content: 'Updated post' },
    );
    expect(await orm.Post.where({ id: post.id }).first()).toMatchObject({
      content: 'Updated post',
    });
  });

  it('checks company membership before allowing a company post', async () => {
    const { owner, outsider, company } = context.fixture;
    await expect(
      service.createPost(outsider.id, {
        content: 'Intruder',
        companyid: company.id,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(await orm.Post.where({ companyid: company.id }).all()).toEqual([]);
    const post = await service.createPost(owner.id, {
      content: 'Company update',
      companyid: company.id,
    });
    expect(await orm.Post.where({ id: post.id }).first()).toMatchObject({
      companyid: company.id,
      userid: owner.id,
    });
  });

  it('toggles likes without mixing comments into like counts', async () => {
    const { outsider } = context.fixture;
    const post = await create();
    await service.addComment(post.id, outsider.id, { content: 'A comment' });
    await service.toggleLike(post.id, outsider.id);
    expect(await repo.countLikesByPostId(post.id)).toBe(1);
    expect(await repo.countCommentsByPostId(post.id)).toBe(1);
    await service.toggleLike(post.id, outsider.id);
    expect(await repo.countLikesByPostId(post.id)).toBe(0);
    expect(await repo.countCommentsByPostId(post.id)).toBe(1);
  });

  it('loads comment authors and protects comment updates', async () => {
    const { candidate, outsider } = context.fixture;
    const post = await create();
    const comment = await service.addComment(post.id, outsider.id, {
      content: 'Hello',
    });
    const result = await service.getComments(post.id);
    expect(result.data).toMatchObject([
      { id: comment.id, user: { id: outsider.id }, content: 'Hello' },
    ]);
    await expect(
      service.updateComment(
        comment.id,
        { id: candidate.id, role: 'user' },
        { content: 'Intruder' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await service.updateComment(
      comment.id,
      { id: outsider.id, role: 'user' },
      { content: 'Updated comment' },
    );
    expect(
      await orm.Interaction.where({ id: comment.id }).first(),
    ).toMatchObject({ content: 'Updated comment' });
  });

  it('deletes post interactions and attachments and delegates media cleanup', async () => {
    const { candidate, outsider } = context.fixture;
    const post = await create();
    const comment = await service.addComment(post.id, outsider.id, {
      content: 'Reply',
    });
    const url = `https://example.com/${context.prefix}.png`;
    const attachment = await repo.createAttachment({
      interactionid: comment.id,
      filetype: 'image',
      fileurl: url,
    });
    await service.deletePost(post.id, { id: candidate.id, role: 'user' });
    expect(await orm.Post.where({ id: post.id }).first()).toBeNull();
    expect(await orm.Interaction.where({ postid: post.id }).all()).toEqual([]);
    expect(
      await orm.Attachment.where({ id: attachment.id }).first(),
    ).toBeNull();
    expect(media.deleteFile).toHaveBeenCalledWith(url);
  });
});
