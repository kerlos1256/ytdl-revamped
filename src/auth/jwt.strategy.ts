require('dotenv').config();
import { Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    const token = req.cookies['jwt'];
    if (!token) return null;
    return token;
  }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSecret || 'secret',
    });
  }

  async validate(payload: any) {
    return { id: payload.id, username: payload.username };
  }
}
