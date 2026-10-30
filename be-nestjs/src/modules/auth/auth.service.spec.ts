import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import { Temporal } from '@js-temporal/polyfill';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import type { AuthRepository } from './auth.repository.js';

vi.mock('~/prisma/db.js', () => ({
  withTransaction: vi.fn(async (work: () => Promise<unknown>) => work()),
}));
vi.mock('bcryptjs', () => ({ default: { hash: vi.fn(), compare: vi.fn() } }));

describe('AuthService', () => {
  const repo = {
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    findWardWithProvince: vi.fn(),
    createCompany: vi.fn(),
    createCompanyMember: vi.fn(),
    findSessionByRefreshToken: vi.fn(),
    markTokenUsed: vi.fn(),
    createSession: vi.fn(),
    revokeFamily: vi.fn(),
    findActiveSessionsByUserId: vi.fn(),
    deleteSessionsByUserId: vi.fn(),
    findUserByProvider: vi.fn(),
  };
  const jwt = { sign: vi.fn(), verify: vi.fn() };
  const user = {
    id: 1,
    email: 'an@test.local',
    fullname: 'An',
    role: 'user',
    password: 'stored-hash',
    refreshtoken: 'secret-token',
    providerid: 'secret-provider',
    avatar: 'avatar.png',
  };
  const session = {
    id: 5,
    userid: 1,
    family: 'family-1',
    isused: false,
    isrevoked: false,
  };
  const registerDto = {
    email: ' AN@Test.local ',
    password: 'password123',
    fullname: ' An ',
  };
  const hrDto = {
    ...registerDto,
    phone: '0901234567',
    companyName: ' Acme ',
    provinceid: 10,
    wardid: 20,
  };
  const hash = (token: string) =>
    createHash('sha256').update(token).digest('hex');
  // Match local ORM timestamps, preserving milliseconds on every host timezone.
  const timestampAgo = (milliseconds: number) =>
    Temporal.Instant.fromEpochMilliseconds(Date.now() - milliseconds)
      .toZonedDateTimeISO(Temporal.Now.timeZoneId())
      .toPlainDateTime();
  let service: AuthService;

  beforeEach(() => {
    vi.resetAllMocks();
    // Fake timers make expiry boundaries deterministic and avoid leaking the cleanup interval.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-24T05:00:00Z'));
    vi.stubEnv('JWT_ACCESS_SECRET', 'unit-test-access-secret');
    vi.stubEnv('JWT_REFRESH_SECRET', 'unit-test-refresh-secret');
    vi.stubEnv('JWT_ACCESS_EXPIRES_IN', '15m');
    vi.stubEnv('JWT_REFRESH_EXPIRES_IN', '7d');
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('CLIENT_URL', 'http://localhost:3000');
    service = new AuthService(
      repo as unknown as AuthRepository,
      jwt as unknown as JwtService,
    );
    repo.findUserById.mockResolvedValue(user);
    repo.createUser.mockResolvedValue(user);
    repo.findActiveSessionsByUserId.mockResolvedValue([]);
    repo.findSessionByRefreshToken.mockResolvedValue(session);
    repo.markTokenUsed.mockResolvedValue(1);
    jwt.verify.mockReturnValue({ id: 1 });
    jwt.sign.mockImplementation(
      (_payload: unknown, options: { secret: string }) =>
        options.secret === 'unit-test-access-secret'
          ? 'access-token'
          : 'refresh-token',
    );
    vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('normalizes email, hashes the password and excludes secrets', async () => {
      const result = await service.register(registerDto);
      expect(repo.findUserByEmail).toHaveBeenCalledWith('an@test.local');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(repo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'an@test.local',
          password: 'new-hash',
          fullname: 'An',
        }),
      );
      expect(result).toMatchObject({ id: 1, email: user.email });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshtoken');
    });

    it('rejects an existing email before hashing or writing', async () => {
      repo.findUserByEmail.mockResolvedValue(user);
      await expect(service.register(registerDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(repo.createUser).not.toHaveBeenCalled();
    });
  });

  describe('registerHR', () => {
    it('rejects an existing email without creating a company', async () => {
      repo.findUserByEmail.mockResolvedValue(user);
      await expect(service.registerHR(hrDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repo.createCompany).not.toHaveBeenCalled();
    });

    it.each([null, { id: 20, provinceid: 99 }])(
      'rejects a missing ward or mismatched province',
      async (ward) => {
        repo.findWardWithProvince.mockResolvedValue(ward);
        await expect(service.registerHR(hrDto)).rejects.toBeInstanceOf(
          BadRequestException,
        );
        expect(repo.createUser).not.toHaveBeenCalled();
        expect(repo.createCompany).not.toHaveBeenCalled();
      },
    );

    it('creates the employer, company, active membership and hashed session', async () => {
      repo.findWardWithProvince.mockResolvedValue({
        id: 20,
        provinceid: 10,
        name: 'Ward',
        provinces: { name: 'Province' },
      });
      repo.createUser.mockResolvedValue({ ...user, role: 'employer' });
      repo.createCompany.mockResolvedValue({
        id: 30,
        name: 'Acme',
        wardid: 20,
        createdbyuserid: 1,
      });
      const result = await service.registerHR(hrDto);
      expect(repo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'employer' }),
      );
      expect(repo.createCompany).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Acme', createdbyuserid: 1 }),
      );
      expect(repo.createCompanyMember).toHaveBeenCalledWith(
        expect.objectContaining({ companyid: 30, userid: 1, status: 'active' }),
      );
      expect(repo.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          userid: 1,
          refreshtoken: hash('refresh-token'),
        }),
      );
      expect(result.company).toMatchObject({
        id: 30,
        wardname: 'Ward',
        provincename: 'Province',
      });
      expect(result.user).not.toHaveProperty('password');
    });

    it('propagates membership failures without creating a login session', async () => {
      repo.findWardWithProvince.mockResolvedValue({ provinceid: 10 });
      repo.createCompany.mockResolvedValue({ id: 30 });
      const error = new Error('membership failed');
      repo.createCompanyMember.mockRejectedValue(error);
      await expect(service.registerHR(hrDto)).rejects.toBe(error);
      expect(repo.createSession).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it.each([null, { ...user, password: null }])(
      'rejects missing users and OAuth-only users',
      async (account) => {
        repo.findUserByEmail.mockResolvedValue(account);
        await expect(service.login(registerDto)).rejects.toBeInstanceOf(
          UnauthorizedException,
        );
        expect(repo.createSession).not.toHaveBeenCalled();
      },
    );

    it('rejects an incorrect password without issuing tokens', async () => {
      repo.findUserByEmail.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(service.login(registerDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(repo.createSession).not.toHaveBeenCalled();
    });

    it('issues tokens with the correct secrets and stores only a refresh token hash', async () => {
      repo.findUserByEmail.mockResolvedValue(user);
      const result = await service.login(registerDto);
      expect(repo.findUserByEmail).toHaveBeenCalledWith('an@test.local');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, email: user.email, role: 'user' },
        { secret: 'unit-test-access-secret', expiresIn: '15m' },
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({
          secret: 'unit-test-refresh-secret',
          expiresIn: '7d',
          jwtid: expect.any(String),
        }),
      );
      expect(repo.createSession).toHaveBeenCalledWith({
        userid: 1,
        refreshtoken: hash('refresh-token'),
        family: expect.any(String),
      });
      expect(result).toMatchObject({
        accesstoken: 'access-token',
        refreshtoken: 'refresh-token',
      });
      for (const field of ['password', 'refreshtoken', 'providerid'])
        expect(result.user).not.toHaveProperty(field);
    });

    it('keeps four existing token families and revokes older families once each', async () => {
      repo.findUserByEmail.mockResolvedValue(user);
      repo.findActiveSessionsByUserId.mockResolvedValue([
        { family: 'newest' },
        { family: 'newest' },
        { family: 'second' },
        { family: 'third' },
        { family: 'fourth' },
        { family: 'oldest' },
        { family: 'oldest' },
      ]);
      await service.login(registerDto);
      expect(repo.revokeFamily.mock.calls).toEqual([['oldest']]);
    });
  });

  describe('refreshToken', () => {
    it('rejects an empty token before verifying it', async () => {
      await expect(service.refreshToken('')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('rejects an invalid or expired JWT before reading sessions', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('expired');
      });
      await expect(service.refreshToken('old-token')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(repo.findSessionByRefreshToken).not.toHaveBeenCalled();
    });

    it.each([null, { ...session, isrevoked: true }])(
      'rejects missing or revoked sessions',
      async (record) => {
        repo.findSessionByRefreshToken.mockResolvedValue(record);
        await expect(service.refreshToken('old-token')).rejects.toBeInstanceOf(
          UnauthorizedException,
        );
        expect(repo.markTokenUsed).not.toHaveBeenCalled();
        expect(repo.createSession).not.toHaveBeenCalled();
      },
    );

    it('rotates a refresh token while preserving its family', async () => {
      await expect(service.refreshToken('old-token')).resolves.toMatchObject({
        accesstoken: 'access-token',
        refreshtoken: 'refresh-token',
      });
      expect(repo.findSessionByRefreshToken).toHaveBeenCalledWith(
        hash('old-token'),
      );
      expect(repo.markTokenUsed).toHaveBeenCalledWith(5);
      expect(repo.createSession).toHaveBeenCalledWith({
        userid: 1,
        refreshtoken: hash('refresh-token'),
        family: 'family-1',
      });
      expect(repo.revokeFamily).not.toHaveBeenCalled();
    });

    it('rejects when a concurrent operation already claimed the token', async () => {
      repo.markTokenUsed.mockResolvedValue(0);
      await expect(service.refreshToken('old-token')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(repo.createSession).not.toHaveBeenCalled();
    });

    it('rejects a token whose user no longer exists', async () => {
      repo.findUserById.mockResolvedValue(null);
      await expect(service.refreshToken('old-token')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(repo.markTokenUsed).not.toHaveBeenCalled();
    });

    it('allows reuse within 15 seconds without revoking or creating a session', async () => {
      repo.findSessionByRefreshToken.mockResolvedValue({
        ...session,
        isused: true,
        updatedat: timestampAgo(14999),
      });
      await expect(service.refreshToken('old-token')).resolves.toMatchObject({
        accesstoken: 'access-token',
        refreshtoken: 'old-token',
      });
      expect(repo.revokeFamily).not.toHaveBeenCalled();
      expect(repo.createSession).not.toHaveBeenCalled();
    });

    it.each([15000, 15001])(
      'revokes the whole family for reuse after %i ms',
      async (age) => {
        repo.findSessionByRefreshToken.mockResolvedValue({
          ...session,
          isused: true,
          updatedat: timestampAgo(age),
        });
        await expect(service.refreshToken('old-token')).rejects.toBeInstanceOf(
          UnauthorizedException,
        );
        expect(repo.revokeFamily).toHaveBeenCalledWith('family-1');
        expect(repo.createSession).not.toHaveBeenCalled();
      },
    );
  });

  describe('logout', () => {
    it('revokes the family for the supplied token', async () => {
      await expect(service.logout('refresh-token')).resolves.toMatchObject({
        success: true,
      });
      expect(repo.findSessionByRefreshToken).toHaveBeenCalledWith(
        hash('refresh-token'),
      );
      expect(repo.revokeFamily).toHaveBeenCalledWith('family-1');
    });

    it('succeeds without a token', async () => {
      await expect(service.logout()).resolves.toMatchObject({ success: true });
      expect(repo.findSessionByRefreshToken).not.toHaveBeenCalled();
    });

    it('still succeeds when the database fails', async () => {
      repo.findSessionByRefreshToken.mockRejectedValue(
        new Error('database failed'),
      );
      await expect(service.logout('token')).resolves.toMatchObject({
        success: true,
      });
    });

    it('deletes all sessions when logging out all devices', async () => {
      await service.logoutAll(1);
      expect(repo.deleteSessionsByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('OAuth', () => {
    const profile = {
      provider: 'google' as const,
      providerId: 'google-123',
      email: 'an@test.local',
      fullname: 'An',
      avatar: 'new-avatar',
    };

    it('updates an existing provider avatar without overwriting a nonempty name', async () => {
      repo.findUserByProvider.mockResolvedValue(user);
      repo.updateUser.mockResolvedValue({ ...user, avatar: 'new-avatar' });
      await service.validateOAuthUser(profile);
      expect(repo.updateUser).toHaveBeenCalledWith(1, { avatar: 'new-avatar' });
      expect(repo.createUser).not.toHaveBeenCalled();
    });

    it('returns a matching provider user without unnecessary writes', async () => {
      repo.findUserByProvider.mockResolvedValue({
        ...user,
        avatar: 'new-avatar',
      });
      await expect(service.validateOAuthUser(profile)).resolves.toMatchObject({
        id: 1,
      });
      expect(repo.updateUser).not.toHaveBeenCalled();
    });

    it('links an existing email account to the provider', async () => {
      repo.findUserByEmail.mockResolvedValue(user);
      repo.updateUser.mockResolvedValue(user);
      await service.validateOAuthUser(profile);
      expect(repo.updateUser).toHaveBeenCalledWith(1, {
        provider: 'google',
        providerid: 'google-123',
      });
      expect(repo.createUser).not.toHaveBeenCalled();
    });

    it('creates an OAuth user with a normalized email and no password', async () => {
      await service.validateOAuthUser({ ...profile, email: ' AN@Test.local ' });
      expect(repo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'an@test.local',
          password: null,
          provider: 'google',
          role: 'user',
        }),
      );
    });

    it('uses fallback identity fields when the provider supplies none', async () => {
      await service.validateOAuthUser({
        ...profile,
        email: null,
        fullname: null,
        avatar: null,
      });
      expect(repo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'google-123@google.com',
          fullname: 'Google User',
          avatar: expect.any(String),
        }),
      );
    });

    it('exchanges a code once, creating a hashed login session', async () => {
      const code = service.createOAuthExchangeCode(1);
      await expect(service.exchangeOAuthCode(code)).resolves.toMatchObject({
        accesstoken: 'access-token',
        refreshtoken: 'refresh-token',
      });
      expect(repo.createSession).toHaveBeenCalledWith(
        expect.objectContaining({ refreshtoken: hash('refresh-token') }),
      );
      await expect(service.exchangeOAuthCode(code)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(repo.createSession).toHaveBeenCalledTimes(1);
    });

    it('rejects expired codes without creating a session', async () => {
      const code = service.createOAuthExchangeCode(1);
      vi.setSystemTime(Date.now() + 60001);
      await expect(service.exchangeOAuthCode(code)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(repo.createSession).not.toHaveBeenCalled();
    });

    it('rejects an empty code', async () => {
      await expect(service.exchangeOAuthCode('')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects unknown codes', async () => {
      await expect(service.exchangeOAuthCode('unknown')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects an exchange if the user was deleted', async () => {
      repo.findUserById.mockResolvedValue(null);
      await expect(
        service.exchangeOAuthCode(service.createOAuthExchangeCode(1)),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(repo.createSession).not.toHaveBeenCalled();
    });

    it('redirects with an exchange code and strips trailing slashes from the client URL', async () => {
      vi.stubEnv('CLIENT_URL', 'https://client.test///');
      const { redirectUrl } = await service.handleOAuthCallback(user);
      const url = new URL(redirectUrl);
      expect(url.origin + url.pathname).toBe('https://client.test/callback');
      expect([...url.searchParams.keys()]).toEqual(['code']);
      await expect(
        service.exchangeOAuthCode(url.searchParams.get('code')!),
      ).resolves.toHaveProperty('accesstoken');
    });

    it('redirects failed authentication back to login', async () => {
      await expect(service.handleOAuthCallback(null)).resolves.toEqual({
        redirectUrl: 'http://localhost:3000/dang-nhap?error=oauth_failed',
      });
      expect(repo.createSession).not.toHaveBeenCalled();
    });
  });

  it.each([
    [false, false, true],
    [true, false, false],
    [false, true, false],
  ])(
    'validates session flags revoked=%s used=%s',
    async (isrevoked, isused, expected) => {
      repo.findSessionByRefreshToken.mockResolvedValue({
        ...session,
        isrevoked,
        isused,
      });
      await expect(service.validateRefreshTokenSession('token')).resolves.toBe(
        expected,
      );
    },
  );

  it('returns false for invalid refresh JWTs', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('bad token');
    });
    await expect(service.validateRefreshTokenSession('token')).resolves.toBe(
      false,
    );
    expect(repo.findSessionByRefreshToken).not.toHaveBeenCalled();
  });
});
