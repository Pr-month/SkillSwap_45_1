import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../src/users/enums/users.enums';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<UserEntity>;
  let jwtService: JwtService;

  const testUser = {
    email: 'testuser@test.com',
    password: '123456',
    name: 'Test User',
    role: UserRole.USER,
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

    userRepo = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // Очищаем таблицу перед каждым тестом
    await userRepo.query('TRUNCATE TABLE users CASCADE;');

    // Создаём тестового пользователя для защищённых эндпоинтов
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = userRepo.create({
      email: testUser.email,
      password: hashedPassword,
      name: testUser.name,
      role: testUser.role,
    });
    await userRepo.save(user);
    userId = user.id;

    const payload = { sub: user.id, email: user.email, role: user.role };
    accessToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return array of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'newuser@test.com',
        password: '123456',
        name: 'New User',
      };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return 404 for non-existing id', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/users/${fakeId}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', async () => {
      const updateDto = { name: 'Updated Name' };
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body.name).toBe(updateDto.name);
    });

    it('should return 404 for non-existing id', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/users/${fakeId}`)
        .send({ name: 'test' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      // Создаём отдельного пользователя для удаления
      const toDelete = userRepo.create({
        email: 'delete@test.com',
        password: await bcrypt.hash('123456', 10),
        name: 'ToDelete',
      });
      await userRepo.save(toDelete);

      await request(app.getHttpServer())
        .delete(`/users/${toDelete.id}`)
        .expect(200);

      // Проверяем, что удалён
      const found = await userRepo.findOne({ where: { id: toDelete.id } });
      expect(found).toBeNull();
    });

    it('should return 404 for non-existing id', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/users/${fakeId}`)
        .expect(404);
    });
  });

  describe('GET /users/me', () => {
    it('should return current user data with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .expect(401);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update current user profile', async () => {
      const updateDto = { name: 'New Profile Name' };
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);
      expect(response.body.name).toBe(updateDto.name);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({ name: 'test' })
        .expect(401);
    });
  });

  describe('PATCH /users/me/password', () => {
    it('should change password with correct old password', async () => {
      const dto = {
        oldPassword: testUser.password,
        newPassword: 'newPassword123',
      };
      await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);
    });

    it('should return 401 if old password is wrong', async () => {
      const dto = {
        oldPassword: 'wrong',
        newPassword: 'newPassword123',
      };
      await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(401);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ oldPassword: '123456', newPassword: 'new' })
        .expect(401);
    });
  });
});