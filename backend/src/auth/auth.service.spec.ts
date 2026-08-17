import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { jwtConfig } from '../config/jwt.config';
import { UserRole } from '../users/enums/users.enums';
import { RefreshTokenUser } from './auth.types';

jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

const mockedHash = bcrypt.hash as jest.Mock;
const mockedCompare = bcrypt.compare as jest.Mock;

const makeUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
  ({
    id: 'user-1',
    name: 'Test',
    email: 'test@mail.dev',
    password: 'hashed-password',
    role: UserRole.USER,
    refreshToken: 'hashed-refresh',
    ...overrides,
  }) as unknown as UserEntity;

describe('AuthService', () => {
  let service: AuthService;

  const usersRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const jwtConfiguration = {
    accessSecret: 'access-secret',
    refreshSecret: 'refresh-secret',
    accessExpiresIn: '1h',
    refreshExpiresIn: '7d',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockedHash.mockResolvedValue('hashed-value');
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useValue: usersRepository },
        { provide: JwtService, useValue: jwtService },
        { provide: jwtConfig.KEY, useValue: jwtConfiguration },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const dto = {
      name: 'Test',
      email: 'test@mail.dev',
      password: 'plain-password',
      about: 'about',
    };

    it('регистрирует нового пользователя и выдаёт токены', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      const user = makeUser();
      usersService.create.mockResolvedValue(user);

      const result = await service.register(dto);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: 'hashed-value',
        }),
      );
      expect(usersRepository.update).toHaveBeenCalled();
      expect(result).toEqual({
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('бросает BadRequest, если email уже занят', async () => {
      usersService.findByEmail.mockResolvedValue(makeUser());

      await expect(service.register(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const dto = { email: 'test@mail.dev', password: 'plain-password' };

    it('успешный вход возвращает пользователя и токены', async () => {
      const user = makeUser();
      usersRepository.findOne.mockResolvedValue(user);
      mockedCompare.mockResolvedValue(true);

      const result = await service.login(dto);

      expect(result).toEqual({
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(usersRepository.update).toHaveBeenCalled();
    });

    it('бросает Unauthorized, если пользователь не найден', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('бросает Unauthorized при неверном пароле', async () => {
      usersRepository.findOne.mockResolvedValue(makeUser());
      mockedCompare.mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('refresh', () => {
    const dto = { refreshToken: 'some-refresh-token' };

    it('обновляет токены при валидном refresh токене', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@mail.dev',
        role: UserRole.USER,
      });
      usersRepository.findOne.mockResolvedValue(makeUser());
      mockedCompare.mockResolvedValue(true);

      const result = await service.refresh(dto);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('бросает Unauthorized, если токен невалиден', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));

      await expect(service.refresh(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('бросает Unauthorized, если у пользователя нет refresh токена', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@mail.dev',
        role: UserRole.USER,
      });
      usersRepository.findOne.mockResolvedValue(
        makeUser({ refreshToken: null }),
      );

      await expect(service.refresh(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('бросает Unauthorized, если refresh токен не совпадает с хешем', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@mail.dev',
        role: UserRole.USER,
      });
      usersRepository.findOne.mockResolvedValue(makeUser());
      mockedCompare.mockResolvedValue(false);

      await expect(service.refresh(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    const userData: RefreshTokenUser = {
      sub: 'user-1',
      email: 'test@mail.dev',
      role: 'USER',
      refreshToken: 'some-refresh-token',
    };

    it('очищает refresh токен пользователя', async () => {
      usersRepository.findOne.mockResolvedValue(makeUser());
      mockedCompare.mockResolvedValue(true);

      const result = await service.logout(userData);

      expect(usersRepository.update).toHaveBeenCalledWith('user-1', {
        refreshToken: null,
      });
      expect(result).toEqual({ message: 'Вы успешно вышли из системы' });
    });

    it('бросает Unauthorized, если у пользователя нет refresh токена', async () => {
      usersRepository.findOne.mockResolvedValue(
        makeUser({ refreshToken: null }),
      );

      await expect(service.logout(userData)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('бросает Unauthorized, если refresh токен не совпадает', async () => {
      usersRepository.findOne.mockResolvedValue(makeUser());
      mockedCompare.mockResolvedValue(false);

      await expect(service.logout(userData)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
