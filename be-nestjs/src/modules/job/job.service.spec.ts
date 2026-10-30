import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JobService } from './job.service.js';
import type { JobRepository } from './job.repository.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));

describe('JobService', () => {
  const repo = {
    findById: vi.fn(),
    findCompanyMemberByUserId: vi.fn(),
    findCompanyByCreatorId: vi.fn(),
    findCompanyMember: vi.fn(),
    findCompanyById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addSkillJob: vi.fn(),
    deleteSkillJobsByJobId: vi.fn(),
    findSkillJobsByJobIds: vi.fn(),
    findApplicationsByJobIds: vi.fn(),
    findCompaniesByIds: vi.fn(),
    countOpenJobs: vi.fn(),
    findOpenJobs: vi.fn(),
  };
  let service: JobService;
  const job = { id: 10, companyid: 20, title: 'Backend', isnegotiable: true };
  const dto = {
    title: ' Backend ',
    deadline: '2030-01-01',
    isnegotiable: true,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    service = new JobService(repo as unknown as JobRepository);
    repo.findById.mockResolvedValue(job);
    repo.create.mockResolvedValue(job);
    repo.findSkillJobsByJobIds.mockResolvedValue([]);
    repo.findApplicationsByJobIds.mockResolvedValue([]);
    repo.findCompaniesByIds.mockResolvedValue([{ id: 20, name: 'Acme' }]);
  });

  it('creates a job for the member company and persists selected skills', async () => {
    repo.findCompanyMemberByUserId.mockResolvedValue({ companyid: 20 });
    await expect(
      service.create(1, { ...dto, skillids: [7, 8] }),
    ).resolves.toMatchObject({ id: 10, company: { id: 20 } });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ companyid: 20, title: 'Backend' }),
    );
    expect(repo.addSkillJob.mock.calls).toEqual([
      [10, 7],
      [10, 8],
    ]);
    expect(repo.findCompanyByCreatorId).not.toHaveBeenCalled();
  });

  it('falls back to a company created by the user', async () => {
    repo.findCompanyByCreatorId.mockResolvedValue({ id: 20 });
    await service.create(1, dto);
    expect(repo.findCompanyByCreatorId).toHaveBeenCalledWith(1);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ companyid: 20 }),
    );
    expect(repo.addSkillJob).not.toHaveBeenCalled();
  });

  it('rejects creation when the user has no company', async () => {
    await expect(service.create(1, dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('stops skill writes if creating the job fails', async () => {
    repo.findCompanyMemberByUserId.mockResolvedValue({ companyid: 20 });
    const error = new Error('insert failed');
    repo.create.mockRejectedValue(error);
    await expect(service.create(1, { ...dto, skillids: [7] })).rejects.toBe(
      error,
    );
    expect(repo.addSkillJob).not.toHaveBeenCalled();
  });

  describe.each(['update', 'deleteJob'] as const)(
    '%s permissions',
    (method) => {
      const act = (service: JobService, user: { id: number; role: string }) =>
        method === 'update'
          ? service.update(10, user, { title: 'Updated' })
          : service.deleteJob(10, user);
      const write = method === 'update' ? repo.update : repo.delete;

      it.each(['admin', 'member', 'creator'])(
        'allows %s',
        async (permission) => {
          repo.findCompanyMember.mockResolvedValue(
            permission === 'member' ? { userid: 1 } : null,
          );
          repo.findCompanyById.mockResolvedValue({
            createdbyuserid: permission === 'creator' ? 1 : 2,
          });
          await act(service, {
            id: 1,
            role: permission === 'admin' ? 'admin' : 'employer',
          });
          expect(write).toHaveBeenCalled();
        },
      );

      it('rejects an outsider without writing', async () => {
        await expect(
          act(service, { id: 99, role: 'employer' }),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(write).not.toHaveBeenCalled();
      });

      it('rejects a missing job', async () => {
        repo.findById.mockResolvedValue(null);
        await expect(
          act(service, { id: 1, role: 'admin' }),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(write).not.toHaveBeenCalled();
      });
    },
  );

  it('preserves existing skills when skillids is omitted', async () => {
    await service.update(10, { id: 1, role: 'admin' }, { title: 'Updated' });
    expect(repo.deleteSkillJobsByJobId).not.toHaveBeenCalled();
    expect(repo.addSkillJob).not.toHaveBeenCalled();
  });

  it('clears all skills when skillids is an empty array', async () => {
    await service.update(10, { id: 1, role: 'admin' }, { skillids: [] });
    expect(repo.deleteSkillJobsByJobId).toHaveBeenCalledWith(10);
    expect(repo.addSkillJob).not.toHaveBeenCalled();
  });

  it('replaces skills when new IDs are supplied', async () => {
    await service.update(10, { id: 1, role: 'admin' }, { skillids: [8, 9] });
    expect(repo.deleteSkillJobsByJobId).toHaveBeenCalledWith(10);
    expect(repo.addSkillJob.mock.calls).toEqual([
      [10, 8],
      [10, 9],
    ]);
  });

  it('groups skills and application counts by job ID', async () => {
    repo.countOpenJobs.mockResolvedValue(2);
    repo.findOpenJobs.mockResolvedValue([job, { ...job, id: 11 }]);
    repo.findSkillJobsByJobIds.mockResolvedValue([
      { jobid: 11, skill: { id: 8, name: 'React' } },
      { jobid: 10, skill: { id: 7, name: 'Nest' } },
    ]);
    repo.findApplicationsByJobIds.mockResolvedValue([
      { jobid: 10 },
      { jobid: 10 },
    ]);
    const result = await service.getAll({
      keyword: ' Nest ',
      pageNumber: 0,
      pageSize: -1,
    });
    expect(repo.findOpenJobs).toHaveBeenCalledWith('Nest', 0, 10);
    expect(result.data[0]).toMatchObject({
      skills: [{ id: 7 }],
      applicationCount: 2,
    });
    expect(result.data[1]).toMatchObject({
      skills: [{ id: 8 }],
      applicationCount: 0,
    });
    expect(repo.findCompaniesByIds).toHaveBeenCalledWith([20]);
  });

  it('returns an empty page without enrichment queries', async () => {
    repo.countOpenJobs.mockResolvedValue(0);
    repo.findOpenJobs.mockResolvedValue([]);
    await expect(service.getAll({})).resolves.toMatchObject({
      data: [],
      totalPages: 0,
    });
    expect(repo.findSkillJobsByJobIds).not.toHaveBeenCalled();
  });
});
