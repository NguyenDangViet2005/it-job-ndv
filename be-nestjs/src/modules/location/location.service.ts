import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '~/prisma/db.js';

@Injectable()
export class LocationService {
  async getAllProvinces() {
    const provinces = await db.orm.public.Provinces
      .orderBy((p: any) => p.name.asc())
      .all();

    return provinces;
  }

  async getWardsByProvinceId(provinceId: number) {
    const province = await db.orm.public.Provinces.where({ id: provinceId }).first();
    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố tương ứng');
    }

    const wards = await db.orm.public.Wards
      .where({ provinceid: provinceId })
      .orderBy((w: any) => w.name.asc())
      .all();

    return wards;
  }
}
