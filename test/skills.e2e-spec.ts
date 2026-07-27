import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../src/users/entities/user.entity';
import { SkillEntity } from '../src/skills/entities/skill.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('SkillsController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<UserEntity>;
  let skillRepo: Repository<SkillEntity>;
  let jwtService: JwtService;

  // Данные тестового пользователя
  const testUser = {
    email: 'skills-test@test.com',
    password: '123456',
    name: 'Test Skills User',
  };
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    userRepo = moduleFixture.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    skillRepo = moduleFixture.get<Repository<SkillEntity>>(
      getRepositoryToken(SkillEntity),
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Очищаем таблицы перед тестами
    await skillRepo.query('TRUNCATE TABLE skills, users, categories CASCADE;');
    // await userRepo.clear();

    // Создаём тестового пользователя и получаем токен
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = userRepo.create({
      email: testUser.email,
      password: hashedPassword,
      name: testUser.name,
    });
    await userRepo.save(user);
    userId = user.id;

    // Генерируем access-токен
    const payload = { sub: user.id, email: user.email, role: user.role };
    accessToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await app.close();
  });

  // Очищаем навыки после каждого теста (чтобы не мешали друг другу)
  afterEach(async () => {
    await skillRepo.query('TRUNCATE TABLE skills CASCADE;');
  });

  describe('POST /skills', () => {
    it('should create a new skill when authenticated', async () => {
      const createDto = {
        title: 'Guitar',
        description: 'Learn chords',
      };

      const response = await request(app.getHttpServer())
        .post('/skills')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createDto.title);
      expect(response.body.owner).toHaveProperty('id', userId);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .post('/skills')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('GET /skills', () => {
    beforeEach(async () => {
      // Создаём несколько навыков для теста пагинации
      for (let i = 1; i <= 5; i++) {
        const skill = skillRepo.create({
          title: `Skill ${i}`,
          description: `Description ${i}`,
          owner: { id: userId },
        });
        await skillRepo.save(skill);
      }
    });

    it('should return paginated list with default limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/skills')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('limit', 20);
      expect(response.body.data.length).toBe(5); // всего 5 записей
      expect(response.body.meta.totalItems).toBe(5);
    });

    it('should respect page and limit params', async () => {
      const response = await request(app.getHttpServer())
        .get('/skills?page=1&limit=2')
        .expect(200);

      expect(response.body.data.length).toBe(2);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(2);
      expect(response.body.meta.totalPages).toBe(3); // 5 / 2 = 3
    });

    it('should return 404 when page out of range', async () => {
      await request(app.getHttpServer())
        .get('/skills?page=10&limit=2')
        .expect(404);
    });
  });

  describe('GET /skills/:id', () => {
    let skillId: string;

    beforeEach(async () => {
      const skill = skillRepo.create({
        title: 'Test skill',
        description: 'For testing',
        owner: { id: userId },
      });
      await skillRepo.save(skill);
      skillId = skill.id;
    });

    it('should return skill by id with auth', async () => {
      const response = await request(app.getHttpServer())
        .get(`/skills/${skillId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(skillId);
      expect(response.body.title).toBe('Test skill');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get(`/skills/${skillId}`).expect(401);
    });

    it('should return 404 for non-existing id', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/skills/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /skills/:id', () => {
    let skillId: string;

    beforeEach(async () => {
      const skill = skillRepo.create({
        title: 'Original title',
        description: 'Original description',
        owner: { id: userId },
      });
      await skillRepo.save(skill);
      skillId = skill.id;
    });

    it('should update skill when owner', async () => {
      const updateDto = {
        title: 'Updated title',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/skills/${skillId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.title).toBe(updateDto.title);
      expect(response.body.description).toBe(updateDto.description);
    });

    it("should return 403 when trying to update another user's skill", async () => {
      // Создаём другого пользователя и его навык
      const otherUser = userRepo.create({
        email: 'other@test.com',
        password: await bcrypt.hash('123456', 10),
        name: 'Other',
      });
      await userRepo.save(otherUser);
      const otherSkill = skillRepo.create({
        title: 'Other skill',
        description: 'Other desc',
        owner: { id: otherUser.id },
      });
      await skillRepo.save(otherSkill);

      // Пытаемся обновить под своим токеном
      await request(app.getHttpServer())
        .patch(`/skills/${otherSkill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Hacked' })
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .patch(`/skills/${skillId}`)
        .send({ title: 'New' })
        .expect(401);
    });
  });

  describe('DELETE /skills/:id', () => {
    let skillId: string;

    beforeEach(async () => {
      const skill = skillRepo.create({
        title: 'To be deleted',
        description: 'This skill will be removed',
        owner: { id: userId },
      });
      await skillRepo.save(skill);
      skillId = skill.id;
    });

    it('should delete skill when owner', async () => {
      await request(app.getHttpServer())
        .delete(`/skills/${skillId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200); // или 204, в зависимости от реализации

      // Проверяем, что навык удалён
      const found = await skillRepo.findOne({ where: { id: skillId } });
      expect(found).toBeNull();
    });

    it("should return 403 when trying to delete another user's skill", async () => {
      const otherUser = userRepo.create({
        email: 'other2@test.com',
        password: await bcrypt.hash('123456', 10),
        name: 'Other2',
      });
      await userRepo.save(otherUser);
      const otherSkill = skillRepo.create({
        title: 'Other skill 2',
        description: 'Other desc 2',
        owner: { id: otherUser.id },
      });
      await skillRepo.save(otherSkill);

      await request(app.getHttpServer())
        .delete(`/skills/${otherSkill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .delete(`/skills/${skillId}`)
        .expect(401);
    });
  });
});
