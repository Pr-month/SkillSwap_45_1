import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from './entities/request.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestsRepository: Repository<RequestEntity>,
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

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
