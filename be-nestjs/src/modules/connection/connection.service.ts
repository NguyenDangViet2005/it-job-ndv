import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ConnectionMapper,
  type ConnectionResponseData,
} from './connection.mapper.js';
import { ConnectionRepository } from './connection.repository.js';

export type { ConnectionResponseData };

@Injectable()
export class ConnectionService {
  constructor(private readonly connectionRepo: ConnectionRepository) {}

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

    const targetUser = await this.connectionRepo.findUserById(connectedUserId);
    if (!targetUser) {
      throw new NotFoundException('Người dùng cần kết nối không tồn tại');
    }

    // Kiểm tra xem đã có kết nối hoặc lời mời giữa 2 người chưa
    const existing = await this.connectionRepo.findExistingConnectionBetween(
      userId,
      connectedUserId,
    );

    if (existing) {
      throw new BadRequestException('Lời mời kết nối hoặc mối quan hệ đã tồn tại');
    }

    const created = await this.connectionRepo.createConnection(userId, connectedUserId);
    const user = await this.connectionRepo.findUserById(userId);
    return ConnectionMapper.toConnectionResponse(created, user, targetUser);
  }

  /**
   * Chấp nhận lời mời kết nối
   */
  async acceptConnectionRequest(
    connectionId: number,
    userId: number,
  ): Promise<ConnectionResponseData> {
    const connection = await this.connectionRepo.findById(connectionId);
    if (!connection) {
      throw new NotFoundException('Không tìm thấy lời mời kết nối');
    }

    if (connection.connecteduserid !== userId) {
      throw new ForbiddenException('Bạn không có quyền chấp nhận lời mời kết nối này');
    }

    if (connection.status !== 'pending') {
      throw new BadRequestException('Lời mời kết nối không ở trạng thái chờ duyệt');
    }

    const updated = await this.connectionRepo.updateStatus(connectionId, 'accepted');
    const user = await this.connectionRepo.findUserById(connection.userid);
    const connectedUser = await this.connectionRepo.findUserById(connection.connecteduserid);

    return ConnectionMapper.toConnectionResponse(updated, user, connectedUser);
  }

  /**
   * Từ chối lời mời kết nối
   */
  async rejectConnectionRequest(
    connectionId: number,
    userId: number,
  ): Promise<ConnectionResponseData> {
    const connection = await this.connectionRepo.findById(connectionId);
    if (!connection) {
      throw new NotFoundException('Không tìm thấy lời mời kết nối');
    }

    if (connection.connecteduserid !== userId) {
      throw new ForbiddenException('Bạn không có quyền từ chối lời mời kết nối này');
    }

    const updated = await this.connectionRepo.updateStatus(connectionId, 'rejected');
    const user = await this.connectionRepo.findUserById(connection.userid);
    const connectedUser = await this.connectionRepo.findUserById(connection.connecteduserid);

    return ConnectionMapper.toConnectionResponse(updated, user, connectedUser);
  }

  /**
   * Xóa kết nối giữa 2 người dùng
   */
  async removeConnection(connectionId: number, userId: number) {
    const connection = await this.connectionRepo.findById(connectionId);
    if (!connection) {
      throw new NotFoundException('Không tìm thấy kết nối');
    }

    if (connection.userid !== userId && connection.connecteduserid !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa kết nối này');
    }

    await this.connectionRepo.delete(connectionId);

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
    const offset = (pNumber - 1) * pSize;

    const count = await this.connectionRepo.countUserAcceptedConnections(userId);
    const rows = await this.connectionRepo.findUserAcceptedConnections(userId, offset, pSize);

    // Nạp thông tin người dùng theo lô (tránh N+1)
    const allUserIds = [
      ...new Set(rows.flatMap((r: any) => [r.userid, r.connecteduserid])),
    ] as number[];
    let userMap = new Map<number, any>();
    if (allUserIds.length > 0) {
      const users = await this.connectionRepo.findUsersByIds(allUserIds);
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
    const offset = (pNumber - 1) * pSize;

    const count = await this.connectionRepo.countPendingRequests(userId);
    const rows = await this.connectionRepo.findPendingRequests(userId, offset, pSize);

    // Nạp thông tin người gửi lời mời
    const senderIds = [...new Set(rows.map((r: any) => r.userid))] as number[];
    let userMap = new Map<number, any>();
    if (senderIds.length > 0) {
      const users = await this.connectionRepo.findUsersByIds(senderIds);
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
    const offset = (pNumber - 1) * pSize;

    const count = await this.connectionRepo.countSentRequests(userId);
    const rows = await this.connectionRepo.findSentRequests(userId, offset, pSize);

    // Nạp thông tin người nhận lời mời
    const receiverIds = [...new Set(rows.map((r: any) => r.connecteduserid))] as number[];
    let userMap = new Map<number, any>();
    if (receiverIds.length > 0) {
      const users = await this.connectionRepo.findUsersByIds(receiverIds);
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
