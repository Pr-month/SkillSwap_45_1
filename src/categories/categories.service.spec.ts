import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';

const makeCategory = (
  overrides: Partial<CategoryEntity> = {},
): CategoryEntity =>
  ({
    id: 'cat-1',
    name: 'Category',
    parent: null,
    children: [],
    ...overrides,
  }) as unknown as CategoryEntity;

describe('CategoriesService', () => {
  let service: CategoriesService;

  const categoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: categoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('создаёт категорию без родителя', async () => {
      const created = makeCategory();
      categoryRepository.create.mockReturnValue(created);
      categoryRepository.save.mockResolvedValue(created);
      categoryRepository.findOne.mockResolvedValue(created);

      const result = await service.create({ name: 'Category' });

      expect(categoryRepository.create).toHaveBeenCalledWith({
        name: 'Category',
      });
      expect(categoryRepository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });

    it('создаёт категорию с родителем', async () => {
      const parent = makeCategory({ id: 'parent-1', name: 'Parent' });
      const created = makeCategory();
      categoryRepository.create.mockReturnValue(created);
      // первый findOne — поиск родителя, второй — финальный возврат
      categoryRepository.findOne
        .mockResolvedValueOnce(parent)
        .mockResolvedValueOnce({ ...created, parent });
      categoryRepository.save.mockResolvedValue(created);

      const result = await service.create({
        name: 'Category',
        parentId: 'parent-1',
      });

      expect(created.parent).toBe(parent);
      expect(categoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...created, parent });
    });

    it('бросает NotFound, если родитель не найден', async () => {
      categoryRepository.create.mockReturnValue(makeCategory());
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({ name: 'Category', parentId: 'missing' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(categoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('возвращает корневые категории с детьми', async () => {
      const data = [makeCategory()];
      categoryRepository.find.mockResolvedValue(data);

      const result = await service.findAll();

      expect(categoryRepository.find).toHaveBeenCalledWith({
        where: { parent: IsNull() },
        relations: { children: true },
      });
      expect(result).toBe(data);
    });
  });

  describe('findOne', () => {
    it('возвращает категорию по id', async () => {
      const category = makeCategory();
      categoryRepository.findOne.mockResolvedValue(category);

      const result = await service.findOne('cat-1');

      expect(result).toBe(category);
    });

    it('бросает NotFound, если категория не найдена', async () => {
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('обновляет поля категории без смены родителя', async () => {
      const category = makeCategory();
      categoryRepository.findOne.mockResolvedValue(category);
      categoryRepository.save.mockResolvedValue({
        ...category,
        name: 'Updated',
      });

      const result = await service.update('cat-1', { name: 'Updated' });

      expect(category.name).toBe('Updated');
      expect(categoryRepository.save).toHaveBeenCalledWith(category);
      expect(result).toEqual({ ...category, name: 'Updated' });
    });

    it('меняет родителя категории', async () => {
      const category = makeCategory();
      const parent = makeCategory({ id: 'parent-1', name: 'Parent' });
      categoryRepository.findOne
        .mockResolvedValueOnce(category)
        .mockResolvedValueOnce(parent);
      categoryRepository.save.mockResolvedValue(category);

      await service.update('cat-1', { parentId: 'parent-1' });

      expect(category.parent).toBe(parent);
      expect(categoryRepository.save).toHaveBeenCalledWith(category);
    });

    it('бросает NotFound, если категория не найдена', async () => {
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing', { name: 'X' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('бросает BadRequest, если категория назначается родителем самой себе', async () => {
      categoryRepository.findOne.mockResolvedValue(makeCategory());

      await expect(
        service.update('cat-1', { parentId: 'cat-1' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('бросает NotFound, если новый родитель не найден', async () => {
      categoryRepository.findOne
        .mockResolvedValueOnce(makeCategory())
        .mockResolvedValueOnce(null);

      await expect(
        service.update('cat-1', { parentId: 'missing' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('удаляет существующую категорию', async () => {
      const category = makeCategory();
      categoryRepository.findOne.mockResolvedValue(category);
      categoryRepository.remove.mockResolvedValue(category);

      const result = await service.remove('cat-1');

      expect(categoryRepository.remove).toHaveBeenCalledWith(category);
      expect(result).toBe(category);
    });

    it('бросает NotFound, если категория не найдена', async () => {
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(categoryRepository.remove).not.toHaveBeenCalled();
    });
  });
});
