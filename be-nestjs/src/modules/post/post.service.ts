import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { orm } from '~/prisma/db.js';
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

@Injectable()
export class PostService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Tối ưu hóa tải thông tin tác giả, công ty, tệp đính kèm và thống kê tương tác theo lô (tránh N+1)
   */
  private async enrichPosts(
    posts: any[],
    currentUserId?: number,
  ): Promise<PostResponseData[]> {
    if (posts.length === 0) return [];
    const postIds = posts.map((p) => p.id);
    const userIds = [...new Set(posts.map((p) => p.userid).filter(Boolean))];
    const companyIds = [
      ...new Set(posts.map((p) => p.companyid).filter(Boolean)),
    ];

    // 1. Tải danh sách tác giả bài viết
    const users = await orm.User.where((u: any) => u.id.in(userIds)).all();
    const userMap = new Map(users.map((u) => [u.id, u]));

    // 2. Tải danh sách công ty liên quan
    let companyMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const companies = await orm.Company.where((c: any) =>
        c.id.in(companyIds),
      ).all();
      companyMap = new Map(companies.map((c) => [c.id, c]));
    }

    // 3. Tải attachments của các bài viết
    const attachments = await orm.Attachment.where((a: any) =>
      a.postid.in(postIds),
    ).all();
    const attachmentMap = new Map<number, any[]>();
    for (const att of attachments) {
      if (att.postid) {
        if (!attachmentMap.has(att.postid)) attachmentMap.set(att.postid, []);
        attachmentMap.get(att.postid)!.push(att);
      }
    }

    // 4. Thống kê likes
    const allLikes = await orm.Interaction.where((i: any) =>
      i.postid.in(postIds),
    )
      .where({ isliked: true })
      .all();
    const likesCountMap = new Map<number, number>();
    const userLikesSet = new Set<number>();
    for (const like of allLikes) {
      likesCountMap.set(
        like.postid,
        (likesCountMap.get(like.postid) || 0) + 1,
      );
      if (currentUserId && like.userid === currentUserId) {
        userLikesSet.add(like.postid);
      }
    }

    // 5. Thống kê và tải bình luận gần đây
    const allComments = await orm.Interaction.where((i: any) =>
      i.postid.in(postIds),
    )
      .where((i: any) => i.content.isNotNull())
      .orderBy((i: any) => i.id.desc())
      .all();

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
      const cUsers = await orm.User.where((u: any) =>
        u.id.in([...commentUserIds]),
      )
        .include('companyMembers')
        .all();
      commentUsersMap = new Map(cUsers.map((u) => [u.id, u]));
    }

    let commentAttachmentsMap = new Map<number, any[]>();
    if (commentIds.length > 0) {
      const cAtts = await orm.Attachment.where((a: any) =>
        a.interactionid.in(commentIds),
      ).all();
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

      return PostMapper.toPostResponse(
        post,
        user,
        company,
        postAttachments,
        {
          totalLikes,
          totalComments,
          islikedByCurrentUser,
          comments: recentComments,
        },
      );
    });
  }

  /**
   * Lấy danh sách bài viết có phân trang
   */
  async getAllPosts(query: PostQueryDto, currentUserId?: number) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize =
      query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || '').trim();

    let countQuery = orm.Post;
    let dataQuery = orm.Post;

    if (keyword) {
      countQuery = countQuery.where((p: any) =>
        p.content.ilike(`%${keyword}%`),
      ) as any;
      dataQuery = dataQuery.where((p: any) =>
        p.content.ilike(`%${keyword}%`),
      ) as any;
    }

    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));

    const rows = await dataQuery
      .orderBy((p: any) => p.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

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
    const post = await orm.Post.where({ id }).first();
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
    const pageSize =
      query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { count } = await orm.Post.where({ userid: userId }).aggregate(
      (a) => ({ count: a.count() }),
    );

    const rows = await orm.Post.where({ userid: userId })
      .orderBy((p: any) => p.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

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
    const pageSize =
      query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { count } = await orm.Post.where({ companyid: companyId }).aggregate(
      (a) => ({ count: a.count() }),
    );

    const rows = await orm.Post.where({ companyid: companyId })
      .orderBy((p: any) => p.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

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
      const company = await orm.Company.where({ id: dto.companyid }).first();
      if (!company) {
        throw new NotFoundException('Công ty không tồn tại');
      }

      const isMember = await orm.CompanyMembers.where({
        companyid: dto.companyid,
        userid: userId,
        status: 'active' as any,
      }).first();

      if (!isMember && company.createdbyuserid !== userId) {
        throw new ForbiddenException(
          'Bạn không có quyền đăng bài đại diện cho công ty này',
        );
      }
    }

    const postEntity = PostMapper.toCreatePostEntity(dto, userId);
    const newPost = await orm.Post.create(postEntity);

    // Upload các tệp đính kèm lên Cloudinary
    if (files && files.length > 0) {
      for (const file of files) {
        const filetype = file.mimetype.startsWith('video/')
          ? 'video'
          : 'image';
        const folder = filetype === 'video' ? 'IT-JOB/posts/videos' : 'IT-JOB/posts/images';
        const uploadRes = await this.cloudinaryService.uploadFile(file, folder);

        await orm.Attachment.create({
          postid: newPost.id as any,
          fileurl: uploadRes.secure_url as any,
          filetype: filetype as any,
        });
      }
    }

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
    const post = await orm.Post.where({ id }).first();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Kiểm tra quyền chỉnh sửa
    if (currentUser.role !== 'admin' && post.userid !== currentUser.id) {
      let isAllowed = false;
      if (post.companyid) {
        const isMember = await orm.CompanyMembers.where({
          companyid: post.companyid,
          userid: currentUser.id,
          status: 'active' as any,
        }).first();
        const isCreator = await orm.Company.where({
          id: post.companyid,
          createdbyuserid: currentUser.id,
        }).first();
        isAllowed = Boolean(isMember || isCreator);
      }

      if (!isAllowed) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
      }
    }

    // Cập nhật thông tin bài viết
    const updatePayload = PostMapper.toUpdatePostEntity(dto);
    await orm.Post.where({ id }).update(updatePayload);

    // Xử lý giữ lại ảnh cũ (keepImageUrls)
    const existingAttachments = await orm.Attachment.where({
      postid: id,
    }).all();
    let keepUrls: string[] = [];
    if (dto.keepImageUrls) {
      keepUrls = Array.isArray(dto.keepImageUrls)
        ? dto.keepImageUrls
        : [dto.keepImageUrls];
    }

    for (const att of existingAttachments) {
      if (!keepUrls.includes(att.fileurl)) {
        if (att.fileurl) {
          await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
        }
        await orm.Attachment.where({ id: att.id }).delete();
      }
    }

    // Upload các tệp mới nếu có
    if (files && files.length > 0) {
      for (const file of files) {
        const filetype = file.mimetype.startsWith('video/')
          ? 'video'
          : 'image';
        const folder = filetype === 'video' ? 'IT-JOB/posts/videos' : 'IT-JOB/posts/images';
        const uploadRes = await this.cloudinaryService.uploadFile(file, folder);

        await orm.Attachment.create({
          postid: id as any,
          fileurl: uploadRes.secure_url as any,
          filetype: filetype as any,
        });
      }
    }

    return this.getPostById(id, currentUser.id);
  }

  /**
   * Xóa bài viết và toàn bộ tệp đính kèm, tương tác liên quan
   */
  async deletePost(id: number, currentUser: { id: number; role: string }) {
    const post = await orm.Post.where({ id }).first();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (currentUser.role !== 'admin' && post.userid !== currentUser.id) {
      let isAllowed = false;
      if (post.companyid) {
        const isMember = await orm.CompanyMembers.where({
          companyid: post.companyid,
          userid: currentUser.id,
          status: 'active' as any,
        }).first();
        const isCreator = await orm.Company.where({
          id: post.companyid,
          createdbyuserid: currentUser.id,
        }).first();
        isAllowed = Boolean(isMember || isCreator);
      }

      if (!isAllowed) {
        throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
      }
    }

    // 1. Dọn dẹp attachments của post trên Cloudinary
    const postAttachments = await orm.Attachment.where({ postid: id }).all();
    for (const att of postAttachments) {
      if (att.fileurl) {
        await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
      }
    }

    // 2. Dọn dẹp attachments của comments trên Cloudinary
    const postComments = await orm.Interaction.where({ postid: id }).all();
    const commentIds = postComments.map((c) => c.id);
    if (commentIds.length > 0) {
      const commentAttachments = await orm.Attachment.where((a: any) =>
        a.interactionid.in(commentIds),
      ).all();
      for (const att of commentAttachments) {
        if (att.fileurl) {
          await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
        }
      }
      await orm.Attachment.where((a: any) =>
        a.interactionid.in(commentIds),
      ).delete();
    }

    // 3. Xóa dữ liệu DB
    await orm.Attachment.where({ postid: id }).delete();
    await orm.Interaction.where({ postid: id }).delete();
    await orm.Post.where({ id }).delete();

    return {
      success: true,
      message: 'Xóa bài viết thành công',
    };
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

    const { count } = await orm.Interaction.where({ postid: postId })
      .where((i: any) => i.content.isNotNull())
      .aggregate((a) => ({ count: a.count() }));

    const comments = await orm.Interaction.where({ postid: postId })
      .where((i: any) => i.content.isNotNull())
      .include('user')
      .include('attachments')
      .orderBy((i: any) => i.id.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    // Nạp thêm thông tin công ty của tác giả bình luận nếu có
    const userIds = [...new Set(comments.map((c) => c.userid))];
    let memberMap = new Map<number, any>();
    if (userIds.length > 0) {
      const members = await orm.CompanyMembers.where((m: any) =>
        m.userid.in(userIds),
      )
        .where({ status: 'active' as any })
        .include('company')
        .all();
      memberMap = new Map(members.map((m) => [m.userid, m]));
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
    const post = await orm.Post.where({ id: postId }).first();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const existingLike = await orm.Interaction.where({
      postid: postId,
      userid: userId,
      isliked: true,
    }).first();

    let isliked = false;
    if (existingLike) {
      await orm.Interaction.where({ id: existingLike.id }).delete();
      isliked = false;
    } else {
      await orm.Interaction.create({
        postid: postId,
        userid: userId,
        isliked: true,
        content: null,
      });
      isliked = true;
    }

    const { count } = await orm.Interaction.where({
      postid: postId,
      isliked: true,
    }).aggregate((a) => ({ count: a.count() }));

    return {
      postid: postId,
      userid: userId,
      isliked,
      totalLikes: count,
    };
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
    const post = await orm.Post.where({ id: postId }).first();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const commentEntity = PostMapper.toCreateCommentEntity(
      dto,
      postId,
      userId,
    );
    const newComment = await orm.Interaction.create(commentEntity);

    // Upload tệp đính kèm bình luận
    if (files && files.length > 0) {
      for (const file of files) {
        const filetype = file.mimetype.startsWith('video/')
          ? 'video'
          : 'image';
        const folder = filetype === 'video' ? 'IT-JOB/comments/videos' : 'IT-JOB/comments/images';
        const uploadRes = await this.cloudinaryService.uploadFile(file, folder);

        await orm.Attachment.create({
          interactionid: newComment.id as any,
          fileurl: uploadRes.secure_url as any,
          filetype: filetype as any,
        });
      }
    }

    const created = await orm.Interaction.where({ id: newComment.id })
      .include('user')
      .include('attachments')
      .first();

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
    const comment = await orm.Interaction.where({ id: commentId }).first();
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (currentUser.role !== 'admin' && comment.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bình luận này');
    }

    const updatePayload = PostMapper.toUpdateCommentEntity(dto);
    await orm.Interaction.where({ id: commentId }).update(updatePayload);

    // Xử lý giữ lại ảnh cũ
    const existingAttachments = await orm.Attachment.where({
      interactionid: commentId,
    }).all();
    let keepUrls: string[] = [];
    if (dto.keepImageUrls) {
      keepUrls = Array.isArray(dto.keepImageUrls)
        ? dto.keepImageUrls
        : [dto.keepImageUrls];
    }

    for (const att of existingAttachments) {
      if (!keepUrls.includes(att.fileurl)) {
        if (att.fileurl) {
          await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
        }
        await orm.Attachment.where({ id: att.id }).delete();
      }
    }

    // Upload tệp mới
    if (files && files.length > 0) {
      for (const file of files) {
        const filetype = file.mimetype.startsWith('video/')
          ? 'video'
          : 'image';
        const folder = filetype === 'video' ? 'IT-JOB/comments/videos' : 'IT-JOB/comments/images';
        const uploadRes = await this.cloudinaryService.uploadFile(file, folder);

        await orm.Attachment.create({
          interactionid: commentId as any,
          fileurl: uploadRes.secure_url as any,
          filetype: filetype as any,
        });
      }
    }

    const updated = await orm.Interaction.where({ id: commentId })
      .include('user')
      .include('attachments')
      .first();

    return PostMapper.toCommentResponse(updated);
  }

  /**
   * Xóa bình luận
   */
  async deleteComment(
    commentId: number,
    currentUser: { id: number; role: string },
  ) {
    const comment = await orm.Interaction.where({ id: commentId }).first();
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (currentUser.role !== 'admin' && comment.userid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    // Xóa tệp đính kèm trên Cloudinary và DB
    const attachments = await orm.Attachment.where({
      interactionid: commentId,
    }).all();
    for (const att of attachments) {
      if (att.fileurl) {
        await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
      }
    }

    await orm.Attachment.where({ interactionid: commentId }).delete();
    await orm.Interaction.where({ id: commentId }).delete();

    return {
      success: true,
      message: 'Xóa bình luận thành công',
    };
  }
}
