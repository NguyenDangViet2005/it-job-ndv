import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { CurrentUser } from '~/common/decorators/current-user.decorator.js';

const isProduction =
  process.env.NODE_ENV === 'production' ||
  (Boolean(process.env.CLIENT_URL) && !process.env.CLIENT_URL?.includes('localhost'));

const COOKIE_NAME = 'refreshtoken';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accesstoken, refreshtoken, user } = await this.authService.login(dto);

    res.cookie(COOKIE_NAME, refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        accesstoken,
        user,
      },
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[COOKIE_NAME] || body?.refreshtoken;
    if (!token) {
      throw new UnauthorizedException('Không tìm thấy refresh token');
    }

    try {
      const result = await this.authService.refreshToken(token);

      res.cookie(COOKIE_NAME, result.refreshtoken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });

      return {
        success: true,
        message: 'Làm mới token thành công',
        data: {
          accesstoken: result.accesstoken,
          user: result.user,
        },
      };
    } catch (error: any) {
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      });
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[COOKIE_NAME] || body?.refreshtoken;

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    if (token) {
      await this.authService.logout(token);
    }

    return {
      success: true,
      message: 'Đăng xuất thành công',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser('id') userId: number) {
    const user = await this.authService.getMe(userId);
    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }

  @Post('set-cookie')
  @HttpCode(HttpStatus.OK)
  async setCookie(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body?.refreshtoken) {
      throw new UnauthorizedException('Refresh token không được để trống');
    }

    res.cookie(COOKIE_NAME, body.refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return {
      success: true,
      message: 'Thiết lập cookie thành công',
    };
  }
}
