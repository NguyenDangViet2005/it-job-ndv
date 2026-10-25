import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { orm } from '../../prisma/db.js';
import { ConnectionService } from './connection.service.js';
import { ConnectionRepository } from './connection.repository.js';
import {
  useDatabaseFixtures,
  expectSqlState,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const service = new ConnectionService(new ConnectionRepository());

describe('Connection service + repository + PostgreSQL', () => {
  it('sends, accepts, lists and removes a connection', async () => {
    const { candidate, outsider } = context.fixture;
    const created = await service.sendConnectionRequest(
      candidate.id,
      outsider.id,
    );
    expect(
      await orm.Connection.where({ id: created.id }).first(),
    ).toMatchObject({ status: 'pending' });
    await service.acceptConnectionRequest(created.id, outsider.id);
    expect(
      await orm.Connection.where({ id: created.id }).first(),
    ).toMatchObject({ status: 'accepted' });
    expect((await service.getUserConnections(candidate.id)).totalItems).toBe(1);
    expect((await service.getUserConnections(outsider.id)).totalItems).toBe(1);
    await service.removeConnection(created.id, candidate.id);
    expect(await orm.Connection.where({ id: created.id }).first()).toBeNull();
  });

  it('rejects self-connections and duplicate requests in the opposite direction', async () => {
    const { candidate, outsider } = context.fixture;
    await expect(
      service.sendConnectionRequest(candidate.id, candidate.id),
    ).rejects.toBeInstanceOf(BadRequestException);
    await service.sendConnectionRequest(candidate.id, outsider.id);
    await expect(
      service.sendConnectionRequest(outsider.id, candidate.id),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expectSqlState(
      new ConnectionRepository().createConnection(outsider.id, candidate.id),
      '23505',
    );
    expect(
      await orm.Connection.where({ userid: candidate.id }).all(),
    ).toHaveLength(1);
  });

  it('permits only the recipient to respond and either participant to remove', async () => {
    const { candidate, outsider, owner } = context.fixture;
    const created = await service.sendConnectionRequest(
      candidate.id,
      outsider.id,
    );
    await expect(
      service.acceptConnectionRequest(created.id, candidate.id),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.removeConnection(created.id, owner.id),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await service.rejectConnectionRequest(created.id, outsider.id);
    expect(
      await orm.Connection.where({ id: created.id }).first(),
    ).toMatchObject({ status: 'rejected' });
    expect((await service.getUserConnections(candidate.id)).totalItems).toBe(0);
  });
});
