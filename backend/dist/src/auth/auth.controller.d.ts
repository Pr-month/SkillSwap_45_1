import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './auth.types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: import("../users/entities/user.entity").UserEntity;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: RequestWithUser): Promise<{
        message: string;
    }>;
    register(dto: RegisterDto): Promise<{
        user: import("../users/entities/user.entity").UserEntity;
        accessToken: string;
        refreshToken: string;
    }>;
}
