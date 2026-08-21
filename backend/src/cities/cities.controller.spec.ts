import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('CitiesController', () => {
  let controller: CitiesController;

  const citiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [{ provide: CitiesService, useValue: citiesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create передаёт dto в сервис', async () => {
    const dto = { name: 'Москва' };
    await controller.create(dto);
    expect(citiesService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll передаёт query в сервис', async () => {
    const query = { search: 'Мос' };
    await controller.findAll(query);
    expect(citiesService.findAll).toHaveBeenCalledWith(query);
  });

  it('findOne передаёт id в сервис', async () => {
    await controller.findOne('city-1');
    expect(citiesService.findOne).toHaveBeenCalledWith('city-1');
  });

  it('update передаёт id и dto в сервис', async () => {
    const dto = { name: 'Казань' };
    await controller.update('city-1', dto);
    expect(citiesService.update).toHaveBeenCalledWith('city-1', dto);
  });

  it('remove передаёт id в сервис', async () => {
    await controller.remove('city-1');
    expect(citiesService.remove).toHaveBeenCalledWith('city-1');
  });
});
