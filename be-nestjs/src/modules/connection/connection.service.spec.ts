import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionService } from './connection.service.js';
import type { ConnectionRepository } from './connection.repository.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));

describe('ConnectionService', () => {
  const repo = {
    findUserById: vi.fn(),
    findExistingConnectionBetween: vi.fn(),
    createConnection: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  };
  let service: ConnectionService;
  const connection = {
    id: 5,
    userid: 1,
    connecteduserid: 2,
    status: 'pending',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ConnectionService(repo as unknown as ConnectionRepository);
    repo.findUserById.mockImplementation(async (id: number) => ({
      id,
      fullname: `User ${id}`,
    }));
    repo.findById.mockResolvedValue(connection);
    repo.createConnection.mockResolvedValue(connection);
    repo.updateStatus.mockImplementation(
      async (_id: number, status: string) => ({ ...connection, status }),
    );
  });

  it('rejects inviting yourself before querying the repository', async () => {
    await expect(service.sendConnectionRequest(1, 1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repo.findUserById).not.toHaveBeenCalled();
    expect(repo.createConnection).not.toHaveBeenCalled();
  });

  it('rejects an unknown recipient', async () => {
    repo.findUserById.mockResolvedValue(null);
    await expect(service.sendConnectionRequest(1, 2)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.createConnection).not.toHaveBeenCalled();
  });

  it('rejects an existing relationship returned by the bidirectional lookup', async () => {
    repo.findExistingConnectionBetween.mockResolvedValue({
      ...connection,
      userid: 2,
      connecteduserid: 1,
    });
    await expect(service.sendConnectionRequest(1, 2)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repo.findExistingConnectionBetween).toHaveBeenCalledWith(1, 2);
    expect(repo.createConnection).not.toHaveBeenCalled();
  });

  it('creates a request and returns both users', async () => {
    await expect(service.sendConnectionRequest(1, 2)).resolves.toMatchObject({
      status: 'pending',
      user: { id: 1 },
      connectedUser: { id: 2 },
    });
    expect(repo.createConnection).toHaveBeenCalledWith(1, 2);
  });

  describe.each([
    ['acceptConnectionRequest', 'accepted'],
    ['rejectConnectionRequest', 'rejected'],
  ] as const)('%s', (method, status) => {
    it('allows the recipient to respond', async () => {
      await expect(service[method](5, 2)).resolves.toMatchObject({ status });
      expect(repo.updateStatus).toHaveBeenCalledWith(5, status);
    });

    it('rejects the sender or an unrelated user', async () => {
      await expect(service[method](5, 1)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repo.updateStatus).not.toHaveBeenCalled();
    });

    it('rejects a missing request', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service[method](5, 2)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.updateStatus).not.toHaveBeenCalled();
    });
  });

  it.each(['accepted', 'rejected'])(
    'does not accept a request already %s',
    async (status) => {
      repo.findById.mockResolvedValue({ ...connection, status });
      await expect(
        service.acceptConnectionRequest(5, 2),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repo.updateStatus).not.toHaveBeenCalled();
    },
  );

  it.each([1, 2])(
    'allows participant %i to remove the connection',
    async (userId) => {
      await expect(service.removeConnection(5, userId)).resolves.toMatchObject({
        success: true,
      });
      expect(repo.delete).toHaveBeenCalledWith(5);
    },
  );

  it('prevents a third party from removing a connection', async () => {
    await expect(service.removeConnection(5, 3)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
