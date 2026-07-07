import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import { jwtConfig, IJwtConfig } from '../config/jwt.config';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: IJwtConfig,
    private readonly usersService: UsersService
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

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
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
