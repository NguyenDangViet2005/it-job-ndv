import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import {
  ConnectionMapper,
  type ConnectionResponseData,
} from './connection.mapper.js';

export type { ConnectionResponseData };

@Injectable()
export class ConnectionService {
  /**
   * Gửi lời mời kết nối
   */
  async sendConnectionRequest(
    userId: number,
    connectedUserId: number,
  ): Promise<ConnectionResponseData> {
    if (userId === connectedUserId) {
      throw new BadRequestException('Không thể gửi lời mời kết nối cho chính mình');
    }

    const targetUser = await orm.User.where({ id: connectedUserId }).first();
    if (!targetUser) {
      throw new NotFoundException('Người dùng cần kết nối không tồn tại');
    }

    // Kiểm tra xem đã có kết nối hoặc lời mời giữa 2 người chưa
    const existing = await orm.Connection.where((c: any) =>
      c.or(
        c.and({ userid: userId, connecteduserid: connectedUserId }),
        c.and({ userid: connectedUserId, connecteduserid: userId }),
      ),
    ).first();

    if (existing) {
      throw new BadRequestException('Lời mời kết nối hoặc mối quan hệ đã tồn tại');
    }

    const created = await orm.Connection.create({
      userid: userId,
      connecteduserid: connectedUserId,
      status: 'pending' as any,
      createdat: new Date() as any,
      updatedat: new Date() as any,
    });

    const user = await orm.User.where({ id: userId }).first();
    return ConnectionMapper.toConnectionResponse(created, user, targetUser);
  }

  /**
   * Chấp nhận lời mời kết nối
   */
  async acceptConnectionRequest(
    connectionId: number,
    userId: number,
  ): Promise<ConnectionResponseData> {
    const connection = await orm.Connection.where({ id: connectionId }).first();
    if (!connection) {
      throw new NotFoundException('Không tìm thấy lời mời kết nối');
    }

    if (connection.connecteduserid !== userId) {
      throw new ForbiddenException('Bạn không có quyền chấp nhận lời mời kết nối này');
    }

    if (connection.status !== 'pending') {
      throw new BadRequestException('Lời mời kết nối không ở trạng thái chờ duyệt');
    }

    await orm.Connection.where({ id: connectionId }).update({
      status: 'accepted' as any,
      updatedat: new Date() as any,
    });

    const updated = await orm.Connection.where({ id: connectionId }).first();
    const user = await orm.User.where({ id: connection.userid }).first();
    const connectedUser = await orm.User.where({ id: connection.connecteduserid }).first();

    return ConnectionMapper.toConnectionResponse(updated, user, connectedUser);
  }

  /**
   * Từ chối lời mời kết nối
   */
  async rejectConnectionRequest(
    connectionId: number,
    userId: number,
  ): Promise<ConnectionResponseData> {
    const connection = await orm.Connection.where({ id: connectionId }).first();
    if (!connection) {
      throw new NotFoundException('Không tìm thấy lời mời kết nối');
    }

    if (connection.connecteduserid !== userId) {
      throw new ForbiddenException('Bạn không có quyền từ chối lời mời kết nối này');
    }

    await orm.Connection.where({ id: connectionId }).update({
      status: 'rejected' as any,
      updatedat: new Date() as any,
    });

    const updated = await orm.Connection.where({ id: connectionId }).first();
    const user = await orm.User.where({ id: connection.userid }).first();
    const connectedUser = await orm.User.where({ id: connection.connecteduserid }).first();

    return ConnectionMapper.toConnectionResponse(updated, user, connectedUser);
  }

  /**
   * Xóa kết nối giữa 2 người dùng
   */
  async removeConnection(connectionId: number, userId: number) {
    const connection = await orm.Connection.where({ id: connectionId }).first();
    if (!connection) {
      throw new NotFoundException('Không tìm thấy kết nối');
    }

    if (connection.userid !== userId && connection.connecteduserid !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa kết nối này');
    }

    await orm.Connection.where({ id: connectionId }).delete();

    return {
      success: true,
      message: 'Xóa kết nối thành công',
    };
  }

  /**
   * Lấy danh sách bạn bè đã kết nối (accepted) của người dùng
   */
  async getUserConnections(
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const condition = (c: any) =>
      c.and(
        c.or({ userid: userId }, { connecteduserid: userId }),
        { status: 'accepted' as any },
      );

    const { count } = await orm.Connection.where(condition).aggregate((a) => ({
      count: a.count(),
    }));

    const rows = await orm.Connection.where(condition)
      .orderBy((c: any) => c.updatedat.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Nạp thông tin người dùng theo lô (tránh N+1)
    const allUserIds = [
      ...new Set(rows.flatMap((r: any) => [r.userid, r.connecteduserid])),
    ];
    let userMap = new Map<number, any>();
    if (allUserIds.length > 0) {
      const users = await orm.User.where((u: any) => u.id.in(allUserIds)).all();
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    const formatted = rows.map((r: any) =>
      ConnectionMapper.toConnectionResponse(
        r,
        userMap.get(r.userid),
        userMap.get(r.connecteduserid),
      ),
    );

    return {
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Lấy danh sách lời mời kết nối đã nhận (đang chờ duyệt)
   */
  async getPendingRequests(
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const condition = {
      connecteduserid: userId,
      status: 'pending' as any,
    };

    const { count } = await orm.Connection.where(condition).aggregate((a) => ({
      count: a.count(),
    }));

    const rows = await orm.Connection.where(condition)
      .orderBy((c: any) => c.createdat.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Nạp thông tin người gửi lời mời
    const senderIds = [...new Set(rows.map((r: any) => r.userid))];
    let userMap = new Map<number, any>();
    if (senderIds.length > 0) {
      const users = await orm.User.where((u: any) => u.id.in(senderIds)).all();
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    const formatted = rows.map((r: any) =>
      ConnectionMapper.toConnectionResponse(r, userMap.get(r.userid), null),
    );

    return {
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Lấy danh sách lời mời kết nối đã gửi đi (đang chờ duyệt)
   */
  async getSentRequests(
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const condition = {
      userid: userId,
      status: 'pending' as any,
    };

    const { count } = await orm.Connection.where(condition).aggregate((a) => ({
      count: a.count(),
    }));

    const rows = await orm.Connection.where(condition)
      .orderBy((c: any) => c.createdat.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Nạp thông tin người nhận lời mời
    const receiverIds = [...new Set(rows.map((r: any) => r.connecteduserid))];
    let userMap = new Map<number, any>();
    if (receiverIds.length > 0) {
      const users = await orm.User.where((u: any) => u.id.in(receiverIds)).all();
      userMap = new Map(users.map((u) => [u.id, u]));
    }

    const formatted = rows.map((r: any) =>
      ConnectionMapper.toConnectionResponse(r, null, userMap.get(r.connecteduserid)),
    );

    return {
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }
}
