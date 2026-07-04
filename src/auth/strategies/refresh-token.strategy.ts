import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { Request } from 'express';
import { IJwtConfig, jwtConfig } from 'src/jwt.config';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: IJwtConfig,
  ) {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: (req: Request) => {
        return req.body?.refreshToken || req.cookies?.refreshToken || null;
      },
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshSecret,
    };
    super(options);
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email };
  }
}