import { BadRequestException, ConflictException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { SkillRepository } from './skill.repository.js';
import { SkillService } from './skill.service.js';
import { useDatabaseFixtures } from '../../../test/integration/fixtures.js';
const skills = new SkillService(new SkillRepository());
const context = useDatabaseFixtures();

describe('Skill service + repository + PostgreSQL', () => {
  it('creates, reads, updates and deletes a persisted skill', async () => {
    const skill = await skills.createSkill({
      name: `  ${context.prefix}-TypeScript  `,
    });
    expect(skill.name).toBe(`${context.prefix}-TypeScript`);
    expect(await skills.getSkillById(skill.id)).toMatchObject({
      id: skill.id,
      name: skill.name,
    });
    expect(
      await skills.updateSkill(skill.id, {
        name: `${context.prefix}-JavaScript`,
      }),
    ).toMatchObject({ name: `${context.prefix}-JavaScript` });
    await skills.deleteSkill(skill.id);
    expect(await orm.Skill.where({ id: skill.id }).first()).toBeNull();
  });

  it('rejects a case-insensitive duplicate without inserting a second row', async () => {
    await skills.createSkill({ name: `${context.prefix}-TypeScript` });
    await expect(
      skills.createSkill({
        name: ` ${context.prefix.toUpperCase()}-TYPESCRIPT `,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect((await skills.getAllSkills(1, 10, context.prefix)).totalItems).toBe(
      1,
    );
  });

  it('filters with ILIKE and paginates with a deterministic name order', async () => {
    for (const name of ['Charlie', 'Alpha', 'Bravo'])
      await skills.createSkill({ name: `${context.prefix}-${name}` });
    const result = await skills.getAllSkills(
      2,
      1,
      ` ${context.prefix.toUpperCase()} `,
    );
    expect(result).toMatchObject({
      totalItems: 3,
      totalPages: 3,
      page: 2,
      pageSize: 1,
    });
    expect(result.data.map((s) => s.name)).toEqual([`${context.prefix}-Bravo`]);
  });

  it.each(['candidate', 'job'] as const)(
    'prevents deleting a skill linked to a %s',
    async (target) => {
      const { candidate, job } = context.fixture;
      const skill = await skills.createSkill({
        name: `${context.prefix}-linked`,
      });
      if (target === 'candidate')
        await orm.SkillUser.create({ skillid: skill.id, userid: candidate.id });
      else await orm.SkillJob.create({ skillid: skill.id, jobid: job.id });
      await expect(skills.deleteSkill(skill.id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(await skills.getSkillById(skill.id)).toMatchObject({
        id: skill.id,
      });
    },
  );
});
