export interface ConnectionUserResponse {
  id: number;
  fullname: string;
  avatar: string | null;
  email?: string;
}

export interface ConnectionResponseData {
  id: number;
  userid: number;
  connecteduserid: number;
  status: string | null;
  createdat: string | Date | null;
  updatedat: string | Date | null;
  user?: ConnectionUserResponse | null;
  connectedUser?: ConnectionUserResponse | null;
}

export class ConnectionMapper {
  static toConnectionResponse(
    connection: any,
    user?: any,
    connectedUser?: any,
  ): ConnectionResponseData {
    const finalUser = user || connection.user || connection.User || null;
    const finalConnectedUser =
      connectedUser ||
      connection.connectedUser ||
      connection.ConnectedUser ||
      null;

    return {
      id: connection.id,
      userid: connection.userid,
      connecteduserid: connection.connecteduserid,
      status: connection.status || 'pending',
      createdat: connection.createdat,
      updatedat: connection.updatedat,
      user: finalUser
        ? {
            id: finalUser.id,
            fullname: finalUser.fullname || '',
            avatar: finalUser.avatar || null,
            email: finalUser.email || undefined,
          }
        : undefined,
      connectedUser: finalConnectedUser
        ? {
            id: finalConnectedUser.id,
            fullname: finalConnectedUser.fullname || '',
            avatar: finalConnectedUser.avatar || null,
            email: finalConnectedUser.email || undefined,
          }
        : undefined,
    };
  }
}
