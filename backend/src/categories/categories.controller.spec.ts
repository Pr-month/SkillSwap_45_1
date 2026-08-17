import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const categoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: categoriesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create передаёт dto в сервис', async () => {
    const dto = { name: 'Category' };
    await controller.create(dto);
    expect(categoriesService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll вызывает сервис', async () => {
    await controller.findAll();
    expect(categoriesService.findAll).toHaveBeenCalled();
  });

  it('findOne передаёт id в сервис', async () => {
    await controller.findOne('cat-1');
    expect(categoriesService.findOne).toHaveBeenCalledWith('cat-1');
  });

  it('update передаёт id и dto в сервис', async () => {
    const dto = { name: 'Updated' };
    await controller.update('cat-1', dto);
    expect(categoriesService.update).toHaveBeenCalledWith('cat-1', dto);
  });

  it('remove передаёт id в сервис', async () => {
    await controller.remove('cat-1');
    expect(categoriesService.remove).toHaveBeenCalledWith('cat-1');
  });
});
