import { createHash } from 'node:crypto';
import { Temporal } from '@js-temporal/polyfill';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { vi } from 'vitest';
import { orm } from '../../prisma/db.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import {
  useDatabaseFixtures,
  expectSqlState,
} from '../../../test/integration/fixtures.js';

const context = useDatabaseFixtures();
const repo = new AuthRepository();
const jwt = new JwtService();
const service = new AuthService(repo, jwt);
const password = 'Integration-password-123';
const hash = (token: string) =>
  createHash('sha256').update(token).digest('hex');
const register = () =>
  service.register({
    email: `${context.prefix}-auth@test.local`,
    fullname: ' Test User ',
    password,
  });
const login = async () => {
  const user = await register();
  return service.login({ email: user.email, password });
};

beforeEach(() => {
  vi.stubEnv('JWT_ACCESS_SECRET', 'integration-access-secret');
  vi.stubEnv('JWT_REFRESH_SECRET', 'integration-refresh-secret');
  vi.stubEnv('JWT_ACCESS_EXPIRES_IN', '15m');
  vi.stubEnv('JWT_REFRESH_EXPIRES_IN', '7d');
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Auth service + bcrypt + JWT + PostgreSQL', () => {
  it('registers a normalized account with a real password hash and a safe response', async () => {
    const result = await service.register({
      email: ` ${context.prefix.toUpperCase()}-AUTH@TEST.LOCAL `,
      fullname: ' Test User ',
      password,
    });
    const stored = await repo.findUserById(result.id);
    expect(result).toMatchObject({
      email: `${context.prefix}-auth@test.local`,
      fullname: 'Test User',
      role: 'user',
    });
    expect(result).not.toHaveProperty('password');
    expect(stored!.password).not.toBe(password);
    expect(await bcrypt.compare(password, stored!.password!)).toBe(true);
    await expect(
      service.register({
        email: result.email.toUpperCase(),
        fullname: 'Duplicate',
        password,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with real JWTs and stores only a SHA-256 refresh token hash', async () => {
    const result = await login();
    expect(
      jwt.verify(result.accesstoken, { secret: process.env.JWT_ACCESS_SECRET }),
    ).toMatchObject({ id: result.user.id, role: 'user' });
    expect(
      jwt.verify(result.refreshtoken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ).toMatchObject({ id: result.user.id });
    expect(result.user).not.toHaveProperty('password');
    const sessions = await repo.findActiveSessionsByUserId(result.user.id);
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      refreshtoken: hash(result.refreshtoken),
      isused: false,
      isrevoked: false,
    });
  });

  it('rejects incorrect credentials without creating a session', async () => {
    const user = await register();
    await expect(
      service.login({ email: user.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(await repo.findActiveSessionsByUserId(user.id)).toEqual([]);
  });

  it('rotates a refresh token atomically inside the same token family', async () => {
    const loggedIn = await login();
    const old = await repo.findSessionByRefreshToken(
      hash(loggedIn.refreshtoken),
    );
    const rotated = await service.refreshToken(loggedIn.refreshtoken);
    expect(rotated.refreshtoken).not.toBe(loggedIn.refreshtoken);
    expect(
      await repo.findSessionByRefreshToken(hash(loggedIn.refreshtoken)),
    ).toMatchObject({ isused: true });
    expect(
      await repo.findSessionByRefreshToken(hash(rotated.refreshtoken)),
    ).toMatchObject({ family: old!.family, isused: false, isrevoked: false });
    expect(
      await repo.findActiveSessionsByUserId(loggedIn.user.id),
    ).toHaveLength(1);
  });

  it('revokes the whole token family on reuse after the grace period', async () => {
    const loggedIn = await login();
    const rotated = await service.refreshToken(loggedIn.refreshtoken);
    const old = await repo.findSessionByRefreshToken(
      hash(loggedIn.refreshtoken),
    );
    await orm.SessionLogins.where({ id: old!.id }).update({
      updatedat: Temporal.Now.plainDateTimeISO().subtract({ seconds: 20 }),
    });
    await expect(
      service.refreshToken(loggedIn.refreshtoken),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(
      await repo.findSessionByRefreshToken(hash(rotated.refreshtoken)),
    ).toMatchObject({ isrevoked: true });
    await expect(
      service.refreshToken(rotated.refreshtoken),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('logout revokes one family and keeps another device logged in', async () => {
    const first = await login();
    const second = await service.login({ email: first.user.email, password });
    await service.logout(first.refreshtoken);
    expect(
      await repo.findSessionByRefreshToken(hash(first.refreshtoken)),
    ).toMatchObject({ isrevoked: true });
    expect(
      await repo.findSessionByRefreshToken(hash(second.refreshtoken)),
    ).toMatchObject({ isrevoked: false });
    await service.logoutAll(first.user.id);
    expect(
      await orm.SessionLogins.where({ userid: first.user.id }).all(),
    ).toEqual([]);
  });

  it('registers an employer, company, membership and login session together', async () => {
    const { ward, province } = context.fixture;
    const result = await service.registerHR({
      email: `${context.prefix}-hr@test.local`,
      password,
      fullname: 'Employer',
      phone: '0901234567',
      companyName: `${context.prefix}-hr-company`,
      wardid: ward.id,
      provinceid: province.id,
    });
    expect(await repo.findUserById(result.user.id)).toMatchObject({
      role: 'employer',
    });
    expect(
      await orm.Company.where({ id: result.company.id }).first(),
    ).toMatchObject({ createdbyuserid: result.user.id, wardid: ward.id });
    expect(
      await orm.CompanyMembers.where({
        companyid: result.company.id,
        userid: result.user.id,
      }).first(),
    ).toMatchObject({ status: 'active' });
    expect(await repo.findActiveSessionsByUserId(result.user.id)).toHaveLength(
      1,
    );
  });

  it('rolls back the employer account when inserting its company fails', async () => {
    const { ward, province } = context.fixture;
    const email = `${context.prefix}-hr@test.local`;
    await expectSqlState(
      service.registerHR({
        email,
        password,
        fullname: 'Employer',
        phone: '0901234567',
        companyName: `${context.prefix}-${'x'.repeat(160)}`,
        wardid: ward.id,
        provinceid: province.id,
      }),
      '22001',
    );
    expect(await repo.findUserByEmail(email)).toBeNull();
    expect(
      await orm.Company.where((c) => c.name.ilike(`${context.prefix}%`)).all(),
    ).toHaveLength(1);
  });

  it('links a verified OAuth profile to an existing account without duplicating users', async () => {
    const { candidate } = context.fixture;
    const profile = {
      provider: 'google' as const,
      providerId: `${context.prefix}-google`,
      email: candidate.email,
      fullname: 'OAuth User',
      avatar: null,
    };
    expect(await service.validateOAuthUser(profile)).toMatchObject({
      id: candidate.id,
      provider: 'google',
      providerid: profile.providerId,
    });
    expect(await service.validateOAuthUser(profile)).toMatchObject({
      id: candidate.id,
    });
    expect(
      await repo.findUserByProvider('google', profile.providerId),
    ).toMatchObject({ id: candidate.id });
  });

  it('claims a session exactly once under concurrent refresh claims', async () => {
    const loggedIn = await login();
    const session = await repo.findSessionByRefreshToken(
      hash(loggedIn.refreshtoken),
    );
    const results = await Promise.all([
      repo.markTokenUsed(session!.id),
      repo.markTokenUsed(session!.id),
    ]);
    expect(results.sort((a, b) => a - b)).toEqual([0, 1]);
    expect(await repo.findActiveSessionsByUserId(loggedIn.user.id)).toEqual([]);
  });
});
