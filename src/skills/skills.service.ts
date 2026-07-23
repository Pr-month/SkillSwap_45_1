import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from './entities/skill.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepo: Repository<SkillEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}
  create(createSkillDto: CreateSkillDto, userId: string) {
    const skill = this.skillRepo.create({
      ...createSkillDto,
      owner: { id: userId },
    });
    return this.skillRepo.save(skill);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit; // сколько записей пропустить
    const [data, total] = await this.skillRepo.findAndCount({
      skip,
      take: limit, // сколько записей взять
      relations: { owner: true },
    });

    const totalPages = Math.ceil(total / limit);

    if (total === 0) {
      if (page !== 1) {
        throw new NotFoundException(
          `Page ${page} does not exist. No data available.`,
        );
      }
    } else if (page > totalPages) {
      throw new NotFoundException(
        `Page ${page} does not exist. Total pages: ${totalPages}`,
      );
    }

    return {
      data,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const skill = await this.skillRepo.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto, userId: string) {
    const skill = await this.findOne(id);
    if (skill.owner.id !== userId) {
      throw new ForbiddenException('You can only update your own skills');
    }
    await this.skillRepo.update(id, updateSkillDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const skill = await this.findOne(id);
    if (skill.owner.id !== userId) {
      throw new ForbiddenException('You can only delete your own skills');
    }
    await this.skillRepo.delete(id);
    return { message: `Skill ${id} deleted successfully` };
  }

  async addToFavorites(skillId: string, userId: string) {
    const skill = await this.findOne(skillId);

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { favoriteSkills: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const alreadyInFavorites = user.favoriteSkills.some(
      (favorite) => favorite.id === skill.id,
    );
    if (alreadyInFavorites) {
      throw new ConflictException('Навык уже добавлен в избранное');
    }

    user.favoriteSkills.push(skill);
    await this.userRepo.save(user);

    return { message: 'Навык добавлен в избранное' };
  }
}
