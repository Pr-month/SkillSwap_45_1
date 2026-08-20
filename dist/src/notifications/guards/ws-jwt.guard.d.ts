import { Socket } from 'socket.io';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { JwtPayload } from '../../auth/auth.types';
export declare class WsJwtGuard {
    private readonly jwtStrategy;
    constructor(jwtStrategy: JwtStrategy);
    verify(token: string | undefined): Promise<JwtPayload>;
    extractToken(client: Socket): string | undefined;
}
