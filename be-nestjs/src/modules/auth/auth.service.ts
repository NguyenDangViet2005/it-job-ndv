import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';
import { DEFAULT_USER_AVATAR } from '~/common/constants/index.js';
import crypto from 'node:crypto';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterHRDto } from './dto/register-hr.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthMapper } from './auth.mapper.js';
import { AuthRepository } from './auth.repository.js';

@Injectable()
export class AuthService {
  private readonly oauthExchangeCodes = new Map<
    string,
    { userId: number; expiresAt: number }
  >();

  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [code, entry] of this.oauthExchangeCodes.entries()) {
        if (now > entry.expiresAt) {
          this.oauthExchangeCodes.delete(code);
        }
      }
    }, 60 * 1000);
    cleanupInterval.unref?.();
  }

  private generateTokens(userid: number, role: string, email: string) {
    const payload = { id: userid, role, email };

    const accesstoken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
    });

    const refreshtoken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    return { accesstoken, refreshtoken };
  }

  /**
   * Băm một chiều Refresh Token bằng SHA-256 trước khi lưu vào Database
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.authRepo.findUserByEmail(email);
    if (existing) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userEntity = AuthMapper.toCreateUserEntity(dto, hashedPassword);
    const newUser = await this.authRepo.createUser(userEntity);

    return {
      id: newUser.id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
      avatar: newUser.avatar || DEFAULT_USER_AVATAR,
    };
  }

  async registerHR(dto: RegisterHRDto) {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.authRepo.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    // Kiểm tra tính hợp lệ của địa chỉ xã/phường & tỉnh/thành
    const ward = await this.authRepo.findWardWithProvince(dto.wardid);

    if (!ward) {
      throw new BadRequestException('Phường/Xã được chọn không tồn tại');
    }

    if (dto.provinceid && ward.provinceid !== dto.provinceid) {
      throw new BadRequestException('Phường/Xã không thuộc Tỉnh/Thành phố đã chọn');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    let createdUserId: number | null = null;

    try {
      // 1. Tạo tài khoản người dùng với vai trò employer
      const userPayload = AuthMapper.toCreateHREmployerEntity(dto, hashedPassword);
      const newUser = await this.authRepo.createUser(userPayload);
      createdUserId = newUser.id;

      // 2. Tạo công ty liên kết với nhà tuyển dụng
      const companyPayload = AuthMapper.toCreateHRCompanyEntity(dto, newUser.id);
      const newCompany = await this.authRepo.createCompany(companyPayload);

      // 3. Tạo thành viên công ty (CompanyMembers)
      const memberPayload = AuthMapper.toCreateHRCompanyMemberEntity(newCompany.id, newUser.id);
      await this.authRepo.createCompanyMember(memberPayload);

      // 4. Tạo token và phiên đăng nhập
      const { accesstoken, refreshtoken } = this.generateTokens(
        newUser.id,
        'employer',
        newUser.email,
      );

      const family = crypto.randomUUID();
      await this.authRepo.createSession({
        userid: newUser.id,
        refreshtoken: this.hashToken(refreshtoken),
        family,
      });

      const userWithoutPassword = AuthMapper.toSafeUser(newUser);
      const formattedCompany = AuthMapper.toHRCompanyResponse(newCompany, ward);

      return {
        accesstoken,
        refreshtoken,
        user: userWithoutPassword,
        company: formattedCompany,
      };
    } catch (error) {
      // Rollback user nếu có lỗi xảy ra trong quá trình khởi tạo công ty
      if (createdUserId) {
        await this.authRepo.deleteUser(createdUserId).catch(() => {});
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.authRepo.findUserByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const { accesstoken, refreshtoken } = this.generateTokens(
      user.id,
      user.role || 'user',
      user.email,
    );

    // Giới hạn tối đa 5 phiên đăng nhập hoạt động đồng thời: Thu hồi các phiên cũ hơn nếu đã đủ 5
    const activeSessions = await this.authRepo.findActiveSessionsByUserId(user.id);

    if (activeSessions.length >= 5) {
      const oldSessions = activeSessions.slice(4);
      await Promise.all(
        oldSessions.map((s) => this.authRepo.revokeFamily(s.family)),
      );
    }

    // Khởi tạo một Token Family mới cho phiên đăng nhập này
    const family = crypto.randomUUID();
    await this.authRepo.createSession({
      userid: user.id,
      refreshtoken: this.hashToken(refreshtoken),
      family,
    });

    const userWithoutPassword = AuthMapper.toSafeUser(user);

    return {
      accesstoken,
      refreshtoken,
      user: userWithoutPassword,
    };
  }

  /**
   * Làm mới token theo cơ chế Token Rotation & Token Family Reuse Detection:
   * 1. Xác thực chữ ký JWT của Refresh Token.
   * 2. Băm SHA-256 token và tìm trong cơ sở dữ liệu:
   *    - Nếu token đã được đánh dấu isused = true: PHÁT HIỆN REUSE (Token bị đánh cắp).
   *      Khóa ngay lập tức TOÀN BỘ family token của chuỗi phiên đó.
   *    - Nếu token hợp lệ: Đánh dấu isused = true, tạo cặp Access/Refresh Token mới
   *      kế thừa cùng family và lưu vào CSDL (băm SHA-256).
   */
  async refreshToken(token: string) {
    if (!token) {
      throw new BadRequestException('Refresh token không được để trống');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const hashedToken = this.hashToken(token);
    const session = await this.authRepo.findSessionByRefreshToken(hashedToken);

    if (!session) {
      throw new UnauthorizedException('Phiên đăng nhập không tồn tại hoặc đã hết hạn');
    }

    if (session.isrevoked) {
      throw new UnauthorizedException('Phiên đăng nhập này đã bị thu hồi do lý do an ninh');
    }

    // Phát hiện tái sử dụng token (Reuse Detection)
    if (session.isused) {
      // Grace Period (15 giây) theo khuyến nghị OAuth 2.0 Security BCP:
      // Xử lý race-condition khi người dùng mở nhiều tab cùng lúc hoặc reload nhanh
      const updatedTime = session.updatedat ? new Date(session.updatedat).getTime() : 0;
      const isWithinGracePeriod = Date.now() - updatedTime < 15000;

      if (isWithinGracePeriod) {
        const user = await this.authRepo.findUserById(decoded.id);
        if (user) {
          const userWithoutPassword = AuthMapper.toSafeUser(user);
          const tokens = this.generateTokens(user.id, user.role || 'user', user.email);
          return {
            accesstoken: tokens.accesstoken,
            refreshtoken: token,
            user: userWithoutPassword,
          };
        }
      }

      // Vượt quá Grace Period -> Thật sự bị lộ token cũ -> Khóa ngay lập tức toàn bộ family
      await this.authRepo.revokeFamily(session.family);
      throw new UnauthorizedException(
        'Cảnh báo an ninh: Phát hiện sử dụng lại Refresh Token cũ (Token Reuse Detected). Toàn bộ phiên làm việc của thiết bị này đã bị hủy bỏ để bảo vệ tài khoản!',
      );
    }

    const user = await this.authRepo.findUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Đánh dấu token hiện tại đã sử dụng
    await this.authRepo.markTokenUsed(session.id);

    // Tạo cặp token mới (Rotation)
    const tokens = this.generateTokens(
      user.id,
      user.role || 'user',
      user.email,
    );

    // Lưu token mới kế thừa cùng family (được băm SHA-256)
    await this.authRepo.createSession({
      userid: user.id,
      refreshtoken: this.hashToken(tokens.refreshtoken),
      family: session.family,
      isused: false,
      isrevoked: false,
    });

    const userWithoutPassword = AuthMapper.toSafeUser(user);

    return {
      accesstoken: tokens.accesstoken,
      refreshtoken: tokens.refreshtoken,
      user: userWithoutPassword,
    };
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      try {
        const hashedToken = this.hashToken(refreshToken);
        const session = await this.authRepo.findSessionByRefreshToken(hashedToken);
        if (session) {
          // Thu hồi toàn bộ token family của phiên đăng xuất này
          await this.authRepo.revokeFamily(session.family);
        }
      } catch {
        // Bỏ qua lỗi DB nếu có để đảm bảo phía client luôn đăng xuất thành công
      }
    }

    return { success: true, message: 'Đăng xuất thành công' };
  }

  async logoutAll(userId: number) {
    await this.authRepo.deleteSessionsByUserId(userId);
    return { success: true, message: 'Đã đăng xuất khỏi tất cả thiết bị' };
  }

  async getMe(userId: number) {
    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    return AuthMapper.toSafeUser(user);
  }

  /**
   * Xác thực hoặc tạo mới tài khoản đăng nhập từ Google / Facebook OAuth
   */
  async validateOAuthUser(profile: {
    provider: 'google' | 'facebook';
    providerId: string;
    email: string | null;
    fullname: string | null;
    avatar: string | null;
  }) {
    const { provider, providerId, email, fullname, avatar } = profile;

    // 1. Tìm user theo provider và providerid
    let user = await this.authRepo.findUserByProvider(provider, providerId);

    if (user) {
      const updateData: any = {};
      if (avatar && user.avatar !== avatar) {
        updateData.avatar = avatar;
      }
      if (fullname && !user.fullname) {
        updateData.fullname = fullname;
      }
      if (Object.keys(updateData).length > 0) {
        user = await this.authRepo.updateUser(user.id, updateData);
      }
      return user;
    }

    // 2. Nếu chưa liên kết, tìm user theo email
    if (email) {
      user = await this.authRepo.findUserByEmail(email);
      if (user) {
        const updateData: any = {
          provider: provider as any,
          providerid: providerId as any,
        };
        if (!user.avatar) {
          updateData.avatar = avatar || DEFAULT_USER_AVATAR;
        }
        user = await this.authRepo.updateUser(user.id, updateData);
        return user;
      }
    }

    // 3. Nếu chưa có tài khoản, khởi tạo tài khoản mới
    const effectiveEmail = email
      ? email.toLowerCase().trim()
      : `${providerId}@${provider}.com`;
    const effectiveFullname =
      fullname || (provider === 'google' ? 'Google User' : 'Facebook User');

    const newUser = await this.authRepo.createUser({
      email: effectiveEmail as any,
      fullname: effectiveFullname as any,
      provider: provider as any,
      providerid: providerId as any,
      password: null as any,
      avatar: (avatar || DEFAULT_USER_AVATAR) as any,
      role: 'user' as any,
      createdat: nowPlainDateTime() as any,
      updatedat: nowPlainDateTime() as any,
    });

    return newUser;
  }

  /**
   * Tạo JWT tokens và lưu phiên đăng nhập cho OAuth
   */
  async loginWithOAuth(user: any) {
    const { accesstoken, refreshtoken } = this.generateTokens(
      user.id,
      user.role || 'user',
      user.email,
    );

    // Giới hạn tối đa 5 phiên đăng nhập hoạt động đồng thời
    const activeSessions = await this.authRepo.findActiveSessionsByUserId(user.id);

    if (activeSessions.length >= 5) {
      const oldSessions = activeSessions.slice(4);
      await Promise.all(
        oldSessions.map((s) => this.authRepo.revokeFamily(s.family)),
      );
    }

    const family = crypto.randomUUID();
    await this.authRepo.createSession({
      userid: user.id,
      refreshtoken: this.hashToken(refreshtoken),
      family,
    });

    const userWithoutPassword = AuthMapper.toSafeUser(user);

    return {
      accesstoken,
      refreshtoken,
      user: userWithoutPassword,
    };
  }

  private getClientUrl(): string {
    const isProduction =
      process.env.NODE_ENV === 'production' ||
      (Boolean(process.env.CLIENT_URL) && !process.env.CLIENT_URL?.includes('localhost'));

    return (
      process.env.CLIENT_URL?.replace(/\/+$/, '') ||
      (isProduction ? 'https://it-job-ndv.vercel.app' : 'http://localhost:3000')
    );
  }

  /**
   * Tạo mã One-Time Exchange Code tạm thời (hạn 60s, chỉ dùng 1 lần) để FE đổi token
   */
  createOAuthExchangeCode(userId: number): string {
    const code = crypto.randomBytes(32).toString('hex');
    this.oauthExchangeCodes.set(code, {
      userId,
      expiresAt: Date.now() + 60 * 1000,
    });
    return code;
  }

  /**
   * Xác thực và đổi mã One-Time Code lấy JWT Tokens (Flow OAuth an toàn)
   */
  async exchangeOAuthCode(code: string) {
    if (!code) {
      throw new BadRequestException('Mã xác thực không được để trống');
    }

    const entry = this.oauthExchangeCodes.get(code);
    if (!entry) {
      throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã được sử dụng');
    }

    // Xóa ngay lập tức khỏi bộ nhớ để chống Replay Attack (chỉ dùng đúng 1 lần)
    this.oauthExchangeCodes.delete(code);

    if (Date.now() > entry.expiresAt) {
      throw new UnauthorizedException('Mã xác thực đã hết hạn (chỉ có hiệu lực trong 60 giây)');
    }

    const user = await this.authRepo.findUserById(entry.userId);
    if (!user) {
      throw new UnauthorizedException('Tài khoản người dùng không tồn tại');
    }

    return this.loginWithOAuth(user);
  }

  /**
   * Xử lý callback OAuth: tạo One-Time Exchange Code và redirect về Frontend an toàn
   */
  async handleOAuthCallback(user: any): Promise<{ redirectUrl: string; refreshtoken?: string }> {
    const clientUrl = this.getClientUrl();

    if (!user) {
      return {
        redirectUrl: `${clientUrl}/dang-nhap?error=oauth_failed`,
      };
    }

    try {
      // Tạo mã code ngẫu nhiên an toàn, tuyệt đối không truyền JWT token qua URL query
      const code = this.createOAuthExchangeCode(user.id);

      return {
        redirectUrl: `${clientUrl}/callback?code=${code}`,
      };
    } catch (error) {
      console.error('OAuth Callback Error:', error);
      return {
        redirectUrl: `${clientUrl}/dang-nhap?error=oauth_error`,
      };
    }
  }

  /**
   * Xác thực Refresh Token hợp lệ và có phiên hoạt động trong CSDL
   */
  async validateRefreshTokenSession(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const hashedToken = this.hashToken(token);
      const session = await this.authRepo.findSessionByRefreshToken(hashedToken);
      return Boolean(session && !session.isrevoked && !session.isused);
    } catch {
      return false;
    }
  }
}
