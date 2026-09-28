import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '~/common/decorators/current-user.decorator.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default_jwt_access_secret',
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
