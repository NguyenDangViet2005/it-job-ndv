import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyService } from './company.service.js';
import type { CompanyRepository } from './company.repository.js';
import type { CloudinaryService } from '../cloudinary/cloudinary.service.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));

describe('CompanyService', () => {
  const repo = {
    findById: vi.fn(),
    findSimpleById: vi.fn(),
    findWardById: vi.fn(),
    findMemberByUserId: vi.fn(),
    findByCreatorId: vi.fn(),
    findMember: vi.fn(),
    create: vi.fn(),
    addMember: vi.fn(),
    update: vi.fn(),
    updateAvatar: vi.fn(),
    updateCover: vi.fn(),
    findJobsByCompanyId: vi.fn(),
    findPostsByCompanyId: vi.fn(),
    findAllPostAttachments: vi.fn(),
    deleteJobsAndApplications: vi.fn(),
    deletePostsAndRelations: vi.fn(),
    deleteFollowsReviewsMembersAndCompany: vi.fn(),
  };
  const cloud = { uploadFile: vi.fn(), deleteFile: vi.fn() };
  const company = {
    id: 20,
    name: 'Acme',
    createdbyuserid: 1,
    avatar: 'old-avatar',
    coverimage: 'old-cover',
  };
  const file = { buffer: Buffer.from('image') } as Express.Multer.File;
  let service: CompanyService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new CompanyService(
      repo as unknown as CompanyRepository,
      cloud as unknown as CloudinaryService,
    );
    repo.findById.mockResolvedValue(company);
    repo.findSimpleById.mockResolvedValue(company);
    repo.create.mockResolvedValue(company);
    repo.findJobsByCompanyId.mockResolvedValue([{ id: 10 }]);
    repo.findPostsByCompanyId.mockResolvedValue([{ id: 30 }]);
    repo.findAllPostAttachments.mockResolvedValue([{ fileurl: 'post-image' }]);
    cloud.uploadFile.mockResolvedValue({ secure_url: 'new-image' });
    cloud.deleteFile.mockResolvedValue(true);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates the company and its initial active member', async () => {
    repo.findWardById.mockResolvedValue({ id: 7, name: 'Ward' });
    await expect(
      service.createCompany(1, { name: ' Acme ', wardid: 7 }),
    ).resolves.toMatchObject({ id: 20 });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Acme', createdbyuserid: 1, wardid: 7 }),
    );
    expect(repo.addMember).toHaveBeenCalledWith(20, 1, 'active');
  });

  it('rejects creation with an invalid ward', async () => {
    repo.findWardById.mockResolvedValue(null);
    await expect(
      service.createCompany(1, { name: 'Acme', wardid: 99 }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.addMember).not.toHaveBeenCalled();
  });

  it('loads the member company without falling back to creator lookup', async () => {
    repo.findMemberByUserId.mockResolvedValue({ companyid: 20 });
    await expect(service.getCompanyByUserId(1)).resolves.toMatchObject({
      id: 20,
    });
    expect(repo.findByCreatorId).not.toHaveBeenCalled();
  });

  it('falls back to the company creator', async () => {
    repo.findByCreatorId.mockResolvedValue({ id: 20 });
    await expect(service.getCompanyByUserId(1)).resolves.toMatchObject({
      id: 20,
    });
  });

  it('rejects a user with no linked company', async () => {
    await expect(service.getCompanyByUserId(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it.each(['admin', 'creator', 'member'])(
    'allows %s to edit the company',
    async (permission) => {
      const actor = {
        id: permission === 'creator' ? 1 : 2,
        role: permission === 'admin' ? 'admin' : 'employer',
      };
      repo.findMember.mockResolvedValue(
        permission === 'member' ? { userid: 2 } : null,
      );
      await service.updateCompany(20, actor, { name: ' New Name ' });
      expect(repo.update).toHaveBeenCalledWith(
        20,
        expect.objectContaining({ name: 'New Name' }),
      );
    },
  );

  it('prevents an outsider from editing', async () => {
    await expect(
      service.updateCompany(20, { id: 99, role: 'employer' }, {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('validates a new ward before updating', async () => {
    await expect(
      service.updateCompany(20, { id: 1, role: 'employer' }, { wardid: 99 }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('does not allow an ordinary member to delete the company', async () => {
    repo.findMember.mockResolvedValue({ userid: 2 });
    await expect(
      service.deleteCompany(20, { id: 2, role: 'employer' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.deleteFollowsReviewsMembersAndCompany).not.toHaveBeenCalled();
    expect(cloud.deleteFile).not.toHaveBeenCalled();
  });

  it.each([
    { id: 1, role: 'employer' },
    { id: 9, role: 'admin' },
  ])(
    'allows $role to delete related records then cleans files',
    async (actor) => {
      const events: string[] = [];
      repo.deleteFollowsReviewsMembersAndCompany.mockImplementation(
        async () => {
          events.push('delete-company');
        },
      );
      cloud.deleteFile.mockImplementation(async (url: string) => {
        events.push(url);
        return true;
      });
      await expect(service.deleteCompany(20, actor)).resolves.toMatchObject({
        success: true,
      });
      expect(repo.deleteJobsAndApplications).toHaveBeenCalledWith([10]);
      expect(repo.deletePostsAndRelations).toHaveBeenCalledWith([30]);
      expect(repo.deleteFollowsReviewsMembersAndCompany).toHaveBeenCalledWith(
        20,
      );
      expect(events).toEqual([
        'delete-company',
        'old-avatar',
        'old-cover',
        'post-image',
      ]);
    },
  );

  it('does not delete remote files when database deletion fails', async () => {
    const error = new Error('delete failed');
    repo.deleteFollowsReviewsMembersAndCompany.mockRejectedValue(error);
    await expect(
      service.deleteCompany(20, { id: 1, role: 'employer' }),
    ).rejects.toBe(error);
    expect(cloud.deleteFile).not.toHaveBeenCalled();
  });

  it('continues cleaning remaining files after one cleanup fails', async () => {
    cloud.deleteFile.mockRejectedValueOnce(new Error('cleanup failed'));
    await expect(
      service.deleteCompany(20, { id: 1, role: 'employer' }),
    ).resolves.toMatchObject({ success: true });
    expect(cloud.deleteFile).toHaveBeenCalledTimes(3);
  });

  describe.each([
    ['uploadCompanyAvatar', 'updateAvatar', 'old-avatar'],
    ['uploadCompanyCover', 'updateCover', 'old-cover'],
  ] as const)('%s', (method, write, oldUrl) => {
    it('saves the new image before deleting the old image', async () => {
      const events: string[] = [];
      repo[write].mockImplementation(async () => {
        events.push('save');
      });
      cloud.deleteFile.mockImplementation(async () => {
        events.push('cleanup');
        return true;
      });
      await expect(service[method](20, file)).resolves.toBe('new-image');
      expect(repo[write]).toHaveBeenCalledWith(20, 'new-image');
      expect(cloud.deleteFile).toHaveBeenCalledWith(oldUrl);
      expect(events).toEqual(['save', 'cleanup']);
    });

    it('preserves the old image if saving fails', async () => {
      const error = new Error('save failed');
      repo[write].mockRejectedValue(error);
      await expect(service[method](20, file)).rejects.toBe(error);
      expect(cloud.deleteFile).not.toHaveBeenCalled();
    });

    it('rejects a missing company before uploading', async () => {
      repo.findSimpleById.mockResolvedValue(null);
      await expect(service[method](20, file)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(cloud.uploadFile).not.toHaveBeenCalled();
    });
  });
});
