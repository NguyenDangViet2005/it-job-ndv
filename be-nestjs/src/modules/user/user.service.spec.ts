import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from './user.service.js';
import type { UserRepository } from './user.repository.js';
import type { CloudinaryService } from '../cloudinary/cloudinary.service.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));
vi.mock('bcryptjs', () => ({ default: { compare: vi.fn(), hash: vi.fn() } }));

describe('UserService', () => {
  const repo = {
    findById: vi.fn(),
    update: vi.fn(),
    deleteSessionsByUserId: vi.fn(),
    delete: vi.fn(),
    findSkillById: vi.fn(),
    findSkillUser: vi.fn(),
    addSkillUser: vi.fn(),
    removeSkillUser: vi.fn(),
    countAll: vi.fn(),
    findAll: vi.fn(),
  };
  const cloud = { uploadFile: vi.fn(), deleteFile: vi.fn() };
  const user = {
    id: 1,
    fullname: 'An',
    password: 'old-hash',
    providerid: 'private-provider-id',
    refreshtoken: 'private-token',
    avatar: 'old-avatar',
    coverimage: 'old-cover',
    cvurl: 'old-cv',
  };
  const file = {
    buffer: Buffer.from('file'),
    mimetype: 'image/png',
  } as Express.Multer.File;
  let service: UserService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new UserService(
      repo as unknown as UserRepository,
      cloud as unknown as CloudinaryService,
    );
    repo.findById.mockResolvedValue(user);
    repo.update.mockImplementation(async (_id: number, data: object) => ({
      ...user,
      ...data,
    }));
    cloud.uploadFile.mockResolvedValue({ secure_url: 'new-file' });
    cloud.deleteFile.mockResolvedValue(true);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it.each([
    { id: 1, role: 'user' },
    { id: 9, role: 'admin' },
  ])('allows $role to update a profile and strips secrets', async (actor) => {
    const result = await service.updateUser(1, actor.id, actor.role, {
      fullname: ' New Name ',
    });
    expect(repo.update).toHaveBeenCalledWith(1, { fullname: 'New Name' });
    expect(result).toMatchObject({ id: 1, fullname: 'New Name' });
    for (const field of ['password', 'refreshtoken', 'providerid'])
      expect(result).not.toHaveProperty(field);
  });

  it('rejects editing another user before reading or writing data', async () => {
    await expect(service.updateUser(1, 2, 'user', {})).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(repo.findById).not.toHaveBeenCalled();
    expect(repo.update).not.toHaveBeenCalled();
  });

  describe('changePassword', () => {
    const dto = {
      currentPassword: 'old-password',
      newPassword: 'new-password',
    };

    it('prevents changing another user password', async () => {
      await expect(service.changePassword(1, 2, dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it.each([null, { ...user, password: null }])(
      'rejects a missing user or an OAuth-only account',
      async (account) => {
        repo.findById.mockResolvedValue(account);
        await expect(service.changePassword(1, 1, dto)).rejects.toBeInstanceOf(
          NotFoundException,
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
      },
    );

    it('rejects an incorrect current password without revoking sessions', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(service.changePassword(1, 1, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.update).not.toHaveBeenCalled();
      expect(repo.deleteSessionsByUserId).not.toHaveBeenCalled();
    });

    it('hashes the new password and revokes all existing sessions', async () => {
      await expect(service.changePassword(1, 1, dto)).resolves.toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('old-password', 'old-hash');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(repo.update).toHaveBeenCalledWith(1, { password: 'new-hash' });
      expect(repo.deleteSessionsByUserId).toHaveBeenCalledWith(1);
    });

    it('propagates a failure to revoke sessions', async () => {
      const error = new Error('revoke failed');
      repo.deleteSessionsByUserId.mockRejectedValue(error);
      await expect(service.changePassword(1, 1, dto)).rejects.toBe(error);
    });
  });

  describe.each([
    ['updateAvatar', 'avatar', 'IT-JOB/avatars'],
    ['updateCoverImage', 'coverimage', 'IT-JOB/covers'],
    ['updateCV', 'cvurl', 'IT-JOB/cvs'],
  ] as const)('%s', (method, field, folder) => {
    it('uploads, saves the new URL, then removes the old file', async () => {
      const events: string[] = [];
      cloud.uploadFile.mockImplementation(async () => {
        events.push('upload');
        return { secure_url: 'new-file' };
      });
      repo.update.mockImplementation(async (_id: number, data: object) => {
        events.push('save');
        return { ...user, ...data };
      });
      cloud.deleteFile.mockImplementation(async () => {
        events.push('cleanup');
        return true;
      });

      const result = await service[method](1, 1, 'user', file);
      expect(result).toHaveProperty(field, 'new-file');
      expect(cloud.uploadFile).toHaveBeenCalledWith(file, folder);
      expect(cloud.deleteFile).toHaveBeenCalledWith(user[field]);
      expect(events).toEqual(['upload', 'save', 'cleanup']);
    });

    it('rejects an unauthorized upload before calling Cloudinary', async () => {
      await expect(service[method](1, 2, 'user', file)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(cloud.uploadFile).not.toHaveBeenCalled();
    });

    it('rejects uploading for a missing user', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service[method](1, 1, 'user', file)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(cloud.uploadFile).not.toHaveBeenCalled();
    });

    it('preserves the old file if saving the new URL fails', async () => {
      const error = new Error('save failed');
      repo.update.mockRejectedValue(error);
      await expect(service[method](1, 1, 'user', file)).rejects.toBe(error);
      expect(cloud.deleteFile).not.toHaveBeenCalledWith(user[field]);
    });

    it('does not update the profile if uploading fails', async () => {
      const error = new Error('upload failed');
      cloud.uploadFile.mockRejectedValue(error);
      await expect(service[method](1, 1, 'user', file)).rejects.toBe(error);
      expect(repo.update).not.toHaveBeenCalled();
      expect(cloud.deleteFile).not.toHaveBeenCalled();
    });

    it('still succeeds if deleting the old file fails', async () => {
      cloud.deleteFile.mockRejectedValue(new Error('cleanup failed'));
      await expect(service[method](1, 1, 'user', file)).resolves.toHaveProperty(
        field,
        'new-file',
      );
    });
  });

  it('does not insert a duplicate user skill', async () => {
    repo.findSkillById.mockResolvedValue({ id: 7, name: 'Nest' });
    repo.findSkillUser.mockResolvedValue({ userid: 1, skillid: 7 });
    await expect(service.addUserSkill(1, 1, 'user', 7)).resolves.toEqual({
      id: 7,
      name: 'Nest',
    });
    expect(repo.addSkillUser).not.toHaveBeenCalled();
  });

  it('inserts a new user skill', async () => {
    repo.findSkillById.mockResolvedValue({ id: 7, name: 'Nest' });
    await service.addUserSkill(1, 1, 'user', 7);
    expect(repo.addSkillUser).toHaveBeenCalledWith(1, 7);
  });

  it('rejects adding an unknown skill', async () => {
    repo.findSkillById.mockResolvedValue(null);
    await expect(service.addUserSkill(1, 1, 'user', 99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.addSkillUser).not.toHaveBeenCalled();
  });

  it('rejects removing another user skill', async () => {
    await expect(
      service.removeUserSkill(1, 2, 'user', 7),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.removeSkillUser).not.toHaveBeenCalled();
  });

  it('restricts user deletion to admins', async () => {
    await expect(service.deleteUser(1, 'user')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('deletes the user before cleaning up all files and tolerates cleanup failure', async () => {
    const events: string[] = [];
    repo.delete.mockImplementation(async () => {
      events.push('delete-user');
    });
    cloud.deleteFile.mockImplementation(async (url: string) => {
      events.push(url);
      if (url === 'old-avatar') throw new Error('cleanup failed');
      return true;
    });
    await expect(service.deleteUser(1, 'admin')).resolves.toBe(true);
    expect(events).toEqual([
      'delete-user',
      'old-avatar',
      'old-cover',
      'old-cv',
    ]);
  });
});
