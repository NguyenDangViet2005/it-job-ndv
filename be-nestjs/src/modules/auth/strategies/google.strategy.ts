import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const clientID =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.CUSTOMER_ID ||
      '598416758150-6uvtssg87ei6c2asfpunqiq4p9eiubc1.apps.googleusercontent.com';
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET ||
      process.env.CUSTOMER_SECRET ||
      process.env.CLIENT_SECRET ||
      'dummy_secret_for_dev';

    const backendUrl =
      process.env.BACKEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://it-job-ndv-express.onrender.com'
        : `http://localhost:${process.env.PORT || 8081}`);

    const callbackURL =
      process.env.GOOGLE_CALLBACK_URL ||
      `${backendUrl}/api/auth/callback/google`;

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
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
    const fullname =
      profile.displayName || profile.name?.givenName || 'Google User';
    const avatar =
      profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    const user = await this.authService.validateOAuthUser({
      provider: 'google',
      providerId,
      email,
      fullname,
      avatar,
    });

    if (!user) {
      throw new UnauthorizedException('Không thể xác thực tài khoản Google');
    }

    return user;
  }
}
