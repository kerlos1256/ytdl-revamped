import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'

export const GetTokenFromCookiesAndDecode = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies['jwt'];
    if(!token) return null
    const verify = await jwt.verify(token,process.env.JWTSecret)
    if(!verify) return null
    return verify
  },
);