import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationService } from './application.service.js';
import type { ApplicationRepository } from './application.repository.js';
import { isDeadlinePassed } from '~/common/utils/temporal.util.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));
vi.mock('~/common/utils/temporal.util.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/common/utils/temporal.util.js')>()),
  isDeadlinePassed: vi.fn(),
}));

describe('ApplicationService', () => {
  const repo = {
    findJobById: vi.fn(),
    findByJobAndUser: vi.fn(),
    findUserById: vi.fn(),
    create: vi.fn(),
    findJobsWithCompanyByIds: vi.fn(),
    findUsersByIds: vi.fn(),
    findCompanyMember: vi.fn(),
    findCompanyById: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
    findJobsByCompanyId: vi.fn(),
    countByJobIds: vi.fn(),
    findByJobIds: vi.fn(),
    countByUserId: vi.fn(),
    findByUserId: vi.fn(),
  };
  let service: ApplicationService;
  const app = { jobid: 10, userid: 1, cvurl: 'profile.pdf', status: 'pending' };
  const job = {
    id: 10,
    companyid: 20,
    title: 'Backend',
    status: 'open',
    deadline: '2030-01-01',
  };
  const owner = { id: 1, role: 'user' };

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ApplicationService(repo as unknown as ApplicationRepository);
    vi.mocked(isDeadlinePassed).mockReturnValue(false);
    repo.findJobById.mockResolvedValue(job);
    repo.findByJobAndUser.mockResolvedValue(app);
    repo.findUserById.mockResolvedValue({ id: 1, cvurl: 'profile.pdf' });
    repo.findJobsWithCompanyByIds.mockResolvedValue([
      { ...job, company: { name: 'Acme' } },
    ]);
    repo.findUsersByIds.mockResolvedValue([{ id: 1, fullname: 'An' }]);
  });

  describe('create', () => {
    beforeEach(() => {
      // First lookup checks duplicates; the next one loads the saved application.
      repo.findByJobAndUser.mockResolvedValueOnce(null);
    });

    it('rejects an unknown job', async () => {
      repo.findJobById.mockResolvedValue(null);
      await expect(service.create(1, { jobid: 10 })).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('rejects a closed job', async () => {
      repo.findJobById.mockResolvedValue({ ...job, status: 'closed' });
      await expect(service.create(1, { jobid: 10 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('rejects a passed deadline', async () => {
      vi.mocked(isDeadlinePassed).mockReturnValue(true);
      await expect(service.create(1, { jobid: 10 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(isDeadlinePassed).toHaveBeenCalledWith(job.deadline);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('rejects duplicate applications', async () => {
      repo.findByJobAndUser.mockReset().mockResolvedValue(app);
      await expect(service.create(1, { jobid: 10 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('uses the supplied CV without loading the profile CV', async () => {
      const result = await service.create(1, {
        jobid: 10,
        cvurl: 'custom.pdf',
      });
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          jobid: 10,
          userid: 1,
          cvurl: 'custom.pdf',
          status: 'pending',
        }),
      );
      expect(repo.findUserById).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        jobTitle: 'Backend',
        companyName: 'Acme',
        userfullname: 'An',
      });
    });

    it('falls back to the CV saved on the profile', async () => {
      await service.create(1, { jobid: 10 });
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ cvurl: 'profile.pdf' }),
      );
    });

    it('rejects an application with no CV available', async () => {
      repo.findUserById.mockResolvedValue({ id: 1, cvurl: null });
      await expect(service.create(1, { jobid: 10 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  it.each([
    { id: 1, role: 'user' },
    { id: 9, role: 'admin' },
    { id: 2, role: 'employer' },
    { id: 3, role: 'employer' },
  ])('allows authorized reader $id ($role)', async (user) => {
    repo.findCompanyMember.mockResolvedValue(
      user.id === 2 ? { userid: 2 } : null,
    );
    repo.findCompanyById.mockResolvedValue({ createdbyuserid: 3 });
    await expect(service.getById(10, 1, user)).resolves.toMatchObject({
      userid: 1,
    });
  });

  it('prevents an outsider from reading an application', async () => {
    await expect(
      service.getById(10, 1, { id: 99, role: 'user' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.findUsersByIds).not.toHaveBeenCalled();
  });

  it('rejects a missing application', async () => {
    repo.findByJobAndUser.mockResolvedValue(null);
    await expect(service.getById(10, 1, owner)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('prevents reading another candidate application list', async () => {
    await expect(
      service.getByUserId(1, { id: 2, role: 'user' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.findByUserId).not.toHaveBeenCalled();
  });

  it('does not allow candidates to approve their own applications', async () => {
    await expect(
      service.updateStatus(10, 1, owner, { status: 'accepted' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it.each(['admin', 'member', 'creator'])(
    'allows %s to update application status',
    async (permission) => {
      const user = {
        id: 2,
        role: permission === 'admin' ? 'admin' : 'employer',
      };
      repo.findCompanyMember.mockResolvedValue(
        permission === 'member' ? { userid: 2 } : null,
      );
      repo.findCompanyById.mockResolvedValue({
        createdbyuserid: permission === 'creator' ? 2 : 3,
      });
      repo.findByJobAndUser.mockResolvedValue({ ...app, status: 'accepted' });
      await expect(
        service.updateStatus(10, 1, user, { status: 'accepted' }),
      ).resolves.toMatchObject({ status: 'accepted' });
      expect(repo.updateStatus).toHaveBeenCalledWith(
        10,
        1,
        expect.objectContaining({ status: 'accepted' }),
      );
    },
  );

  it('does not update status if the job has disappeared', async () => {
    repo.findJobById.mockResolvedValue(null);
    await expect(
      service.updateStatus(
        10,
        1,
        { id: 9, role: 'admin' },
        { status: 'accepted' },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it.each([owner, { id: 9, role: 'admin' }])(
    'allows $role to delete an application',
    async (user) => {
      await expect(
        service.deleteApplication(10, 1, user),
      ).resolves.toMatchObject({ success: true });
      expect(repo.delete).toHaveBeenCalledWith(10, 1);
    },
  );

  it('prevents an employer from deleting another candidate application', async () => {
    repo.findCompanyMember.mockResolvedValue({ userid: 2 });
    await expect(
      service.deleteApplication(10, 1, { id: 2, role: 'employer' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('returns an empty page for a company with no jobs', async () => {
    repo.findJobsByCompanyId.mockResolvedValue([]);
    await expect(
      service.getByCompanyId(20, { id: 9, role: 'admin' }, 0, -1),
    ).resolves.toMatchObject({
      data: [],
      totalPages: 0,
      pageNumber: 1,
      pageSize: 10,
    });
    expect(repo.findByJobIds).not.toHaveBeenCalled();
  });
});
