import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from './entities/request.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { Repository } from 'typeorm';
import { RequestStatus } from './enums/requests.enums';
import { SkillsService } from 'src/skills/skills.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestsRepository: Repository<RequestEntity>,
    private skillsService: SkillsService,
    @InjectRepository(SkillEntity)
    private readonly skillsRepository: Repository<SkillEntity>,
  ) {}

  async create(createRequestDto: CreateRequestDto, senderId: string) {
    const { requestedSkillId, offeredSkillId } = createRequestDto;

    const requestedSkill = await this.skillsRepository.findOne({
      where: { id: requestedSkillId },
      relations: { owner: true },
    });
    if (!requestedSkill) {
      throw new NotFoundException('Запрашиваемый навык не найден');
    }

    const offeredSkill = await this.skillsRepository.findOne({
      where: { id: offeredSkillId },
      relations: { owner: true },
    });
    if (!offeredSkill) {
      throw new NotFoundException('Предлагаемый навык не найден');
    }

    if (offeredSkill.owner.id !== senderId) {
      throw new ForbiddenException('Вы можете предлагать только свои навыки');
    }

    const receiverId = requestedSkill.owner.id;

    if (receiverId === senderId) {
      throw new BadRequestException('Нельзя отправить заявку самому себе');
    }

    const request = this.requestsRepository.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      offeredSkill: { id: offeredSkillId },
      requestedSkill: { id: requestedSkillId },
    });

    return this.requestsRepository.save(request);
  }

  async findIncoming(userId: string) {
    return this.requestsRepository.find({
      where: {
        receiver: {
          id: userId,
        },
      },
      relations: {
        sender: true,
        receiver: true,
        offeredSkill: true,
        requestedSkill: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOutgoing(userId: string) {
    return this.requestsRepository.find({
      where: {
        sender: {
          id: userId,
        },
      },
      relations: {
        sender: true,
        receiver: true,
        offeredSkill: true,
        requestedSkill: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findAll() {
    return `This action returns all requests`;
  }

  findOne(id: string) {
    return `This action returns a #${id} request`;
  }

  async markAsRead(requestId: string, currentUserId: string) {
    const request = await this.findRequestOrFail(requestId);
    this.ensureReceiver(request, currentUserId);
    request.isRead = true;
    await this.requestsRepository.save(request);
    return request;
  }

  async accept(requestId: string, currentUserId: string) {
    const request = await this.findRequestOrFail(requestId);
    this.ensureReceiver(request, currentUserId);
    this.ensurePending(request);

    await this.exchangeSkills(request);

    request.status = RequestStatus.ACCEPTED;
    await this.requestsRepository.save(request);
    return request;
  }

  async reject(requestId: string, currentUserId: string) {
    const request = await this.findRequestOrFail(requestId);
    this.ensureReceiver(request, currentUserId);
    this.ensurePending(request);

    request.status = RequestStatus.REJECTED;
    await this.requestsRepository.save(request);
    return request;
  }

  private async findRequestOrFail(requestId: string): Promise<RequestEntity> {
    const request = await this.requestsRepository.findOne({
      where: { id: requestId },
      relations: {sender:true , receiver:true, offeredSkill:true, requestedSkill:true},
    });
    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }
    return request;
  }

  // проверяем что пользователь - получатель
  private ensureReceiver(request: RequestEntity, currentUserId: string) {
    if (request.receiver.id !== currentUserId) {
      throw new ForbiddenException('Только получатель может изменить статус заявки');
    }
  }

  // проверяем что статус pending
  private ensurePending(request: RequestEntity) {
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Статус уже изменён');
    }
  }

  // обмен навыками
  private async exchangeSkills(request: RequestEntity) {
    const { sender, receiver, offeredSkill, requestedSkill } = request;

    // Копия предлагаемого навыка для получателя
    await this.skillsService.create(
      {
        title: offeredSkill.title,
        description: offeredSkill.description,
        categoryId: offeredSkill.category?.id,
        images: offeredSkill.images,
      },
      receiver.id,
    );

    // Копия запрашиваемого навыка для отправителя
    await this.skillsService.create(
      {
        title: requestedSkill.title,
        description: requestedSkill.description,
        categoryId: requestedSkill.category?.id,
        images: requestedSkill.images,
      },
      sender.id,
    );
  }

  remove(id: string) {
    return `This action removes a #${id} request`;
  }
}
