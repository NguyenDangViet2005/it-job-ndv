import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class LocationRepository {
  async findAllProvinces() {
    return orm.Provinces
      .orderBy((p: any) => p.name.asc())
      .all();
  }

  async findProvinceById(id: number) {
    return orm.Provinces.where({ id }).first();
  }

  async findWardsByProvinceId(provinceId: number) {
    return orm.Wards
      .where({ provinceid: provinceId })
      .orderBy((w: any) => w.name.asc())
      .all();
  }
}
