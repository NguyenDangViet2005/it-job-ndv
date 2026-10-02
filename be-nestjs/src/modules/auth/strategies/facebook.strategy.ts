import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-facebook';
import { AuthService } from '../auth.service.js';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    const clientID =
      process.env.FACEBOOK_APP_ID || 'default_app_id';
    const clientSecret =
      process.env.FACEBOOK_APP_SECRET || 'default_app_secret';

    const rawBackendUrl =
      process.env.BACKEND_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      `http://localhost:${process.env.PORT || 8081}`;
    const backendUrl = rawBackendUrl.replace(/\/+$/, '');

    const callbackURL =
      process.env.FACEBOOK_CALLBACK_URL ||
      `${backendUrl}/api/auth/facebook/callback`;

    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      scope: ['email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email =
      profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const providerId = profile.id;
    const fullname = profile.displayName || 'Facebook User';
    const avatar =
      profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    const user = await this.authService.validateOAuthUser({
      provider: 'facebook',
      providerId,
      email,
      fullname,
      avatar,
    });

    if (!user) {
      throw new UnauthorizedException('Không thể xác thực tài khoản Facebook');
    }

    return user;
  }
}
