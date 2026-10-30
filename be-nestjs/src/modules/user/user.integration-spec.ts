import bcrypt from 'bcryptjs';
import { ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import {
  useDatabaseFixtures,
  createOfflineCloudinary,
  varchar,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new UserService(
  new UserRepository(),
  createOfflineCloudinary(),
);

describe('User service + repository + PostgreSQL', () => {
  it('updates a profile and denies changes by another user', async () => {
    const { candidate, outsider } = context.fixture;
    await expect(
      service.updateUser(candidate.id, outsider.id, 'user', {
        fullname: 'Intruder',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(await orm.User.where({ id: candidate.id }).first()).toMatchObject({
      fullname: candidate.fullname,
    });
    const result = await service.updateUser(
      candidate.id,
      candidate.id,
      'user',
      { fullname: 'Updated Candidate' },
    );
    expect(result).toMatchObject({ fullname: 'Updated Candidate' });
    expect(result).not.toHaveProperty('password');
    expect(await orm.User.where({ id: candidate.id }).first()).toMatchObject({
      fullname: 'Updated Candidate',
    });
  });

  it('adds a skill idempotently, loads the joined skill and removes it', async () => {
    const { candidate } = context.fixture;
    const skill = await orm.Skill.create({
      name: varchar(`${context.prefix}-TypeScript`, 100),
    });
    await service.addUserSkill(candidate.id, candidate.id, 'user', skill.id);
    await service.addUserSkill(candidate.id, candidate.id, 'user', skill.id);
    expect(await service.getUserSkills(candidate.id)).toMatchObject([
      { id: skill.id, name: skill.name },
    ]);
    expect(
      await orm.SkillUser.where({ userid: candidate.id }).all(),
    ).toHaveLength(1);
    await service.removeUserSkill(candidate.id, candidate.id, 'user', skill.id);
    expect(await service.getUserSkills(candidate.id)).toEqual([]);
  });

  it('changes the real bcrypt password and removes all login sessions', async () => {
    const { candidate } = context.fixture;
    const oldPassword = 'Old-password-123';
    const newPassword = 'New-password-123';
    await orm.User.where({ id: candidate.id }).update({
      password: varchar(await bcrypt.hash(oldPassword, 10), 255),
    });
    await orm.SessionLogins.create({
      userid: candidate.id,
      refreshtoken: `${context.prefix}-refresh`,
      family: context.prefix,
    });
    await service.changePassword(candidate.id, candidate.id, {
      currentPassword: oldPassword,
      newPassword,
    });
    const updated = await orm.User.where({ id: candidate.id }).first();
    expect(await bcrypt.compare(newPassword, updated!.password!)).toBe(true);
    expect(await bcrypt.compare(oldPassword, updated!.password!)).toBe(false);
    expect(
      await orm.SessionLogins.where({ userid: candidate.id }).all(),
    ).toEqual([]);
  });

  it('loads applications with their job and company without mixing users', async () => {
    const { candidate, outsider, job, company } = context.fixture;
    await orm.Application.create({ jobid: job.id, userid: candidate.id });
    const result = await service.getUserApplications(candidate.id);
    expect(result.totalItems).toBe(1);
    expect(result.data[0]).toMatchObject({
      userid: candidate.id,
      job: { id: job.id, company: { id: company.id } },
    });
    expect((await service.getUserApplications(outsider.id)).data).toEqual([]);
  });
});
