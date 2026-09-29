import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '~/prisma/db.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';

@Injectable()
export class SkillService {
  async getAllSkills(page: number = 1, pageSize: number = 20, keyword?: string) {
    const trimmed = keyword?.trim();

    let countQuery = db.orm.public.Skill;
    let dataQuery = db.orm.public.Skill;

    if (trimmed) {
      countQuery = countQuery.where((s: any) => s.name.ilike(`%${trimmed}%`)) as any;
      dataQuery = dataQuery.where((s: any) => s.name.ilike(`%${trimmed}%`)) as any;
    }

    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));

    const rows = await dataQuery
      .orderBy((s: any) => s.name.asc())
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .all();

    return {
      data: rows,
      totalItems: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  async getSkillById(id: number) {
    const skill = await db.orm.public.Skill.where({ id }).first();
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }
    return skill;
  }

  async createSkill(dto: CreateSkillDto) {
    const name = dto.name.trim();

    const existing = await db.orm.public.Skill.where((s: any) =>
      s.name.ilike(name),
    ).first();

    if (existing) {
      throw new ConflictException('Kỹ năng này đã tồn tại trong hệ thống');
    }

    const newSkill = await db.orm.public.Skill.create({
      name: name as any,
    });

    return newSkill;
  }

  async updateSkill(id: number, dto: UpdateSkillDto) {
    const skill = await db.orm.public.Skill.where({ id }).first();
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }

    const name = dto.name.trim();

    const existing = await db.orm.public.Skill.where((s: any) =>
      s.name.ilike(name),
    ).first();

    if (existing && existing.id !== id) {
      throw new ConflictException('Tên kỹ năng này đã được sử dụng');
    }

    await db.orm.public.Skill.where({ id }).update({
      name: name as any,
      updatedat: new Date() as any,
    });

    const updated = await db.orm.public.Skill.where({ id }).first();
    return updated;
  }

  async deleteSkill(id: number) {
    const skill = await db.orm.public.Skill.where({ id }).first();
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }

    // Kiểm tra xem kỹ năng có đang được ứng viên hoặc bài đăng tuyển dụng sử dụng không
    const usedInUser = await db.orm.public.SkillUser.where({ skillid: id }).first();
    const usedInJob = await db.orm.public.SkillJob.where({ skillid: id }).first();

    if (usedInUser || usedInJob) {
      throw new BadRequestException(
        'Không thể xóa kỹ năng này vì đang có ứng viên hoặc tin tuyển dụng sử dụng',
      );
    }

    await db.orm.public.Skill.where({ id }).delete();
    return true;
  }
}
