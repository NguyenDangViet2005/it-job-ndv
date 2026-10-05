import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { or, and } from '@prisma/orm-postgres/orm-client';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';

@Injectable()
export class ConnectionRepository {
  async findUserById(id: number) {
    return orm.User.where({ id }).first();
  }

  async findUsersByIds(ids: number[]) {
    if (ids.length === 0) return [];
    return orm.User.where((u: any) => u.id.in(ids)).all();
  }

  async findExistingConnectionBetween(userId1: number, userId2: number) {
    return orm.Connection.where((c: any) =>
      or(
        and(c.userid.eq(userId1), c.connecteduserid.eq(userId2)),
        and(c.userid.eq(userId2), c.connecteduserid.eq(userId1)),
      ),
    ).first();
  }

  async createConnection(userId: number, connectedUserId: number) {
    return orm.Connection.create({
      userid: userId,
      connecteduserid: connectedUserId,
      status: 'pending' as any,
      createdat: nowPlainDateTime() as any,
      updatedat: nowPlainDateTime() as any,
    });
  }

  async findById(connectionId: number) {
    return orm.Connection.where({ id: connectionId }).first();
  }

  async updateStatus(connectionId: number, status: 'pending' | 'accepted' | 'rejected') {
    await orm.Connection.where({ id: connectionId }).update({
      status: status as any,
      updatedat: nowPlainDateTime() as any,
    });
    return this.findById(connectionId);
  }

  async delete(connectionId: number) {
    return orm.Connection.where({ id: connectionId }).delete();
  }

  async countUserAcceptedConnections(userId: number): Promise<number> {
    const condition = (c: any) =>
      and(
        or(c.userid.eq(userId), c.connecteduserid.eq(userId)),
        c.status.eq('accepted'),
      );
    const { count } = await orm.Connection.where(condition).aggregate((a) => ({
      count: a.count(),
    }));
    return count;
  }

  async findUserAcceptedConnections(userId: number, offset: number, limit: number) {
    const condition = (c: any) =>
      and(
        or(c.userid.eq(userId), c.connecteduserid.eq(userId)),
        c.status.eq('accepted'),
      );
    return orm.Connection.where(condition)
      .orderBy((c: any) => c.updatedat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countPendingRequests(userId: number): Promise<number> {
    const condition = {
      connecteduserid: userId,
      status: 'pending' as any,
    };
    const { count } = await orm.Connection.where(condition).aggregate((a) => ({
      count: a.count(),
    }));
    return count;
  }

  async findPendingRequests(userId: number, offset: number, limit: number) {
    const condition = {
      connecteduserid: userId,
      status: 'pending' as any,
    };
    return orm.Connection.where(condition)
      .orderBy((c: any) => c.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countSentRequests(userId: number): Promise<number> {
    const condition = {
      userid: userId,
      status: 'pending' as any,
    };
    const { count } = await orm.Connection.where(condition).aggregate((a) => ({
      count: a.count(),
    }));
    return count;
  }

  async findSentRequests(userId: number, offset: number, limit: number) {
    const condition = {
      userid: userId,
      status: 'pending' as any,
    };
    return orm.Connection.where(condition)
      .orderBy((c: any) => c.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }
}
