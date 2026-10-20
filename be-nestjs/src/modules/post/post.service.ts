import { withTransaction } from '~/prisma/db.js';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PostQueryDto } from './dto/post-query.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import {
  PostMapper,
  type PostResponseData,
  type CommentResponse,
} from './post.mapper.js';
import { PostRepository } from './post.repository.js';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Tối ưu hóa tải thông tin tác giả, công ty, tệp đính kèm và thống kê tương tác theo lô (tránh N+1)
   */
  private async cleanupFiles(urls: string[]) {
    for (const url of urls) {
      await this.cloudinaryService.deleteFile(url).catch((error) => {
        console.warn(
          'Cloudinary cleanup failed; retry deletion for:',
          url,
          error?.message,
        );
      });
    }
  }

  private async uploadAttachments<T>(
    files: Express.Multer.File[] | undefined,
    folder: string,
    persist: (
      attachments: { fileurl: string; filetype: string }[],
    ) => Promise<T>,
  ): Promise<T> {
    const uploaded: { fileurl: string; filetype: string }[] = [];
    try {
      for (const file of files ?? []) {
        const filetype = file.mimetype.startsWith('video/') ? 'video' : 'image';
        const result = await this.cloudinaryService.uploadFile(
          file,
          `${folder}/${filetype}s`,
        );
        uploaded.push({ fileurl: result.secure_url, filetype });
      }
      return await persist(uploaded);
    } catch (error) {
      await this.cleanupFiles(uploaded.map((a) => a.fileurl));
      throw error;
    }
  }

  private async enrichPosts(
    posts: any[],
    currentUserId?: number,
  ): Promise<PostResponseData[]> {
    if (posts.length === 0) return [];
    const postIds = posts.map((p) => p.id);
    const userIds = [
      ...new Set(posts.map((p) => p.userid).filter(Boolean)),
    ] as number[];
    const companyIds = [
      ...new Set(posts.map((p) => p.companyid).filter(Boolean)),
    ] as number[];

    // 1. Tải danh sách tác giả bài viết
    const users = await this.postRepo.findUsersByIds(userIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    // 2. Tải danh sách công ty liên quan
    let companyMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const companies = await this.postRepo.findCompaniesByIds(companyIds);
      companyMap = new Map(companies.map((c) => [c.id, c]));
    }

    // 3. Tải attachments của các bài viết
    const attachments = await this.postRepo.findAttachmentsByPostIds(postIds);
    const attachmentMap = new Map<number, any[]>();
    for (const att of attachments) {
      if (att.postid) {
        if (!attachmentMap.has(att.postid)) attachmentMap.set(att.postid, []);
        attachmentMap.get(att.postid)!.push(att);
      }
    }

    // 4. Thống kê likes
    const allLikes = await this.postRepo.findLikesByPostIds(postIds);
    const likesCountMap = new Map<number, number>();
    const userLikesSet = new Set<number>();
    for (const like of allLikes) {
      likesCountMap.set(like.postid, (likesCountMap.get(like.postid) || 0) + 1);
      if (currentUserId && like.userid === currentUserId) {
        userLikesSet.add(like.postid);
      }
    }

    // 5. Thống kê và tải bình luận gần đây
    const allComments = await this.postRepo.findCommentsByPostIds(postIds);

    const commentsCountMap = new Map<number, number>();
    const recentCommentsMap = new Map<number, any[]>();
    const commentUserIds = new Set<number>();
    const commentIds: number[] = [];

    for (const comment of allComments) {
      commentsCountMap.set(
        comment.postid,
        (commentsCountMap.get(comment.postid) || 0) + 1,
      );

      if (!recentCommentsMap.has(comment.postid)) {
        recentCommentsMap.set(comment.postid, []);
      }
      if (recentCommentsMap.get(comment.postid)!.length < 3) {
        recentCommentsMap.get(comment.postid)!.push(comment);
        commentUserIds.add(comment.userid);
        commentIds.push(comment.id);
      }
    }

    // Tải thông tin người bình luận & tệp đính kèm bình luận
    let commentUsersMap = new Map<number, any>();
    if (commentUserIds.size > 0) {
      const cUsers = await this.postRepo.findUsersWithCompanyMembersByIds([
        ...commentUserIds,
      ]);
      commentUsersMap = new Map(cUsers.map((u) => [u.id, u]));
    }

    let commentAttachmentsMap = new Map<number, any[]>();
    if (commentIds.length > 0) {
      const cAtts =
        await this.postRepo.findAttachmentsByInteractionIds(commentIds);
      for (const a of cAtts) {
        if (a.interactionid) {
          if (!commentAttachmentsMap.has(a.interactionid)) {
            commentAttachmentsMap.set(a.interactionid, []);
          }
          commentAttachmentsMap.get(a.interactionid)!.push(a);
        }
      }
    }

    return posts.map((post) => {
      const user = userMap.get(post.userid) || null;
      const company = post.companyid ? companyMap.get(post.companyid) : null;
      const postAttachments = attachmentMap.get(post.id) || [];
      const totalLikes = likesCountMap.get(post.id) || 0;
      const totalComments = commentsCountMap.get(post.id) || 0;
      const islikedByCurrentUser = userLikesSet.has(post.id);

      const rawRecentComments = recentCommentsMap.get(post.id) || [];
      const recentComments = rawRecentComments.map((c) => ({
        ...c,
        user: commentUsersMap.get(c.userid) || null,
        attachments: commentAttachmentsMap.get(c.id) || [],
      }));

      return PostMapper.toPostResponse(post, user, company, postAttachments, {
        totalLikes,
        totalComments,
        islikedByCurrentUser,
        comments: recentComments,
      });
    });
  }

  /**
   * Lấy danh sách bài viết có phân trang
   */
  async getAllPosts(query: PostQueryDto, currentUserId?: number) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || '').trim();
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.postRepo.countPosts(keyword);
    const rows = await this.postRepo.findPosts(keyword, offset, pageSize);

    const formatted = await this.enrichPosts(rows, currentUserId);

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy chi tiết một bài viết theo ID
   */
  async getPostById(
    id: number,
    currentUserId?: number,
  ): Promise<PostResponseData> {
    const post = await this.postRepo.findPostById(id);
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const [enriched] = await this.enrichPosts([post], currentUserId);
    return enriched;
  }

  /**
   * Lấy danh sách bài viết của người dùng
   */
  async getPostsByUserId(
    userId: number,
    query: PostQueryDto,
    currentUserId?: number,
  ) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.postRepo.countPostsByUserId(userId);
    const rows = await this.postRepo.findPostsByUserId(
      userId,
      offset,
      pageSize,
    );

    const formatted = await this.enrichPosts(rows, currentUserId);

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy danh sách bài viết của công ty
   */
  async getPostsByCompanyId(
    companyId: number,
    query: PostQueryDto,
    currentUserId?: number,
  ) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.postRepo.countPostsByCompanyId(companyId);
    const rows = await this.postRepo.findPostsByCompanyId(
      companyId,
      offset,
      pageSize,
    );

    const formatted = await this.enrichPosts(rows, currentUserId);

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Tạo bài viết mới kèm tệp đính kèm (ảnh/video)
   */
  async createPost(
    userId: number,
    dto: CreatePostDto,
    files?: Express.Multer.File[],
  ): Promise<PostResponseData> {
    if (dto.companyid) {
      const company = await this.postRepo.findCompanyById(dto.companyid);
      if (!company) {
        throw new NotFoundException('Công ty không tồn tại');
      }

      const isMember = await this.postRepo.findCompanyMember(
        dto.companyid,
        userId,
      );

      if (!isMember && company.createdbyuserid !== userId) {
        throw new ForbiddenException(
          'Bạn không có quyền đăng bài đại diện cho công ty này',
        );
      }
    }

    const newPost = await this.uploadAttachments(
      files,
      'IT-JOB/posts',
      (attachments) =>
        withTransaction(async () => {
          const post = await this.postRepo.createPost(
            PostMapper.toCreatePostEntity(dto, userId),
          );
          for (const attachment of attachments) {
            await this.postRepo.createAttachment({
              ...attachment,
              postid: post.id,
            });
          }
          return post;
        }),
    );
    return this.getPostById(newPost.id, userId);
  }

  /**
   * Cập nhật bài viết
   */
  async updatePost(
    id: number,
    currentUser: { id: number; role: string },
    dto: UpdatePostDto,
    files?: Express.Multer.File[],
  ): Promise<PostResponseData> {
    const post = await this.postRepo.findPostById(id);
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Kiểm tra quyền chỉnh sửa
    if (currentUser.role !== 'admin' && post.userid !== currentUser.id) {
      let isAllowed = false;
      if (post.companyid) {
        const isMember = await this.postRepo.findCompanyMember(
          post.companyid,
          currentUser.id,
        );
        const isCreator =
          (await this.postRepo.findCompanyById(post.companyid))
            ?.createdbyuserid === currentUser.id;
        isAllowed = Boolean(isMember || isCreator);
      }

      if (!isAllowed) {
        throw new ForbiddenException(
          'Bạn không có quyền chỉnh sửa bài viết này',
        );
      }
    }

    const removedUrls = await this.uploadAttachments(
      files,
      'IT-JOB/posts',
      (attachments) =>
        withTransaction(async () => {
          await this.postRepo.updatePost(
            id,
            PostMapper.toUpdatePostEntity(dto),
          );
          const existing = await this.postRepo.findAttachmentsByPostId(id);
          const keep = dto.keepImageUrls
            ? Array.isArray(dto.keepImageUrls)
              ? dto.keepImageUrls
              : [dto.keepImageUrls]
            : [];
          const removed = existing.filter((att) => !keep.includes(att.fileurl));
          for (const att of removed)
            await this.postRepo.deleteAttachmentById(att.id);
          for (const attachment of attachments)
            await this.postRepo.createAttachment({ ...attachment, postid: id });
          return removed.map((att) => att.fileurl);
        }, true),
    );
    await this.cleanupFiles(removedUrls);
    return this.getPostById(id, currentUser.id);
  }

  /**
   * Xóa bài viết và toàn bộ tệp đính kèm, tương tác liên quan
   */
  async deletePost(id: number, currentUser: { id: number; role: string }) {
    const post = await this.postRepo.findPostById(id);
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (currentUser.role !== 'admin' && post.userid !== currentUser.id) {
      let isAllowed = false;
      if (post.companyid) {
        const isMember = await this.postRepo.findCompanyMember(
          post.companyid,
          currentUser.id,
        );
        const isCreator =
          (await this.postRepo.findCompanyById(post.companyid))
            ?.createdbyuserid === currentUser.id;
        isAllowed = Boolean(isMember || isCreator);
      }

      if (!isAllowed) {
        throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
      }
    }

    const urls = await withTransaction(async () => {
      const direct = await this.postRepo.findAttachmentsByPostId(id);
      const comments = await this.postRepo.findInteractionsByPostId(id);
      const attachments = await this.postRepo.findAttachmentsByInteractionIds(
        comments.map((c) => c.id),
      );
      // FK cascades remove post -> interactions -> attachments atomically.
      await this.postRepo.deletePost(id);
      return [...direct, ...attachments].map((a) => a.fileurl);
    }, true);
    await this.cleanupFiles(urls);
    return { success: true, message: 'Xóa bài viết thành công' };
  }

  /**
   * Lấy danh sách bình luận của bài viết
   */
  async getComments(
    postId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;
    const offset = (pNumber - 1) * pSize;

    const count = await this.postRepo.countCommentsByPostId(postId);
    const comments = await this.postRepo.findCommentsByPostId(
      postId,
      offset,
      pSize,
    );

    // Nạp thêm thông tin công ty của tác giả bình luận nếu có
    const userIds = [
      ...new Set(comments.map((c: any) => c.userid)),
    ] as number[];
    let memberMap = new Map<number, any>();
    if (userIds.length > 0) {
      const members =
        await this.postRepo.findActiveCompanyMembersByUserIds(userIds);
      memberMap = new Map(members.map((m: any) => [m.userid, m]));
    }

    const formatted = comments.map((c: any) => {
      const member = memberMap.get(c.userid);
      const userWithMember = c.user
        ? {
            ...c.user,
            companyMembers: member ? [member] : [],
          }
        : null;

      return PostMapper.toCommentResponse({
        ...c,
        user: userWithMember,
      });
    });

    return {
      data: formatted,
      totalComments: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Toggle Like cho bài viết
   */
  async toggleLike(postId: number, userId: number) {
    return withTransaction(async () => {
      const post = await this.postRepo.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Không tìm thấy bài viết');
      }

      const existingLike = await this.postRepo.findLike(postId, userId);

      let isliked = false;
      if (existingLike) {
        await this.postRepo.deleteInteractionById(existingLike.id);
        isliked = false;
      } else {
        await this.postRepo.createLike(postId, userId);
        isliked = true;
      }

      const count = await this.postRepo.countLikesByPostId(postId);

      return {
        postid: postId,
        userid: userId,
        isliked,
        totalLikes: count,
      };
    }, true);
  }

  /**
   * Thêm bình luận vào bài viết kèm tệp đính kèm
   */
  async addComment(
    postId: number,
    userId: number,
    dto: CreateCommentDto,
    files?: Express.Multer.File[],
  ): Promise<CommentResponse> {
    const post = await this.postRepo.findPostById(postId);
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const newComment = await this.uploadAttachments(
      files,
      'IT-JOB/comments',
      (attachments) =>
        withTransaction(async () => {
          const comment = await this.postRepo.createComment(
            PostMapper.toCreateCommentEntity(dto, postId, userId),
          );
          for (const attachment of attachments)
            await this.postRepo.createAttachment({
              ...attachment,
              interactionid: comment.id,
            });
          return comment;
        }),
    );
    const created = await this.postRepo.findInteractionWithDetails(
      newComment.id,
    );
    return PostMapper.toCommentResponse(created);
  }

  /**
   * Cập nhật bình luận
   */
  async updateComment(
    commentId: number,
    currentUser: { id: number; role: string },
    dto: UpdateCommentDto,
    files?: Express.Multer.File[],
  ): Promise<CommentResponse> {
    const comment = await this.postRepo.findInteractionById(commentId);
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (currentUser.role !== 'admin' && comment.userid !== currentUser.id) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa bình luận này',
      );
    }

    const removedUrls = await this.uploadAttachments(
      files,
      'IT-JOB/comments',
      (attachments) =>
        withTransaction(async () => {
          await this.postRepo.updateInteraction(
            commentId,
            PostMapper.toUpdateCommentEntity(dto),
          );
          const existing = await this.postRepo.findAttachmentsByInteractionIds([
            commentId,
          ]);
          const keep = dto.keepImageUrls
            ? Array.isArray(dto.keepImageUrls)
              ? dto.keepImageUrls
              : [dto.keepImageUrls]
            : [];
          const removed = existing.filter((att) => !keep.includes(att.fileurl));
          for (const att of removed)
            await this.postRepo.deleteAttachmentById(att.id);
          for (const attachment of attachments)
            await this.postRepo.createAttachment({
              ...attachment,
              interactionid: commentId,
            });
          return removed.map((att) => att.fileurl);
        }, true),
    );
    await this.cleanupFiles(removedUrls);
    const updated = await this.postRepo.findInteractionWithDetails(commentId);
    return PostMapper.toCommentResponse(updated);
  }

  /**
   * Xóa bình luận
   */
  async deleteComment(
    commentId: number,
    currentUser: { id: number; role: string },
  ) {
    const comment = await this.postRepo.findInteractionById(commentId);
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (currentUser.role !== 'admin' && comment.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    const urls = await withTransaction(async () => {
      const attachments = await this.postRepo.findAttachmentsByInteractionIds([
        commentId,
      ]);
      await this.postRepo.deleteInteractionById(commentId);
      return attachments.map((a) => a.fileurl);
    }, true);
    await this.cleanupFiles(urls);
    return { success: true, message: 'Xóa bình luận thành công' };
  }
}
