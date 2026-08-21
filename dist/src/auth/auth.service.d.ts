import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { IJwtConfig } from '../config/jwt.config';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenUser } from './auth.types';
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    private readonly jwtConfiguration;
    private readonly usersService;
    constructor(usersRepository: Repository<UserEntity>, jwtService: JwtService, jwtConfiguration: IJwtConfig, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        user: UserEntity;
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: UserEntity;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userData: RefreshTokenUser): Promise<{
        message: string;
    }>;
    private saveRefreshToken;
    private generateTokens;
}
