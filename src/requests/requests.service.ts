import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from './entities/request.entity';
import { Repository } from 'typeorm';
import { RequestStatus } from './enums/requests.enums';
import { SkillsService } from 'src/skills/skills.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestsRepository: Repository<RequestEntity>,
    private skillsService: SkillsService,
  ) {}

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

  findOne(id: number) {
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
        category: offeredSkill.category,
        images: offeredSkill.images,
      },
      receiver.id,
    );

    // Копия запрашиваемого навыка для отправителя
    await this.skillsService.create(
      {
        title: requestedSkill.title,
        description: requestedSkill.description,
        category: requestedSkill.category,
        images: requestedSkill.images,
      },
      sender.id,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
