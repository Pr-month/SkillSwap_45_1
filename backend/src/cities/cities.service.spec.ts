import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';
import { CitiesService } from './cities.service';
import { CityEntity } from './entities/city.entity';

const makeCity = (overrides: Partial<CityEntity> = {}): CityEntity =>
  ({
    id: 'city-1',
    name: 'Москва',
    users: [],
    ...overrides,
  }) as unknown as CityEntity;

describe('CitiesService', () => {
  let service: CitiesService;

  const cityRepository = {
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
        CitiesService,
        {
          provide: getRepositoryToken(CityEntity),
          useValue: cityRepository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('создаёт новый город', async () => {
      const city = makeCity();
      cityRepository.findOne.mockResolvedValue(null);
      cityRepository.create.mockReturnValue(city);
      cityRepository.save.mockResolvedValue(city);

      const result = await service.create({ name: 'Москва' });

      expect(cityRepository.create).toHaveBeenCalledWith({ name: 'Москва' });
      expect(cityRepository.save).toHaveBeenCalledWith(city);
      expect(result).toBe(city);
    });

    it('бросает Conflict, если город уже существует', async () => {
      cityRepository.findOne.mockResolvedValue(makeCity());

      await expect(service.create({ name: 'Москва' })).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(cityRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('возвращает список без поиска, ограниченный 10', async () => {
      const data = [makeCity()];
      cityRepository.find.mockResolvedValue(data);

      const result = await service.findAll({});

      expect(cityRepository.find).toHaveBeenCalledWith({
        where: {},
        take: 10,
        order: { name: 'ASC' },
      });
      expect(result).toBe(data);
    });

    it('фильтрует по названию при передаче search', async () => {
      const data = [makeCity()];
      cityRepository.find.mockResolvedValue(data);

      await service.findAll({ search: 'Мос' });

      expect(cityRepository.find).toHaveBeenCalledWith({
        where: { name: ILike('%Мос%') },
        take: 10,
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('возвращает город по id', async () => {
      const city = makeCity();
      cityRepository.findOne.mockResolvedValue(city);

      const result = await service.findOne('city-1');

      expect(result).toBe(city);
    });

    it('бросает NotFound, если город не найден', async () => {
      cityRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('обновляет город', async () => {
      const city = makeCity();
      cityRepository.findOne.mockResolvedValue(city);
      cityRepository.save.mockResolvedValue({ ...city, name: 'Казань' });

      const result = await service.update('city-1', { name: 'Казань' });

      expect(city.name).toBe('Казань');
      expect(cityRepository.save).toHaveBeenCalledWith(city);
      expect(result).toEqual({ ...city, name: 'Казань' });
    });

    it('бросает NotFound, если город не найден', async () => {
      cityRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing', { name: 'X' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('удаляет существующий город', async () => {
      const city = makeCity();
      cityRepository.findOne.mockResolvedValue(city);
      cityRepository.remove.mockResolvedValue(city);

      const result = await service.remove('city-1');

      expect(cityRepository.remove).toHaveBeenCalledWith(city);
      expect(result).toBe(city);
    });

    it('бросает NotFound, если город не найден', async () => {
      cityRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(cityRepository.remove).not.toHaveBeenCalled();
    });
  });
});
