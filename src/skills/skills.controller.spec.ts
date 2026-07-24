import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillEntity } from './entities/skill.entity';
import { UserEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('SkillsController', () => {
  let controller: SkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        SkillsService,
        {
          provide: getRepositoryToken(SkillEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: { findOne: jest.fn(), save: jest.fn() },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SkillsController>(SkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
