import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/auth.types';
import { UserRole } from '../users/enums/users.enums';

describe('RequestsController', () => {
  let controller: RequestsController;

  const requestsService = {
    create: jest.fn(),
    findIncoming: jest.fn(),
    findOutgoing: jest.fn(),
    markAsRead: jest.fn(),
    accept: jest.fn(),
    reject: jest.fn(),
    remove: jest.fn(),
  };

  const makeReq = (sub: string, role: UserRole = UserRole.USER): AuthRequest =>
    ({ user: { sub, email: 'user@test.dev', role } }) as AuthRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [{ provide: RequestsService, useValue: requestsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RequestsController>(RequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create передаёт dto и id отправителя в сервис', async () => {
    const dto = { requestedSkillId: 'r-1', offeredSkillId: 'o-1' };
    await controller.create(dto, makeReq('sender-1'));
    expect(requestsService.create).toHaveBeenCalledWith(dto, 'sender-1');
  });

  it('accept передаёт id заявки и id пользователя', async () => {
    await controller.accept('req-1', makeReq('receiver-1'));
    expect(requestsService.accept).toHaveBeenCalledWith('req-1', 'receiver-1');
  });

  it('remove передаёт id заявки, id пользователя и его роль', async () => {
    await controller.remove('req-1', makeReq('sender-1', UserRole.ADMIN));
    expect(requestsService.remove).toHaveBeenCalledWith(
      'req-1',
      'sender-1',
      UserRole.ADMIN,
    );
  });
});
