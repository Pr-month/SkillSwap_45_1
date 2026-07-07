import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { IJwtConfig, jwtConfig } from '../config/jwt.config';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.types';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: IJwtConfig,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        'Пользователь с такой почтой уже существует!',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      about: dto.about,
    });

    return { user };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = this.generateTokens(payload);
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        { secret: this.jwtConfiguration.refreshSecret },
      );
    } catch {
      throw new UnauthorizedException('Невалидный или истёкший refresh токен');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user?.refreshToken) {
      throw new UnauthorizedException('Невалидный или истёкший refresh токен');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshTokenDto.refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Невалидный или истёкший refresh токен');
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = this.generateTokens(newPayload);
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConfiguration.refreshSecret,
      expiresIn: this.jwtConfiguration.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
