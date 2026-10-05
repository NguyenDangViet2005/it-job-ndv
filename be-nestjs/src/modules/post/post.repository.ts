import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class PostRepository {
  async countPosts(keyword?: string): Promise<number> {
    let countQuery = orm.Post;
    if (keyword) {
      countQuery = countQuery.where((p: any) =>
        p.content.ilike(`%${keyword}%`),
      ) as any;
    }
    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findPosts(keyword?: string, offset: number = 0, limit: number = 10) {
    let dataQuery = orm.Post;
    if (keyword) {
      dataQuery = dataQuery.where((p: any) =>
        p.content.ilike(`%${keyword}%`),
      ) as any;
    }
    return dataQuery
      .orderBy((p: any) => p.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findPostById(id: number) {
    return orm.Post.where({ id }).first();
  }

  async countPostsByUserId(userId: number): Promise<number> {
    const { count } = await orm.Post.where({ userid: userId }).aggregate(
      (a) => ({ count: a.count() }),
    );
    return count;
  }

  async findPostsByUserId(userId: number, offset: number = 0, limit: number = 10) {
    return orm.Post.where({ userid: userId })
      .orderBy((p: any) => p.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async countPostsByCompanyId(companyId: number): Promise<number> {
    const { count } = await orm.Post.where({ companyid: companyId }).aggregate(
      (a) => ({ count: a.count() }),
    );
    return count;
  }

  async findPostsByCompanyId(companyId: number, offset: number = 0, limit: number = 10) {
    return orm.Post.where({ companyid: companyId })
      .orderBy((p: any) => p.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async createPost(data: any) {
    return orm.Post.create(data);
  }

  async updatePost(id: number, data: any) {
    return orm.Post.where({ id }).update(data);
  }

  async deletePost(id: number) {
    return orm.Post.where({ id }).delete();
  }

  // Relations & Enriches
  async findUsersByIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.User.where((u: any) => u.id.in(userIds)).all();
  }

  async findUsersWithCompanyMembersByIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.User.where((u: any) => u.id.in(userIds))
      .include('companyMembers')
      .all();
  }

  async findCompaniesByIds(companyIds: number[]) {
    if (companyIds.length === 0) return [];
    return orm.Company.where((c: any) => c.id.in(companyIds)).all();
  }

  async findCompanyById(companyId: number) {
    return orm.Company.where({ id: companyId }).first();
  }

  async findCompanyMember(companyId: number, userId: number) {
    return orm.CompanyMembers.where({
      companyid: companyId,
      userid: userId,
      status: 'active' as any,
    }).first();
  }

  async findActiveCompanyMembersByUserIds(userIds: number[]) {
    if (userIds.length === 0) return [];
    return orm.CompanyMembers.where((m: any) => m.userid.in(userIds))
      .where({ status: 'active' as any })
      .include('company')
      .all();
  }

  // Attachments
  async findAttachmentsByPostIds(postIds: number[]) {
    if (postIds.length === 0) return [];
    return orm.Attachment.where((a: any) => a.postid.in(postIds)).all();
  }

  async findAttachmentsByPostId(postId: number) {
    return orm.Attachment.where({ postid: postId }).all();
  }

  async findAttachmentsByInteractionIds(interactionIds: number[]) {
    if (interactionIds.length === 0) return [];
    return orm.Attachment.where((a: any) =>
      a.interactionid.in(interactionIds),
    ).all();
  }

  async createAttachment(data: any) {
    return orm.Attachment.create(data);
  }

  async deleteAttachmentById(id: number) {
    return orm.Attachment.where({ id }).delete();
  }

  async deleteAttachmentsByPostId(postId: number) {
    return orm.Attachment.where({ postid: postId }).delete();
  }

  async deleteAttachmentsByInteractionIds(interactionIds: number[]) {
    if (interactionIds.length === 0) return;
    return orm.Attachment.where((a: any) =>
      a.interactionid.in(interactionIds),
    ).delete();
  }

  async deleteAttachmentsByInteractionId(interactionId: number) {
    return orm.Attachment.where({ interactionid: interactionId }).delete();
  }

  // Interactions (Likes & Comments)
  async findLikesByPostIds(postIds: number[]) {
    if (postIds.length === 0) return [];
    return orm.Interaction.where((i: any) => i.postid.in(postIds))
      .where({ isliked: true })
      .all();
  }

  async findCommentsByPostIds(postIds: number[]) {
    if (postIds.length === 0) return [];
    return orm.Interaction.where((i: any) => i.postid.in(postIds))
      .where((i: any) => i.content.isNotNull())
      .orderBy((i: any) => i.id.desc())
      .all();
  }

  async countLikesByPostId(postId: number): Promise<number> {
    const { count } = await orm.Interaction.where({
      postid: postId,
      isliked: true,
    }).aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findLike(postId: number, userId: number) {
    return orm.Interaction.where({
      postid: postId,
      userid: userId,
      isliked: true,
    }).first();
  }

  async createLike(postId: number, userId: number) {
    return orm.Interaction.create({
      postid: postId,
      userid: userId,
      isliked: true,
      content: null,
    });
  }

  async deleteInteractionById(id: number) {
    return orm.Interaction.where({ id }).delete();
  }

  async deleteInteractionsByPostId(postId: number) {
    return orm.Interaction.where({ postid: postId }).delete();
  }

  async countCommentsByPostId(postId: number): Promise<number> {
    const { count } = await orm.Interaction.where({ postid: postId })
      .where((i: any) => i.content.isNotNull())
      .aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findCommentsByPostId(postId: number, offset: number = 0, limit: number = 10) {
    return orm.Interaction.where({ postid: postId })
      .where((i: any) => i.content.isNotNull())
      .include('user')
      .include('attachments')
      .orderBy((i: any) => i.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findInteractionsByPostId(postId: number) {
    return orm.Interaction.where({ postid: postId }).all();
  }

  async findInteractionById(id: number) {
    return orm.Interaction.where({ id }).first();
  }

  async findInteractionWithDetails(id: number) {
    return orm.Interaction.where({ id })
      .include('user')
      .include('attachments')
      .first();
  }

  async createComment(data: any) {
    return orm.Interaction.create(data);
  }

  async updateInteraction(id: number, data: any) {
    return orm.Interaction.where({ id }).update(data);
  }
}
