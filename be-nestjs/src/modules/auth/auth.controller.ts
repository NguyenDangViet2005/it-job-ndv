import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterHRDto } from './dto/register-hr.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { GoogleAuthGuard } from '~/common/guards/google-auth.guard.js';
import { FacebookAuthGuard } from '~/common/guards/facebook-auth.guard.js';
import { CurrentUser } from '~/common/decorators/current-user.decorator.js';
import { Throttle } from '@nestjs/throttler';

const isProduction =
  process.env.NODE_ENV === 'production' ||
  (Boolean(process.env.CLIENT_URL) && !process.env.CLIENT_URL?.includes('localhost'));

const COOKIE_NAME = 'refreshtoken';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 15, ttl: 900000 } })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: user,
    };
  }

  @Post('register-hr')
  @Throttle({ default: { limit: 15, ttl: 900000 } })
  async registerHR(
    @Body() dto: RegisterHRDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerHR(dto);

    res.cookie(COOKIE_NAME, result.refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return {
      success: true,
      message: 'Đăng ký tài khoản nhà tuyển dụng thành công',
      data: result,
    };
  }

  @Post('login')
  @Throttle({ default: { limit: 15, ttl: 900000 } })
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
  async getMe(@CurrentUser('id') userId: number) {
    const user = await this.authService.getMe(userId);
    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }

  @Post('set-cookie')
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Kích hoạt Passport Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback((req as any).user, res);
  }

  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallbackAlias(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback((req as any).user, res);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {
    // Kích hoạt Passport Facebook OAuth flow
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback((req as any).user, res);
  }

  private async handleOAuthCallback(user: any, res: Response) {
    const clientUrl =
      process.env.CLIENT_URL?.replace(/\/+$/, '') ||
      (isProduction ? 'https://it-job-ndv.vercel.app' : 'http://localhost:3000');
    if (!user) {
      return res.redirect(`${clientUrl}/dang-nhap?error=oauth_failed`);
    }

    try {
      const { accesstoken, refreshtoken } = await this.authService.loginWithOAuth(user);

      res.cookie(COOKIE_NAME, refreshtoken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });

      return res.redirect(
        `${clientUrl}/callback?token=${accesstoken}&refreshtoken=${refreshtoken}`,
      );
    } catch (error) {
      console.error('OAuth Callback Error:', error);
      return res.redirect(`${clientUrl}/dang-nhap?error=oauth_error`);
    }
  }
}
