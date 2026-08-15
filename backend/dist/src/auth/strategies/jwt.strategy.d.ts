import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth.types';
export declare class JwtStrategy {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    validate(token: string): Promise<JwtPayload>;
}
