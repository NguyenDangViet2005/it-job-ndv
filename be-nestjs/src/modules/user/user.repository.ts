import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class UserRepository {
  async countAll(): Promise<number> {
    const { count } = await orm.User.aggregate((a) => ({
      count: a.count(),
    }));
    return count;
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return orm.User.orderBy((u: any) => u.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findById(id: number) {
    return orm.User.where({ id }).first();
  }

  async findByEmail(email: string) {
    return orm.User.where({ email: email as any }).first();
  }

  async update(id: number, data: any) {
    await orm.User.where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: number) {
    return orm.User.where({ id }).delete();
  }

  async deleteSessionsByUserId(userId: number) {
    return orm.SessionLogins.where({ userid: userId }).deleteAndCount();
  }

  // Skills
  async findUserSkills(userId: number) {
    return orm.SkillUser.where({ userid: userId }).include('skill').all();
  }

  async findSkillById(skillId: number) {
    return orm.Skill.where({ id: skillId }).first();
  }

  async findSkillUser(userId: number, skillId: number) {
    return orm.SkillUser.where({
      userid: userId,
      skillid: skillId,
    }).first();
  }

  async addSkillUser(userId: number, skillId: number) {
    return orm.SkillUser.create({
      userid: userId,
      skillid: skillId,
    });
  }

  async removeSkillUser(userId: number, skillId: number) {
    return orm.SkillUser.where({
      userid: userId,
      skillid: skillId,
    }).delete();
  }

  // Applications
  async countUserApplications(userId: number): Promise<number> {
    const { count } = await orm.Application.where({
      userid: userId,
    }).aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findUserApplications(
    userId: number,
    offset: number = 0,
    limit: number = 10,
  ) {
    return orm.Application.where({ userid: userId })
      .include('job')
      .orderBy((a: any) => a.createdat.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findCompaniesByIds(companyIds: number[]) {
    if (companyIds.length === 0) return [];
    return orm.Company.where((c: any) => c.id.in(companyIds)).all();
  }

  // Posts
  async countUserPosts(userId: number): Promise<number> {
    const { count } = await orm.Post.where({
      userid: userId,
    }).aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findUserPosts(userId: number, offset: number = 0, limit: number = 10) {
    return orm.Post.where({ userid: userId })
      .include('attachments')
      .include('company')
      .orderBy((p: any) => p.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }

  async findUserPostIds(userId: number) {
    const posts = await orm.Post.where({ userid: userId }).all();
    return posts.map((p) => p.id);
  }

  async countUserMedia(postIds: number[]): Promise<number> {
    if (postIds.length === 0) return 0;
    const { count } = await orm.Attachment.where((att: any) =>
      att.postid.in(postIds),
    )
      .where((att: any) => att.filetype.in(['image', 'video']))
      .aggregate((a) => ({ count: a.count() }));
    return count;
  }

  async findUserMedia(
    postIds: number[],
    offset: number = 0,
    limit: number = 6,
  ) {
    if (postIds.length === 0) return [];
    return orm.Attachment.where((att: any) => att.postid.in(postIds))
      .where((att: any) => att.filetype.in(['image', 'video']))
      .orderBy((att: any) => att.id.desc())
      .offset(offset)
      .limit(limit)
      .all();
  }
}
