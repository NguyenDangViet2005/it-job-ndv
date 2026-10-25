import { NotFoundException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { LocationService } from './location.service.js';
import { LocationRepository } from './location.repository.js';
import {
  useDatabaseFixtures,
  varchar,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new LocationService(new LocationRepository());

describe('Location service + repository + PostgreSQL', () => {
  it('reads provinces from PostgreSQL', async () => {
    const { province } = context.fixture;
    expect(await service.getAllProvinces()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: province.id, name: province.name }),
      ]),
    );
  });

  it('filters wards by province and orders them by name', async () => {
    const { province, ward } = context.fixture;
    const first = await orm.Wards.create({
      provinceid: province.id,
      name: varchar(`${context.prefix}-aaa`, 100),
    });
    const other = await orm.Provinces.create({
      name: varchar(`${context.prefix}-other-province`, 100),
    });
    await orm.Wards.create({
      provinceid: other.id,
      name: varchar(`${context.prefix}-foreign`, 100),
    });
    expect(
      (await service.getWardsByProvinceId(province.id)).map((w) => w.id),
    ).toEqual([first.id, ward.id]);
  });

  it('returns not found for a missing province', async () => {
    await expect(service.getWardsByProvinceId(-1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
