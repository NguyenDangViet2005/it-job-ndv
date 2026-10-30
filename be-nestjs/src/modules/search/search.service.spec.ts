import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchService } from './search.service.js';
import type { SearchRepository } from './search.repository.js';

vi.mock('~/prisma/db.js', () => ({}));

describe('SearchService', () => {
  const repo = {
    searchJobs: vi.fn(),
    findSkillsByJobIds: vi.fn(),
    searchCompanies: vi.fn(),
    findWardsWithProvinces: vi.fn(),
    searchSkills: vi.fn(),
  };
  let service: SearchService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new SearchService(repo as unknown as SearchRepository);
    repo.searchJobs.mockResolvedValue([]);
    repo.searchCompanies.mockResolvedValue([]);
    repo.searchSkills.mockResolvedValue([]);
  });

  it('trims the keyword and defaults invalid pagination for all searches', async () => {
    await expect(
      service.search({ keyword: '  Nest  ', page: 0, pageSize: -1 }),
    ).resolves.toEqual({ jobs: [], companies: [], skills: [] });
    for (const method of [
      repo.searchJobs,
      repo.searchCompanies,
      repo.searchSkills,
    ]) {
      expect(method).toHaveBeenCalledWith('Nest', 0, 10);
    }
    expect(repo.findSkillsByJobIds).not.toHaveBeenCalled();
    expect(repo.findWardsWithProvinces).not.toHaveBeenCalled();
  });

  it('calculates the offset for an explicit page', async () => {
    await service.search({ keyword: 'Nest', page: 3, pageSize: 5 });
    expect(repo.searchJobs).toHaveBeenCalledWith('Nest', 10, 5);
  });

  it('joins skills and locations by ID even when returned in a different order', async () => {
    repo.searchJobs.mockResolvedValue([
      { id: 1, title: 'Backend', company: { id: 10, name: 'Acme' } },
      { id: 2, title: 'Frontend' },
    ]);
    repo.findSkillsByJobIds.mockResolvedValue([
      { jobid: 2, skill: { id: 8, name: 'React' } },
      { jobid: 1, skill: { id: 7, name: 'Nest' } },
    ]);
    repo.searchCompanies.mockResolvedValue([
      { id: 10, name: 'Acme', wardid: 20 },
      { id: 11, name: 'Other', wardid: 21 },
    ]);
    repo.findWardsWithProvinces.mockResolvedValue([
      { id: 21, name: 'Ward B', provinces: { name: 'Province B' } },
      { id: 20, name: 'Ward A', provinces: { name: 'Province A' } },
    ]);
    repo.searchSkills.mockResolvedValue([{ id: 7, name: 'Nest' }]);

    const result = await service.search({ keyword: 'IT' });
    expect(result.jobs[0]).toMatchObject({
      skills: [{ id: 7, name: 'Nest' }],
      company: { id: 10 },
    });
    expect(result.jobs[1]).toMatchObject({
      skills: [{ id: 8, name: 'React' }],
      company: null,
    });
    expect(result.companies.map((c) => c.wardname)).toEqual([
      'Ward A',
      'Ward B',
    ]);
    expect(result.skills).toEqual([{ id: 7, name: 'Nest' }]);
  });

  it('handles missing related skills and ward data', async () => {
    repo.searchJobs.mockResolvedValue([{ id: 1, title: 'Backend' }]);
    repo.findSkillsByJobIds.mockResolvedValue([]);
    repo.searchCompanies.mockResolvedValue([
      { id: 10, name: 'Acme', wardid: 20 },
    ]);
    repo.findWardsWithProvinces.mockResolvedValue([]);
    const result = await service.search({ keyword: 'IT' });
    expect(result.jobs[0]).toMatchObject({ skills: [], company: null });
    expect(result.companies[0]).toMatchObject({
      wardname: null,
      provincename: null,
    });
  });
});
