import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepo: Repository<SkillEntity>,
  ) {}
  create(createSkillDto: CreateSkillDto, userId: string) {
    const skill = this.skillRepo.create({
      ...createSkillDto,
      owner: { id: userId },
    });
    return this.skillRepo.save(skill);
  }

  findAll() {
    return this.skillRepo.find({ relations: { owner: true } });
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
}
