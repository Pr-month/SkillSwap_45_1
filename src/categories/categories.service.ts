import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';


@Injectable()
export class CategoriesService {
    constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}



  async create(createCategoryDto: CreateCategoryDto) {
    const { name, parentId } = createCategoryDto;

    const category = this.categoryRepository.create({
      name,
    });

    if (parentId) {
      const parent = await this.categoryRepository.findOne({
        where: {
          id: parentId,
        },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }


  findAll() {
    return this.categoryRepository.find({
      where: {
        parent: IsNull(),
      },
      relations: {
        children: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { parentId, ...rest } = updateCategoryDto;

    if (parentId !== undefined) {
      if (parentId === id) {
        throw new BadRequestException(
          'Категория не может быть родителем самой себя',
        );
      }
      const parent = await this.repo.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parent;
    }

    Object.assign(category, rest);

    return this.repo.save(category);
  }

  async remove(id: string) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.repo.remove(category);
  }
}
