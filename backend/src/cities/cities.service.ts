import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { FindCitiesQueryDto } from './dto/find-cities-query.dto';

// Ограничение выдачи списка городов
const CITIES_LIMIT = 10;

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const existing = await this.cityRepository.findOne({
      where: { name: createCityDto.name },
    });
    if (existing) {
      throw new ConflictException('Город с таким названием уже существует');
    }

    const city = this.cityRepository.create({ name: createCityDto.name });
    return this.cityRepository.save(city);
  }

  // Поиск по query параметрам, результат ограничен 10 городами
  findAll(query: FindCitiesQueryDto) {
    const { search } = query;
    return this.cityRepository.find({
      where: search ? { name: ILike(`%${search}%`) } : {},
      take: CITIES_LIMIT,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City with id ${id} not found`);
    }
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);
    Object.assign(city, updateCityDto);
    return this.cityRepository.save(city);
  }

  async remove(id: string) {
    const city = await this.findOne(id);
    return this.cityRepository.remove(city);
  }
}
