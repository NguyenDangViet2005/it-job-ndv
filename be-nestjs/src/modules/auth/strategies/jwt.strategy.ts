import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '~/common/decorators/current-user.decorator.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_ACCESS_SECRET is not configured in production environment!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'dev_jwt_access_secret_do_not_use_in_prod',
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Token payload không hợp lệ');
    }
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
