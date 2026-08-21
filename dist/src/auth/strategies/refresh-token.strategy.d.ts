import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { IJwtConfig } from 'src/config/jwt.config';
import { JwtPayload } from '../auth.types';
declare const RefreshTokenStrategy_base: new (...args: [opt: StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    private readonly jwtConfig;
    constructor(jwtConfig: IJwtConfig);
    validate(req: Request, payload: JwtPayload): {
        sub: string;
        email: string;
        refreshToken: string;
    };
}
export {};
