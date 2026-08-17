import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refreshGuard';
import { RequestWithUser } from './auth.types';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(RefreshTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login передаёт dto в сервис', async () => {
    const dto = { email: 'test@mail.dev', password: 'pass' };
    await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('refresh передаёт dto в сервис', async () => {
    const dto = { refreshToken: 'token' };
    await controller.refresh(dto);
    expect(authService.refresh).toHaveBeenCalledWith(dto);
  });

  it('logout передаёт данные пользователя из запроса', async () => {
    const req = {
      user: {
        sub: 'user-1',
        email: 'test@mail.dev',
        role: 'USER',
        refreshToken: 'token',
      },
    } as RequestWithUser;
    await controller.logout(req);
    expect(authService.logout).toHaveBeenCalledWith(req.user);
  });

  it('register передаёт dto в сервис', async () => {
    const dto = {
      name: 'Test',
      email: 'test@mail.dev',
      password: 'pass',
      about: 'about',
    };
    await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });
});
