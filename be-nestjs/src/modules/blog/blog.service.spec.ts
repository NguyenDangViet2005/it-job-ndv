import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service.js';
import type { BlogRepository } from './blog.repository.js';
import type { CloudinaryService } from '../cloudinary/cloudinary.service.js';

vi.mock('~/prisma/db.js', () => ({}));

describe('BlogService', () => {
  const repo = {
    findById: vi.fn(),
    findUserById: vi.fn(),
    findCategoryById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const cloud = { uploadFile: vi.fn(), deleteFile: vi.fn() };
  const blog = {
    id: 5,
    userid: 1,
    title: 'Testing',
    content: 'Hello',
    image: 'old-image',
    categoryid: 7,
  };
  const dto = { title: ' Testing ', content: ' Hello ' };
  const file = {
    buffer: Buffer.from('image'),
    mimetype: 'image/png',
  } as Express.Multer.File;
  let service: BlogService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new BlogService(
      repo as unknown as BlogRepository,
      cloud as unknown as CloudinaryService,
    );
    repo.findById.mockResolvedValue(blog);
    repo.create.mockResolvedValue(blog);
    repo.findUserById.mockResolvedValue({ id: 1, fullname: 'An' });
    repo.findCategoryById.mockResolvedValue({ id: 7, name: 'Engineering' });
    cloud.uploadFile.mockResolvedValue({ secure_url: 'new-image' });
    cloud.deleteFile.mockResolvedValue(true);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates a blog without an image upload', async () => {
    await expect(service.createBlog(1, dto)).resolves.toMatchObject({
      id: 5,
      author: 'An',
      category: 'Engineering',
    });
    expect(cloud.uploadFile).not.toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userid: 1,
        title: 'Testing',
        content: 'Hello',
      }),
    );
    expect(repo.create.mock.calls[0][0]).not.toHaveProperty('image');
  });

  it('persists the URL returned by the upload', async () => {
    await service.createBlog(1, dto, file);
    expect(cloud.uploadFile).toHaveBeenCalledWith(file, 'IT-JOB/blogs');
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ image: 'new-image' }),
    );
  });

  it('does not write if uploading fails', async () => {
    const error = new Error('upload failed');
    cloud.uploadFile.mockRejectedValue(error);
    await expect(service.createBlog(1, dto, file)).rejects.toBe(error);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('cleans up the new image if creating the blog fails, preserving the original error', async () => {
    const error = new Error('insert failed');
    repo.create.mockRejectedValue(error);
    cloud.deleteFile.mockRejectedValue(new Error('cleanup failed'));
    await expect(service.createBlog(1, dto, file)).rejects.toBe(error);
    expect(cloud.deleteFile).toHaveBeenCalledWith('new-image');
  });

  describe.each(['updateBlog', 'deleteBlog'] as const)(
    '%s permissions',
    (method) => {
      const act = (service: BlogService, user: { id: number; role: string }) =>
        method === 'updateBlog'
          ? service.updateBlog(5, user, { title: 'Updated' })
          : service.deleteBlog(5, user);
      const write = method === 'updateBlog' ? repo.update : repo.delete;

      it.each([
        { id: 1, role: 'user' },
        { id: 9, role: 'admin' },
      ])('allows $role with ID $id', async (user) => {
        await act(service, user);
        expect(write).toHaveBeenCalled();
      });

      it('rejects a different author without writing', async () => {
        await expect(
          act(service, { id: 2, role: 'user' }),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(write).not.toHaveBeenCalled();
        expect(cloud.uploadFile).not.toHaveBeenCalled();
        expect(cloud.deleteFile).not.toHaveBeenCalled();
      });

      it('rejects a missing blog', async () => {
        repo.findById.mockResolvedValue(null);
        await expect(
          act(service, { id: 1, role: 'user' }),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(write).not.toHaveBeenCalled();
      });
    },
  );

  it('cleans up only the new image if updating the database fails', async () => {
    const error = new Error('update failed');
    repo.update.mockRejectedValue(error);
    await expect(
      service.updateBlog(5, { id: 1, role: 'user' }, {}, file),
    ).rejects.toBe(error);
    expect(cloud.deleteFile.mock.calls).toEqual([['new-image']]);
  });

  it('saves the new image before deleting the old one', async () => {
    const events: string[] = [];
    cloud.uploadFile.mockImplementation(async () => {
      events.push('upload');
      return { secure_url: 'new-image' };
    });
    repo.update.mockImplementation(async () => {
      events.push('save');
    });
    cloud.deleteFile.mockImplementation(async (url: string) => {
      events.push(url);
      return true;
    });
    await service.updateBlog(5, { id: 1, role: 'user' }, {}, file);
    expect(events).toEqual(['upload', 'save', 'old-image']);
  });

  it('keeps the old image when updating only text', async () => {
    await service.updateBlog(5, { id: 1, role: 'user' }, { title: 'Updated' });
    expect(repo.update.mock.calls[0][1]).not.toHaveProperty('image');
    expect(cloud.deleteFile).not.toHaveBeenCalled();
  });

  it('reports successful deletion even if image cleanup fails', async () => {
    cloud.deleteFile.mockRejectedValue(new Error('cleanup failed'));
    await expect(
      service.deleteBlog(5, { id: 1, role: 'user' }),
    ).resolves.toMatchObject({ success: true });
    expect(repo.delete).toHaveBeenCalledWith(5);
    expect(cloud.deleteFile).toHaveBeenCalledWith('old-image');
  });

  it('does not delete the image if deleting the database record fails', async () => {
    const error = new Error('delete failed');
    repo.delete.mockRejectedValue(error);
    await expect(service.deleteBlog(5, { id: 1, role: 'user' })).rejects.toBe(
      error,
    );
    expect(cloud.deleteFile).not.toHaveBeenCalled();
  });
});
