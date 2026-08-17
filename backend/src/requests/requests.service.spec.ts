import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestEntity } from './entities/request.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { SkillsService } from '../skills/skills.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { RequestStatus } from './enums/requests.enums';
import { NotificationType } from '../notifications/types/notification-payload.type';
import { UserRole } from '../users/enums/users.enums';

// --- Хелперы для построения тестовых данных ---

const makeSkill = (
  id: string,
  ownerId: string,
  ownerName = 'owner',
): SkillEntity =>
  ({
    id,
    title: `skill-${id}`,
    description: 'desc',
    images: [],
    owner: { id: ownerId, name: ownerName },
  }) as unknown as SkillEntity;

const makeRequest = (overrides: Partial<RequestEntity> = {}): RequestEntity =>
  ({
    id: 'req-1',
    status: RequestStatus.PENDING,
    isRead: false,
    sender: { id: 'sender-1', name: 'Sender' },
    receiver: { id: 'receiver-1', name: 'Receiver' },
    offeredSkill: makeSkill('offered-1', 'sender-1'),
    requestedSkill: makeSkill('requested-1', 'receiver-1'),
    ...overrides,
  }) as unknown as RequestEntity;

describe('RequestsService', () => {
  let service: RequestsService;

  const requestsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const skillsRepository = {
    findOne: jest.fn(),
  };
  const skillsService = {
    create: jest.fn(),
  };
  const notificationsGateway = {
    notifyUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(RequestEntity),
          useValue: requestsRepository,
        },
        {
          provide: getRepositoryToken(SkillEntity),
          useValue: skillsRepository,
        },
        { provide: SkillsService, useValue: skillsService },
        { provide: NotificationsGateway, useValue: notificationsGateway },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      requestedSkillId: 'requested-1',
      offeredSkillId: 'offered-1',
    };

    it('создаёт заявку и уведомляет получателя', async () => {
      const requestedSkill = makeSkill('requested-1', 'receiver-1');
      const offeredSkill = makeSkill('offered-1', 'sender-1', 'Sender');
      skillsRepository.findOne
        .mockResolvedValueOnce(requestedSkill)
        .mockResolvedValueOnce(offeredSkill);
      const created = makeRequest();
      requestsRepository.create.mockReturnValue(created);
      requestsRepository.save.mockResolvedValue(created);

      const result = await service.create(dto, 'sender-1');

      expect(requestsRepository.save).toHaveBeenCalledWith(created);
      expect(notificationsGateway.notifyUser).toHaveBeenCalledWith(
        'receiver-1',
        {
          type: NotificationType.NEW_REQUEST,
          skillTitle: requestedSkill.title,
          fromUser: 'Sender',
        },
      );
      expect(result).toBe(created);
    });

    it('бросает NotFound, если запрашиваемый навык не найден', async () => {
      skillsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.create(dto, 'sender-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('бросает NotFound, если предлагаемый навык не найден', async () => {
      skillsRepository.findOne
        .mockResolvedValueOnce(makeSkill('requested-1', 'receiver-1'))
        .mockResolvedValueOnce(null);

      await expect(service.create(dto, 'sender-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('бросает Forbidden, если предлагаемый навык не принадлежит отправителю', async () => {
      skillsRepository.findOne
        .mockResolvedValueOnce(makeSkill('requested-1', 'receiver-1'))
        .mockResolvedValueOnce(makeSkill('offered-1', 'someone-else'));

      await expect(service.create(dto, 'sender-1')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('бросает BadRequest, если получатель совпадает с отправителем', async () => {
      skillsRepository.findOne
        .mockResolvedValueOnce(makeSkill('requested-1', 'sender-1'))
        .mockResolvedValueOnce(makeSkill('offered-1', 'sender-1'));

      await expect(service.create(dto, 'sender-1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findIncoming / findOutgoing', () => {
    it('findIncoming запрашивает заявки по получателю', async () => {
      const data = [makeRequest()];
      requestsRepository.find.mockResolvedValue(data);

      const result = await service.findIncoming('receiver-1');

      expect(requestsRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { receiver: { id: 'receiver-1' } },
        }),
      );
      expect(result).toBe(data);
    });

    it('findOutgoing запрашивает заявки по отправителю', async () => {
      const data = [makeRequest()];
      requestsRepository.find.mockResolvedValue(data);

      const result = await service.findOutgoing('sender-1');

      expect(requestsRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { sender: { id: 'sender-1' } },
        }),
      );
      expect(result).toBe(data);
    });
  });

  describe('markAsRead', () => {
    it('помечает заявку прочитанной', async () => {
      const request = makeRequest({ isRead: false });
      requestsRepository.findOne.mockResolvedValue(request);
      requestsRepository.save.mockResolvedValue(request);

      const result = await service.markAsRead('req-1', 'receiver-1');

      expect(request.isRead).toBe(true);
      expect(requestsRepository.save).toHaveBeenCalledWith(request);
      expect(result).toBe(request);
    });

    it('бросает NotFound, если заявка не найдена', async () => {
      requestsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.markAsRead('req-1', 'receiver-1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('бросает Forbidden, если пользователь не получатель', async () => {
      requestsRepository.findOne.mockResolvedValue(makeRequest());

      await expect(
        service.markAsRead('req-1', 'someone-else'),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('accept', () => {
    it('принимает заявку, обменивает навыки и уведомляет отправителя', async () => {
      const request = makeRequest({ status: RequestStatus.PENDING });
      requestsRepository.findOne.mockResolvedValue(request);
      requestsRepository.save.mockResolvedValue(request);

      const result = await service.accept('req-1', 'receiver-1');

      expect(skillsService.create).toHaveBeenCalledTimes(2);
      expect(request.status).toBe(RequestStatus.ACCEPTED);
      expect(notificationsGateway.notifyUser).toHaveBeenCalledWith('sender-1', {
        type: NotificationType.ACCEPTED,
        skillTitle: request.requestedSkill.title,
        fromUser: 'Receiver',
      });
      expect(result).toBe(request);
    });

    it('бросает Forbidden, если пользователь не получатель', async () => {
      requestsRepository.findOne.mockResolvedValue(makeRequest());

      await expect(
        service.accept('req-1', 'someone-else'),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('бросает BadRequest, если статус не pending', async () => {
      requestsRepository.findOne.mockResolvedValue(
        makeRequest({ status: RequestStatus.ACCEPTED }),
      );

      await expect(
        service.accept('req-1', 'receiver-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('reject', () => {
    it('отклоняет заявку и уведомляет отправителя', async () => {
      const request = makeRequest({ status: RequestStatus.PENDING });
      requestsRepository.findOne.mockResolvedValue(request);
      requestsRepository.save.mockResolvedValue(request);

      const result = await service.reject('req-1', 'receiver-1');

      expect(request.status).toBe(RequestStatus.REJECTED);
      expect(notificationsGateway.notifyUser).toHaveBeenCalledWith('sender-1', {
        type: NotificationType.REJECTED,
        skillTitle: request.requestedSkill.title,
        fromUser: 'Receiver',
      });
      expect(result).toBe(request);
    });

    it('бросает BadRequest, если статус не pending', async () => {
      requestsRepository.findOne.mockResolvedValue(
        makeRequest({ status: RequestStatus.REJECTED }),
      );

      await expect(
        service.reject('req-1', 'receiver-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('remove', () => {
    it('владелец может удалить свою заявку', async () => {
      const request = makeRequest();
      requestsRepository.findOne.mockResolvedValue(request);
      requestsRepository.remove.mockResolvedValue(request);

      const result = await service.remove('req-1', 'sender-1', UserRole.USER);

      expect(requestsRepository.remove).toHaveBeenCalledWith(request);
      expect(result).toEqual({ message: 'Заявка удалена' });
    });

    it('админ может удалить чужую заявку', async () => {
      const request = makeRequest();
      requestsRepository.findOne.mockResolvedValue(request);
      requestsRepository.remove.mockResolvedValue(request);

      const result = await service.remove(
        'req-1',
        'someone-else',
        UserRole.ADMIN,
      );

      expect(requestsRepository.remove).toHaveBeenCalledWith(request);
      expect(result).toEqual({ message: 'Заявка удалена' });
    });

    it('бросает Forbidden, если не владелец и не админ', async () => {
      requestsRepository.findOne.mockResolvedValue(makeRequest());

      await expect(
        service.remove('req-1', 'someone-else', UserRole.USER),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(requestsRepository.remove).not.toHaveBeenCalled();
    });

    it('бросает NotFound, если заявка не найдена', async () => {
      requestsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove('req-1', 'sender-1', UserRole.USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
