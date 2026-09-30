export interface FollowUserResponse {
  id: number;
  fullname: string;
  avatar: string | null;
  email?: string;
}

export interface FollowResponseData {
  userid: number;
  companyid: number;
  createdat: string | Date | null;
  user: FollowUserResponse | null;
}

export class FollowMapper {
  static toFollowResponse(follow: any, user: any): FollowResponseData {
    return {
      userid: follow.userid,
      companyid: follow.companyid,
      createdat: follow.createdat,
      user: user
        ? {
            id: user.id,
            fullname: user.fullname || '',
            avatar: user.avatar || null,
            email: user.email || undefined,
          }
        : null,
    };
  }
}
