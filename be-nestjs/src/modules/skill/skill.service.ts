import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { SkillRepository } from './skill.repository.js';
import { RedisCacheService } from '../redis/redis-cache.service.js';
import { REDIS_CACHE_TTL, REDIS_KEYS } from '../redis/redis-cache.constants.js';

@Injectable()
export class SkillService {
  constructor(
    private readonly skillRepo: SkillRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async getAllSkills(
    page: number = 1,
    pageSize: number = 20,
    keyword?: string,
  ) {
    const normalizedKeyword = keyword?.trim() ?? '';
    return this.cache.remember(
      REDIS_KEYS.skill.list(page, pageSize, normalizedKeyword.toLowerCase()),
      REDIS_CACHE_TTL.SKILL.LIST,
      async () => {
        const totalItems =
          await this.skillRepo.countByKeyword(normalizedKeyword);
        const rows = await this.skillRepo.findByKeyword(
          page,
          pageSize,
          normalizedKeyword,
        );
        return {
          data: rows,
          totalItems,
          page,
          pageSize,
          totalPages: Math.ceil(totalItems / pageSize),
        };
      },
    );
  }

  async getSkillById(id: number) {
    return this.cache.remember(
      REDIS_KEYS.skill.detail(id),
      REDIS_CACHE_TTL.SKILL.DETAIL,
      async () => {
        const skill = await this.skillRepo.findById(id);
        if (!skill) throw new NotFoundException('Kỹ năng không tồn tại');
        return skill;
      },
    );
  }

  async createSkill(dto: CreateSkillDto) {
    const name = dto.name.trim();
    const existing = await this.skillRepo.findByNameCaseInsensitive(name);

    if (existing) {
      throw new ConflictException('Kỹ năng này đã tồn tại trong hệ thống');
    }

    const created = await this.skillRepo.create(name);
    await this.cache.deleteByPattern(REDIS_KEYS.skill.all);
    return created;
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

    const updated = await this.skillRepo.update(id, name);
    await Promise.all([
      this.cache.deleteByPattern(REDIS_KEYS.skill.all),
      this.cache.deleteByPattern(REDIS_KEYS.job.all),
    ]);
    return updated;
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
    await Promise.all([
      this.cache.deleteByPattern(REDIS_KEYS.skill.all),
      this.cache.deleteByPattern(REDIS_KEYS.job.all),
    ]);
    return true;
  }
}
