import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository.js';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepo: LocationRepository) {}

  async getAllProvinces() {
    return this.locationRepo.findAllProvinces();
  }

  async getWardsByProvinceId(provinceId: number) {
    const province = await this.locationRepo.findProvinceById(provinceId);
    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố tương ứng');
    }

    return this.locationRepo.findWardsByProvinceId(provinceId);
  }
}
