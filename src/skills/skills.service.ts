import {
  BadRequestException,
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
import { CategoryEntity } from '../categories/entities/category.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepo: Repository<SkillEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}
  async create(createSkillDto: CreateSkillDto, userId: string) {
    let category: CategoryEntity | null = null;
    if (createSkillDto.category) {
      const foundCategory = await this.categoryRepo.findOne({
        where: { id: createSkillDto.category },
      });
      if (!foundCategory) {
        throw new BadRequestException('Указанная категория не найдена');
      }
      category = foundCategory;
    }

    const categoryValue = category ? { id: category.id } : undefined;
    const skill = this.skillRepo.create({
      title: createSkillDto.title,
      description: createSkillDto.description,
      images: createSkillDto.images,
      ...(categoryValue && { category: categoryValue }),
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
      relations: { owner: true, category: true },
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

    let category: any = skill.category;
    if (updateSkillDto.category !== undefined) {
      if (updateSkillDto.category === null) {
        category = null;
      } else {
        const foundCategory = await this.categoryRepo.findOne({
          where: { id: updateSkillDto.category },
        });
        if (!foundCategory) {
          throw new BadRequestException('Указанная категория не найдена');
        }
        category = foundCategory;
      }
    }

    const updateData: any = {};
    if (updateSkillDto.title !== undefined) updateData.title = updateSkillDto.title;
    if (updateSkillDto.description !== undefined) updateData.description = updateSkillDto.description;
    if (updateSkillDto.images !== undefined) updateData.images = updateSkillDto.images;
    // Категория
    if (updateSkillDto.category !== undefined) {
      updateData.category = category;
    }

    await this.skillRepo.update(id, updateData);

    // Возвращаем обновлённый навык
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
