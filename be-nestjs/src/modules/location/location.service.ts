import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository.js';
import { RedisCacheService } from '../redis/redis-cache.service.js';
import { REDIS_CACHE_TTL, REDIS_KEYS } from '../redis/redis-cache.constants.js';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepo: LocationRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async getAllProvinces() {
    return this.cache.remember(
      REDIS_KEYS.location.provinces,
      REDIS_CACHE_TTL.LOCATION.PROVINCES,
      () => this.locationRepo.findAllProvinces(),
    );
  }

  async getWardsByProvinceId(provinceId: number) {
    return this.cache.remember(
      REDIS_KEYS.location.wards(provinceId),
      REDIS_CACHE_TTL.LOCATION.WARDS,
      async () => {
        const province = await this.locationRepo.findProvinceById(provinceId);
        if (!province) {
          throw new NotFoundException(
            'Không tìm thấy tỉnh/thành phố tương ứng',
          );
        }
        return this.locationRepo.findWardsByProvinceId(provinceId);
      },
    );
  }
}
