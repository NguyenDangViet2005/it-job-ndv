import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { orm } from '~/prisma/db.js';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterHRDto } from './dto/register-hr.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthMapper } from './auth.mapper.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await orm.User.where({ email: email as any }).first();
    if (existing) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userEntity = AuthMapper.toCreateUserEntity(dto, hashedPassword);
    const newUser = await orm.User.create(userEntity);

    return {
      id: newUser.id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
    };
  }

  async registerHR(dto: RegisterHRDto) {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await orm.User.where({ email: email as any }).first();
    if (existingUser) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    // Kiểm tra tính hợp lệ của địa chỉ xã/phường & tỉnh/thành
    const ward = await orm.Wards
      .where({ id: dto.wardid })
      .include('provinces')
      .first();

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
      const newUser = await orm.User.create(userPayload);
      createdUserId = newUser.id;

      // 2. Tạo công ty liên kết với nhà tuyển dụng
      const companyPayload = AuthMapper.toCreateHRCompanyEntity(dto, newUser.id);
      const newCompany = await orm.Company.create(companyPayload);

      // 3. Tạo thành viên công ty (CompanyMembers)
      const memberPayload = AuthMapper.toCreateHRCompanyMemberEntity(newCompany.id, newUser.id);
      await orm.CompanyMembers.create(memberPayload);

      // 4. Tạo token và phiên đăng nhập
      const { accesstoken, refreshtoken } = this.generateTokens(
        newUser.id,
        'employer',
        newUser.email,
      );

      await orm.SessionLogins.create({
        userid: newUser.id,
        accesstoken,
        refreshtoken,
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
        await orm.User.where({ id: createdUserId }).delete().catch(() => {});
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await orm.User.where({ email: email as any }).first();
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

    // Giới hạn tối đa 5 phiên đăng nhập đồng thời: Xóa các phiên cũ hơn nếu đã đủ 5
    const existingSessions = await orm.SessionLogins
      .where({ userid: user.id })
      .orderBy((s: any) => s.id.desc())
      .all();

    if (existingSessions.length >= 5) {
      const oldSessions = existingSessions.slice(4);
      await Promise.all(
        oldSessions.map((s) => orm.SessionLogins.where({ id: s.id }).delete()),
      );
    }

    await orm.SessionLogins.create({
      userid: user.id,
      accesstoken,
      refreshtoken,
    });

    const userWithoutPassword = AuthMapper.toSafeUser(user);

    return {
      accesstoken,
      refreshtoken,
      user: userWithoutPassword,
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new BadRequestException('Refresh token không được để trống');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const session = await orm.SessionLogins.where({
        refreshtoken: token,
      }).first();

      if (!session) {
        throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã bị hủy');
      }

      const user = await orm.User.where({ id: decoded.id }).first();
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      const tokens = this.generateTokens(
        user.id,
        user.role || 'user',
        user.email,
      );

      await orm.SessionLogins.where({ id: session.id }).update({
        accesstoken: tokens.accesstoken,
        refreshtoken: tokens.refreshtoken,
      });

      const userWithoutPassword = AuthMapper.toSafeUser(user);

      return {
        accesstoken: tokens.accesstoken,
        refreshtoken: tokens.refreshtoken,
        user: userWithoutPassword,
      };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async logout(refreshToken?: string) {
    try {
      await orm.SessionLogins.where({
        refreshtoken: refreshToken,
      }).delete();
    } catch {
      // Bỏ qua lỗi DB nếu có để đảm bảo phía client luôn đăng xuất thành công
    }

    return { success: true, message: 'Đăng xuất thành công' };
  }

  async logoutAll(userId: number) {
    await orm.SessionLogins.where({ userid: userId }).delete();
    return { success: true, message: 'Đã đăng xuất khỏi tất cả thiết bị' };
  }

  async getMe(userId: number) {
    const user = await orm.User.where({ id: userId }).first();
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
    let user = await orm.User.where({
      provider: provider as any,
      providerid: providerId as any,
    }).first();

    if (user) {
      const updateData: any = {};
      if (avatar && user.avatar !== avatar) {
        updateData.avatar = avatar;
      }
      if (fullname && !user.fullname) {
        updateData.fullname = fullname;
      }
      if (Object.keys(updateData).length > 0) {
        await orm.User.where({ id: user.id }).update(updateData);
        user = await orm.User.where({ id: user.id }).first();
      }
      return user;
    }

    // 2. Nếu chưa liên kết, tìm user theo email
    if (email) {
      user = await orm.User.where({ email: email.toLowerCase().trim() as any }).first();
      if (user) {
        const updateData: any = {
          provider: provider as any,
          providerid: providerId as any,
        };
        if (avatar && !user.avatar) {
          updateData.avatar = avatar;
        }
        await orm.User.where({ id: user.id }).update(updateData);
        user = await orm.User.where({ id: user.id }).first();
        return user;
      }
    }

    // 3. Nếu chưa có tài khoản, khởi tạo tài khoản mới
    const defaultAvatar =
      'https://res.cloudinary.com/duc6z828y/image/upload/c_crop,w_650,h_650,ar_1:1/v1768581047/avatar_nbspgd.avif';
    const effectiveEmail = email
      ? email.toLowerCase().trim()
      : `${providerId}@${provider}.com`;
    const effectiveFullname =
      fullname || (provider === 'google' ? 'Google User' : 'Facebook User');

    const newUser = await orm.User.create({
      email: effectiveEmail as any,
      fullname: effectiveFullname as any,
      provider: provider as any,
      providerid: providerId as any,
      password: null as any,
      avatar: (avatar || defaultAvatar) as any,
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

    // Giới hạn tối đa 5 phiên đăng nhập đồng thời
    const existingSessions = await orm.SessionLogins
      .where({ userid: user.id })
      .orderBy((s: any) => s.id.desc())
      .all();

    if (existingSessions.length >= 5) {
      const oldSessions = existingSessions.slice(4);
      await Promise.all(
        oldSessions.map((s) => orm.SessionLogins.where({ id: s.id }).delete()),
      );
    }

    await orm.SessionLogins.create({
      userid: user.id,
      accesstoken,
      refreshtoken,
    });

    const userWithoutPassword = AuthMapper.toSafeUser(user);

    return {
      accesstoken,
      refreshtoken,
      user: userWithoutPassword,
    };
  }
}
