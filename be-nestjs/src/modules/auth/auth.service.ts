import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { db } from '~/prisma/db.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

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
    const existing = await db.orm.public.User.where({ email: email as any }).first();
    if (existing) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await db.orm.public.User.create({
      email: email as any,
      password: hashedPassword as any,
      fullname: dto.fullname.trim() as any,
      phone: (dto.phone?.trim() || null) as any,
      gender: (dto.gender || null) as any,
      dateofbirth: dto.dateofbirth ? new Date(dto.dateofbirth) : null,
      role: (dto.role || 'user') as any,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await db.orm.public.User.where({ email: email as any }).first();
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
    const existingSessions = await db.orm.public.SessionLogins
      .where({ userid: user.id })
      .orderBy((s: any) => s.id.desc())
      .all();

    if (existingSessions.length >= 5) {
      const oldSessions = existingSessions.slice(4);
      await Promise.all(
        oldSessions.map((s) => db.orm.public.SessionLogins.where({ id: s.id }).delete()),
      );
    }

    await db.orm.public.SessionLogins.create({
      userid: user.id,
      accesstoken,
      refreshtoken,
    });

    const { password: _, refreshtoken: __, ...userWithoutPassword } = user as any;

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

      const session = await db.orm.public.SessionLogins.where({
        refreshtoken: token,
      }).first();

      if (!session) {
        throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã bị hủy');
      }

      const user = await db.orm.public.User.where({ id: decoded.id }).first();
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      const tokens = this.generateTokens(
        user.id,
        user.role || 'user',
        user.email,
      );

      await db.orm.public.SessionLogins.where({ id: session.id }).update({
        accesstoken: tokens.accesstoken,
        refreshtoken: tokens.refreshtoken,
      });

      const { password: _, refreshtoken: __, ...userWithoutPassword } = user as any;

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
      await db.orm.public.SessionLogins.where({
        refreshtoken: refreshToken,
      }).delete();
    } catch {
      // Bỏ qua lỗi DB nếu có để đảm bảo phía client luôn đăng xuất thành công
    }

    return { success: true, message: 'Đăng xuất thành công' };
  }


  async logoutAll(userId: number) {
    await db.orm.public.SessionLogins.where({ userid: userId }).delete();
    return { success: true, message: 'Đã đăng xuất khỏi tất cả thiết bị' };
  }

  async getMe(userId: number) {
    const user = await db.orm.public.User.where({ id: userId }).first();
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    const { password: _, refreshtoken: __, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }
}
