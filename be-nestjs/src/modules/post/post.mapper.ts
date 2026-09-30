import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

export interface PostUserResponse {
  id: number;
  fullname: string;
  avatar: string | null;
  companyMembers?: any[];
}

export interface PostCompanyResponse {
  id: number;
  name: string;
  avatar: string | null;
  address: string | null;
  hotline?: string | null;
  companyemail?: string | null;
}

export interface AttachmentResponse {
  id: number;
  fileurl: string;
  filetype: string | null;
}

export interface CommentResponse {
  id: number;
  user: PostUserResponse | null;
  content: string | null;
  isliked?: boolean;
  createdat: string | Date | null;
  updatedat: string | Date | null;
  attachments: AttachmentResponse[];
}

export interface PostResponseData {
  id: number;
  content: string | null;
  createdat: string | Date | null;
  updatedat: string | Date | null;
  userid: number;
  companyid: number | null;
  user: PostUserResponse | null;
  company: PostCompanyResponse | null;
  attachments: AttachmentResponse[];
  interaction: {
    totalLikes: number;
    totalComments: number;
    islikedByCurrentUser: boolean;
    comments: CommentResponse[];
  };
}

export class PostMapper {
  static toAttachmentResponse(att: any): AttachmentResponse {
    return {
      id: att.id,
      fileurl: att.fileurl,
      filetype: att.filetype || null,
    };
  }

  static toUserResponse(user: any): PostUserResponse | null {
    if (!user) return null;
    return {
      id: user.id,
      fullname: user.fullname || '',
      avatar: user.avatar || null,
      companyMembers: user.companyMembers
        ? user.companyMembers.map((cm: any) => ({
            companyid: cm.companyid,
            status: cm.status,
            company: cm.company
              ? {
                  id: cm.company.id,
                  name: cm.company.name,
                  avatar: cm.company.avatar,
                }
              : null,
          }))
        : undefined,
    };
  }

  static toCompanyResponse(comp: any): PostCompanyResponse | null {
    if (!comp) return null;
    return {
      id: comp.id,
      name: comp.name,
      avatar: comp.avatar || null,
      address: comp.address || null,
      hotline: comp.hotline || null,
      companyemail: comp.companyemail || null,
    };
  }

  static toCommentResponse(comment: any): CommentResponse {
    const user = comment.user || comment.User || null;
    const attachments = comment.attachments || comment.Attachments || [];

    return {
      id: comment.id,
      user: PostMapper.toUserResponse(user),
      content: comment.content,
      isliked: comment.isliked ?? false,
      createdat: comment.createdat,
      updatedat: comment.updatedat,
      attachments: attachments.map((a: any) => PostMapper.toAttachmentResponse(a)),
    };
  }

  static toPostResponse(
    post: any,
    user: any,
    company: any,
    attachments: any[] = [],
    interactionStats: {
      totalLikes: number;
      totalComments: number;
      islikedByCurrentUser: boolean;
      comments?: any[];
    } = {
      totalLikes: 0,
      totalComments: 0,
      islikedByCurrentUser: false,
      comments: [],
    },
  ): PostResponseData {
    return {
      id: post.id,
      content: post.content || null,
      createdat: post.createdat,
      updatedat: post.updatedat,
      userid: post.userid,
      companyid: post.companyid || null,
      user: PostMapper.toUserResponse(user),
      company: PostMapper.toCompanyResponse(company),
      attachments: attachments.map((a: any) => PostMapper.toAttachmentResponse(a)),
      interaction: {
        totalLikes: interactionStats.totalLikes,
        totalComments: interactionStats.totalComments,
        islikedByCurrentUser: interactionStats.islikedByCurrentUser,
        comments: (interactionStats.comments || []).map((c: any) =>
          PostMapper.toCommentResponse(c),
        ),
      },
    };
  }

  static toCreatePostEntity(dto: CreatePostDto, userId: number) {
    return {
      content: dto.content?.trim() || null,
      userid: userId,
      companyid: dto.companyid || null,
      createdat: new Date() as any,
      updatedat: new Date() as any,
    };
  }

  static toUpdatePostEntity(dto: UpdatePostDto) {
    const data: Record<string, any> = {
      updatedat: new Date() as any,
    };
    if (dto.content !== undefined) {
      data.content = dto.content.trim() || null;
    }
    if (dto.companyid !== undefined) {
      data.companyid = dto.companyid;
    }
    return data;
  }

  static toCreateCommentEntity(dto: CreateCommentDto, postId: number, userId: number) {
    return {
      postid: postId,
      userid: userId,
      content: dto.content.trim(),
      isliked: false,
      createdat: new Date() as any,
      updatedat: new Date() as any,
    };
  }

  static toUpdateCommentEntity(dto: UpdateCommentDto) {
    const data: Record<string, any> = {
      updatedat: new Date() as any,
    };
    if (dto.content !== undefined) {
      data.content = dto.content.trim();
    }
    return data;
  }
}
