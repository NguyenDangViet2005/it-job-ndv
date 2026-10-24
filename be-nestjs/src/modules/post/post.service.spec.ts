import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service.js';
import type { PostRepository } from './post.repository.js';
import type { CloudinaryService } from '../cloudinary/cloudinary.service.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));

describe('PostService', () => {
  const repo = {
    findPostById: vi.fn(),
    findCompanyById: vi.fn(),
    findCompanyMember: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    createAttachment: vi.fn(),
    findAttachmentsByPostId: vi.fn(),
    deleteAttachmentById: vi.fn(),
    findInteractionsByPostId: vi.fn(),
    findInteractionById: vi.fn(),
    findInteractionWithDetails: vi.fn(),
    createComment: vi.fn(),
    updateInteraction: vi.fn(),
    deleteInteractionById: vi.fn(),
    findLike: vi.fn(),
    createLike: vi.fn(),
    countLikesByPostId: vi.fn(),
    findUsersByIds: vi.fn(),
    findCompaniesByIds: vi.fn(),
    findAttachmentsByPostIds: vi.fn(),
    findLikesByPostIds: vi.fn(),
    findCommentsByPostIds: vi.fn(),
    findUsersWithCompanyMembersByIds: vi.fn(),
    findAttachmentsByInteractionIds: vi.fn(),
  };
  const cloud = { uploadFile: vi.fn(), deleteFile: vi.fn() };
  const post = { id: 10, userid: 1, content: 'Hello', companyid: null };
  const comment = {
    id: 30,
    userid: 1,
    postid: 10,
    content: 'Hi',
    attachments: [],
  };
  const file = {
    buffer: Buffer.from('image'),
    mimetype: 'image/png',
  } as Express.Multer.File;
  let service: PostService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new PostService(
      repo as unknown as PostRepository,
      cloud as unknown as CloudinaryService,
    );
    repo.findPostById.mockResolvedValue(post);
    repo.createPost.mockResolvedValue(post);
    repo.findInteractionById.mockResolvedValue(comment);
    repo.findInteractionWithDetails.mockResolvedValue(comment);
    repo.createComment.mockResolvedValue(comment);
    repo.findUsersByIds.mockResolvedValue([{ id: 1, fullname: 'An' }]);
    for (const method of [
      repo.findCompaniesByIds,
      repo.findAttachmentsByPostIds,
      repo.findLikesByPostIds,
      repo.findCommentsByPostIds,
      repo.findUsersWithCompanyMembersByIds,
      repo.findAttachmentsByInteractionIds,
      repo.findAttachmentsByPostId,
      repo.findInteractionsByPostId,
    ])
      method.mockResolvedValue([]);
    repo.countLikesByPostId.mockResolvedValue(3);
    cloud.uploadFile.mockResolvedValue({ secure_url: 'new-image' });
    cloud.deleteFile.mockResolvedValue(true);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('rejects posting on behalf of an unknown company', async () => {
    await expect(
      service.createPost(1, { content: 'Hi', companyid: 20 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.createPost).not.toHaveBeenCalled();
  });

  it('rejects posting on behalf of another company before uploading files', async () => {
    repo.findCompanyById.mockResolvedValue({ id: 20, createdbyuserid: 2 });
    await expect(
      service.createPost(1, { content: 'Hi', companyid: 20 }, [file]),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.createPost).not.toHaveBeenCalled();
    expect(cloud.uploadFile).not.toHaveBeenCalled();
  });

  it.each(['member', 'creator'])(
    'allows the company %s to post',
    async (permission) => {
      repo.findCompanyById.mockResolvedValue({
        id: 20,
        createdbyuserid: permission === 'creator' ? 1 : 2,
      });
      repo.findCompanyMember.mockResolvedValue(
        permission === 'member' ? { userid: 1 } : null,
      );
      await service.createPost(1, { content: ' Hi ', companyid: 20 });
      expect(repo.createPost).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'Hi', companyid: 20, userid: 1 }),
      );
    },
  );

  it('classifies uploaded attachments and persists their URLs', async () => {
    cloud.uploadFile
      .mockResolvedValueOnce({ secure_url: 'photo' })
      .mockResolvedValueOnce({ secure_url: 'clip' });
    const video = { ...file, mimetype: 'video/mp4' };
    await service.createPost(1, { content: 'Hi' }, [file, video]);
    expect(cloud.uploadFile.mock.calls).toEqual([
      [file, 'IT-JOB/posts/images'],
      [video, 'IT-JOB/posts/videos'],
    ]);
    expect(repo.createAttachment.mock.calls).toEqual([
      [{ postid: 10, fileurl: 'photo', filetype: 'image' }],
      [{ postid: 10, fileurl: 'clip', filetype: 'video' }],
    ]);
  });

  it('cleans previously uploaded files if a later upload fails', async () => {
    const error = new Error('second upload failed');
    cloud.uploadFile
      .mockResolvedValueOnce({ secure_url: 'first-image' })
      .mockRejectedValueOnce(error);
    await expect(
      service.createPost(1, { content: 'Hi' }, [file, file]),
    ).rejects.toBe(error);
    expect(cloud.deleteFile).toHaveBeenCalledWith('first-image');
    expect(repo.createPost).not.toHaveBeenCalled();
  });

  it('cleans uploaded files if attachment persistence fails', async () => {
    const error = new Error('attachment insert failed');
    repo.createAttachment.mockRejectedValue(error);
    cloud.deleteFile.mockRejectedValue(new Error('cleanup failed'));
    await expect(service.createPost(1, { content: 'Hi' }, [file])).rejects.toBe(
      error,
    );
    expect(cloud.deleteFile).toHaveBeenCalledWith('new-image');
  });

  describe.each(['updatePost', 'deletePost'] as const)(
    '%s permissions',
    (method) => {
      const act = (
        service: PostService,
        actor: { id: number; role: string },
      ) =>
        method === 'updatePost'
          ? service.updatePost(10, actor, { content: 'Updated' })
          : service.deletePost(10, actor);
      const write = method === 'updatePost' ? repo.updatePost : repo.deletePost;

      it.each(['author', 'admin', 'member', 'creator'])(
        'allows the %s',
        async (permission) => {
          repo.findPostById.mockResolvedValue({ ...post, companyid: 20 });
          repo.findCompanyMember.mockResolvedValue(
            permission === 'member' ? { userid: 2 } : null,
          );
          repo.findCompanyById.mockResolvedValue({
            createdbyuserid: permission === 'creator' ? 2 : 3,
          });
          await act(service, {
            id: permission === 'author' ? 1 : 2,
            role: permission === 'admin' ? 'admin' : 'user',
          });
          expect(write).toHaveBeenCalled();
        },
      );

      it('rejects an outsider', async () => {
        await expect(
          act(service, { id: 2, role: 'user' }),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(write).not.toHaveBeenCalled();
        expect(cloud.deleteFile).not.toHaveBeenCalled();
      });

      it('rejects a missing post', async () => {
        repo.findPostById.mockResolvedValue(null);
        await expect(
          act(service, { id: 1, role: 'user' }),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(write).not.toHaveBeenCalled();
      });
    },
  );

  it('keeps selected attachments and deletes only removed attachments', async () => {
    repo.findAttachmentsByPostId.mockResolvedValue([
      { id: 40, fileurl: 'keep-image' },
      { id: 41, fileurl: 'remove-image' },
    ]);
    await service.updatePost(
      10,
      { id: 1, role: 'user' },
      { keepImageUrls: ['keep-image'] },
      [file],
    );
    expect(repo.deleteAttachmentById.mock.calls).toEqual([[41]]);
    expect(cloud.deleteFile.mock.calls).toEqual([['remove-image']]);
    expect(repo.createAttachment).toHaveBeenCalledWith({
      postid: 10,
      fileurl: 'new-image',
      filetype: 'image',
    });
  });

  it('deletes the post before cleaning both post and comment files', async () => {
    const events: string[] = [];
    repo.findAttachmentsByPostId.mockResolvedValue([{ fileurl: 'post-image' }]);
    repo.findInteractionsByPostId.mockResolvedValue([{ id: 30 }]);
    repo.findAttachmentsByInteractionIds.mockResolvedValue([
      { fileurl: 'comment-image' },
    ]);
    repo.deletePost.mockImplementation(async () => {
      events.push('delete-post');
    });
    cloud.deleteFile.mockImplementation(async (url: string) => {
      events.push(url);
      return true;
    });
    await service.deletePost(10, { id: 1, role: 'user' });
    expect(repo.findAttachmentsByInteractionIds).toHaveBeenCalledWith([30]);
    expect(events).toEqual(['delete-post', 'post-image', 'comment-image']);
  });

  describe('toggleLike', () => {
    it('creates a like and returns the updated count', async () => {
      await expect(service.toggleLike(10, 1)).resolves.toEqual({
        postid: 10,
        userid: 1,
        isliked: true,
        totalLikes: 3,
      });
      expect(repo.createLike).toHaveBeenCalledWith(10, 1);
      expect(repo.deleteInteractionById).not.toHaveBeenCalled();
    });

    it('removes an existing like', async () => {
      repo.findLike.mockResolvedValue({ id: 50 });
      await expect(service.toggleLike(10, 1)).resolves.toMatchObject({
        isliked: false,
      });
      expect(repo.deleteInteractionById).toHaveBeenCalledWith(50);
      expect(repo.createLike).not.toHaveBeenCalled();
    });

    it('rejects a missing post', async () => {
      repo.findPostById.mockResolvedValue(null);
      await expect(service.toggleLike(10, 1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.createLike).not.toHaveBeenCalled();
    });
  });

  it('creates a comment with attachment metadata', async () => {
    await expect(
      service.addComment(10, 1, { content: ' Hi ' }, [file]),
    ).resolves.toMatchObject({ id: 30 });
    expect(repo.createComment).toHaveBeenCalledWith(
      expect.objectContaining({ postid: 10, userid: 1, content: 'Hi' }),
    );
    expect(repo.createAttachment).toHaveBeenCalledWith({
      interactionid: 30,
      fileurl: 'new-image',
      filetype: 'image',
    });
  });

  it('rejects commenting on a missing post', async () => {
    repo.findPostById.mockResolvedValue(null);
    await expect(
      service.addComment(10, 1, { content: 'Hi' }, [file]),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(cloud.uploadFile).not.toHaveBeenCalled();
    expect(repo.createComment).not.toHaveBeenCalled();
  });

  describe.each(['updateComment', 'deleteComment'] as const)(
    '%s permissions',
    (method) => {
      const act = (
        service: PostService,
        actor: { id: number; role: string },
      ) =>
        method === 'updateComment'
          ? service.updateComment(30, actor, { content: 'Updated' })
          : service.deleteComment(30, actor);
      const write =
        method === 'updateComment'
          ? repo.updateInteraction
          : repo.deleteInteractionById;

      it.each([
        { id: 1, role: 'user' },
        { id: 9, role: 'admin' },
      ])('allows $role with ID $id', async (actor) => {
        await act(service, actor);
        expect(write).toHaveBeenCalled();
      });

      it('rejects another user', async () => {
        await expect(
          act(service, { id: 2, role: 'user' }),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(write).not.toHaveBeenCalled();
      });

      it('rejects a missing comment', async () => {
        repo.findInteractionById.mockResolvedValue(null);
        await expect(
          act(service, { id: 1, role: 'user' }),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(write).not.toHaveBeenCalled();
      });
    },
  );

  it('cleans comment uploads if updating the comment fails', async () => {
    const error = new Error('update failed');
    repo.updateInteraction.mockRejectedValue(error);
    await expect(
      service.updateComment(
        30,
        { id: 1, role: 'user' },
        { content: 'Updated' },
        [file],
      ),
    ).rejects.toBe(error);
    expect(cloud.deleteFile).toHaveBeenCalledWith('new-image');
  });

  it('counts all interactions but returns at most three recent comments', async () => {
    repo.findLikesByPostIds.mockResolvedValue([
      { postid: 10, userid: 1 },
      { postid: 10, userid: 2 },
    ]);
    repo.findCommentsByPostIds.mockResolvedValue(
      [1, 2, 3, 4].map((id) => ({
        id,
        postid: 10,
        userid: 2,
        content: `Comment ${id}`,
      })),
    );
    repo.findUsersWithCompanyMembersByIds.mockResolvedValue([
      { id: 2, fullname: 'Binh' },
    ]);
    repo.findAttachmentsByInteractionIds.mockResolvedValue([
      { id: 40, interactionid: 2, fileurl: 'comment-image', filetype: 'image' },
    ]);

    const result = await service.getPostById(10, 1);
    expect(result.interaction).toMatchObject({
      totalLikes: 2,
      totalComments: 4,
      islikedByCurrentUser: true,
    });
    expect(result.interaction.comments.map((c) => c.id)).toEqual([1, 2, 3]);
    expect(result.interaction.comments[1]).toMatchObject({
      user: { fullname: 'Binh' },
      attachments: [{ fileurl: 'comment-image' }],
    });
    expect(repo.findUsersWithCompanyMembersByIds).toHaveBeenCalledWith([2]);
  });
});
