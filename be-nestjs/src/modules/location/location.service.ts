import { Injectable, NotFoundException } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class LocationService {
  async getAllProvinces() {
    const provinces = await orm.Provinces
      .orderBy((p: any) => p.name.asc())
      .all();

    return provinces;
  }

  async getWardsByProvinceId(provinceId: number) {
    const province = await orm.Provinces.where({ id: provinceId }).first();
    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố tương ứng');
    }

    const wards = await orm.Wards
      .where({ provinceid: provinceId })
      .orderBy((w: any) => w.name.asc())
      .all();

    return wards;
  }
}
