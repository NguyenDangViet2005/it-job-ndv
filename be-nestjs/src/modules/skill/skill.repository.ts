import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';

@Injectable()
export class SkillRepository {
  async countByKeyword(keyword?: string): Promise<number> {
    const trimmed = keyword?.trim();
    let countQuery = orm.Skill;
    if (trimmed) {
      countQuery = countQuery.where((s: any) => s.name.ilike(`%${trimmed}%`)) as any;
    }
    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findByKeyword(page: number = 1, pageSize: number = 20, keyword?: string) {
    const trimmed = keyword?.trim();
    let dataQuery = orm.Skill;
    if (trimmed) {
      dataQuery = dataQuery.where((s: any) => s.name.ilike(`%${trimmed}%`)) as any;
    }
    return dataQuery
      .orderBy((s: any) => s.name.asc())
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .all();
  }

  async findById(id: number) {
    return orm.Skill.where({ id }).first();
  }

  async findByNameCaseInsensitive(name: string) {
    return orm.Skill.where((s: any) => s.name.ilike(name.trim())).first();
  }

  async create(name: string) {
    return orm.Skill.create({
      name: name.trim() as any,
    });
  }

  async update(id: number, name: string) {
    await orm.Skill.where({ id }).update({
      name: name.trim() as any,
      updatedat: nowPlainDateTime() as any,
    });
    return this.findById(id);
  }

  async isUsed(id: number): Promise<boolean> {
    const usedInUser = await orm.SkillUser.where({ skillid: id }).first();
    const usedInJob = await orm.SkillJob.where({ skillid: id }).first();
    return Boolean(usedInUser || usedInJob);
  }

  async delete(id: number) {
    return orm.Skill.where({ id }).delete();
  }
}
