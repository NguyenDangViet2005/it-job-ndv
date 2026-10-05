import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { SkillRepository } from './skill.repository.js';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepo: SkillRepository) {}

  async getAllSkills(page: number = 1, pageSize: number = 20, keyword?: string) {
    const totalItems = await this.skillRepo.countByKeyword(keyword);
    const rows = await this.skillRepo.findByKeyword(page, pageSize, keyword);

    return {
      data: rows,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async getSkillById(id: number) {
    const skill = await this.skillRepo.findById(id);
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }
    return skill;
  }

  async createSkill(dto: CreateSkillDto) {
    const name = dto.name.trim();
    const existing = await this.skillRepo.findByNameCaseInsensitive(name);

    if (existing) {
      throw new ConflictException('Kỹ năng này đã tồn tại trong hệ thống');
    }

    return this.skillRepo.create(name);
  }

  async updateSkill(id: number, dto: UpdateSkillDto) {
    const skill = await this.skillRepo.findById(id);
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }

    const name = dto.name.trim();
    const existing = await this.skillRepo.findByNameCaseInsensitive(name);

    if (existing && existing.id !== id) {
      throw new ConflictException('Tên kỹ năng này đã được sử dụng');
    }

    return this.skillRepo.update(id, name);
  }

  async deleteSkill(id: number) {
    const skill = await this.skillRepo.findById(id);
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }

    const isUsed = await this.skillRepo.isUsed(id);
    if (isUsed) {
      throw new BadRequestException(
        'Không thể xóa kỹ năng này vì đang có ứng viên hoặc tin tuyển dụng sử dụng',
      );
    }

    await this.skillRepo.delete(id);
    return true;
  }
}
