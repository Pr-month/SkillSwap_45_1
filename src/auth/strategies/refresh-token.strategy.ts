import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { IJwtConfig, jwtConfig } from 'src/config/jwt.config';
import { JwtPayload } from '../auth.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: IJwtConfig,
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: (req: Request) => {
        const body = req.body as { refreshToken?: string } | undefined;
        const cookies = req.cookies as { refreshToken?: string } | undefined;
        return body?.refreshToken || cookies?.refreshToken || null;
      },
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshSecret,
      passReqToCallback: true,
    };
    super(options);
  }

  validate(req: Request, payload: JwtPayload) {
    const body = req.body as { refreshToken?: string } | undefined;
    const cookies = req.cookies as { refreshToken?: string } | undefined;
    const refreshToken = body?.refreshToken || cookies?.refreshToken || null;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return { sub: payload.sub, email: payload.email, refreshToken };
  }
}
