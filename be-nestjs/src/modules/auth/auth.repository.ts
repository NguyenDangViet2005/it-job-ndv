import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class AuthRepository {
  async findUserByEmail(email: string) {
    return orm.User.where({ email: email.toLowerCase().trim() as any }).first();
  }

  async findUserById(id: number) {
    return orm.User.where({ id }).first();
  }

  async findUserByProvider(provider: string, providerId: string) {
    return orm.User.where({
      provider: provider as any,
      providerid: providerId as any,
    }).first();
  }

  async createUser(data: any) {
    return orm.User.create(data);
  }

  async updateUser(id: number, data: any) {
    await orm.User.where({ id }).update(data);
    return this.findUserById(id);
  }

  async deleteUser(id: number) {
    return orm.User.where({ id }).delete();
  }

  async findWardWithProvince(wardId: number) {
    return orm.Wards
      .where({ id: wardId })
      .include('provinces')
      .first();
  }

  async createCompany(data: any) {
    return orm.Company.create(data);
  }

  async createCompanyMember(data: any) {
    return orm.CompanyMembers.create(data);
  }

  // Session logins with Token Family & Rotation
  async findSessionByRefreshToken(refreshToken: string) {
    return orm.SessionLogins.where({
      refreshtoken: refreshToken,
    }).first();
  }

  async findActiveSessionsByUserId(userId: number) {
    return orm.SessionLogins
      .where({ userid: userId, isrevoked: false })
      .orderBy((s: any) => s.id.desc())
      .all();
  }

  async createSession(data: {
    userid: number;
    refreshtoken: string;
    family: string;
    isused?: boolean;
    isrevoked?: boolean;
    expiresat?: Date;
  }) {
    return orm.SessionLogins.create({
      userid: data.userid,
      refreshtoken: data.refreshtoken,
      family: data.family,
      isused: data.isused ?? false,
      isrevoked: data.isrevoked ?? false,
      expiresat: data.expiresat as any,
    });
  }

  async markTokenUsed(id: number) {
    return orm.SessionLogins.where({ id }).update({
      isused: true,
      updatedat: new Date() as any,
    });
  }

  async revokeFamily(family: string) {
    return orm.SessionLogins.where({ family }).update({
      isrevoked: true,
      updatedat: new Date() as any,
    });
  }

  async deleteSessionById(id: number) {
    return orm.SessionLogins.where({ id }).delete();
  }

  async revokeSessionByRefreshToken(refreshToken: string) {
    return orm.SessionLogins.where({
      refreshtoken: refreshToken,
    }).update({
      isrevoked: true,
      updatedat: new Date() as any,
    });
  }

  async deleteSessionsByUserId(userId: number) {
    return orm.SessionLogins.where({ userid: userId }).delete();
  }
}
