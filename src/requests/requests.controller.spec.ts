import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RequestEntity } from './entities/request.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('RequestsController', () => {
  let controller: RequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(RequestEntity),
          useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn() },
        },
        {
          provide: getRepositoryToken(SkillEntity),
          useValue: { findOne: jest.fn() },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RequestsController>(RequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
