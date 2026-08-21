import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { CityEntity } from '../src/cities/entities/city.entity';
import { UserEntity } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../src/users/enums/users.enums';

describe('CitiesController (e2e)', () => {
  let app: INestApplication;
  let cityRepo: Repository<CityEntity>;
  let userRepo: Repository<UserEntity>;
  let jwtService: JwtService;

  const adminData = {
    email: `admin-cities-${Date.now()}@test.com`,
    password: 'admin123',
    name: 'Admin',
    role: UserRole.ADMIN,
  };
  let adminToken: string;

  const userData = {
    email: `user-cities-${Date.now()}@test.com`,
    password: 'user123',
    name: 'User',
    role: UserRole.USER,
  };
  let userToken: string;

  let cityId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    cityRepo = moduleFixture.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    userRepo = moduleFixture.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Очищаем таблицы (порядок важен из-за внешних ключей)
    await cityRepo.query('TRUNCATE TABLE cities, users CASCADE;');

    // Админ
    const admin = userRepo.create({
      email: adminData.email,
      password: await bcrypt.hash(adminData.password, 10),
      name: adminData.name,
      role: adminData.role,
    });
    await userRepo.save(admin);
    adminToken = jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Обычный пользователь (для проверки 403)
    const user = userRepo.create({
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      name: userData.name,
      role: userData.role,
    });
    await userRepo.save(user);
    userToken = jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await cityRepo.query('TRUNCATE TABLE cities CASCADE;');
    const city = cityRepo.create({ name: 'Москва' });
    await cityRepo.save(city);
    cityId = city.id;
  });

  describe('GET /cities', () => {
    it('возвращает список городов (публично)', async () => {
      const response = await request(app.getHttpServer())
        .get('/cities')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('name', 'Москва');
    });

    it('ограничивает выдачу 10 городами', async () => {
      // Добавляем 15 городов
      for (let i = 0; i < 15; i++) {
        await cityRepo.save(cityRepo.create({ name: `Город ${i}` }));
      }

      const response = await request(app.getHttpServer())
        .get('/cities')
        .expect(200);

      expect(response.body.length).toBe(10);
    });

    it('ищет по query параметру search', async () => {
      await cityRepo.save(cityRepo.create({ name: 'Казань' }));

      const response = await request(app.getHttpServer())
        .get('/cities')
        .query({ search: 'Каз' })
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Казань');
    });
  });

  describe('GET /cities/:id', () => {
    it('возвращает город по id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/cities/${cityId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', cityId);
      expect(response.body).toHaveProperty('name', 'Москва');
    });

    it('возвращает 404, если город не найден', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer()).get(`/cities/${fakeId}`).expect(404);
    });
  });

  describe('POST /cities', () => {
    it('создаёт город (только админ)', async () => {
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Новосибирск' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Новосибирск');
    });

    it('возвращает 409 при дубликате', async () => {
      await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Москва' })
        .expect(409);
    });

    it('возвращает 401 без токена', async () => {
      await request(app.getHttpServer())
        .post('/cities')
        .send({ name: 'Тест' })
        .expect(401);
    });

    it('возвращает 403, если пользователь не админ', async () => {
      await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Тест' })
        .expect(403);
    });
  });

  describe('PATCH /cities/:id', () => {
    it('обновляет город (только админ)', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Санкт-Петербург' })
        .expect(200);

      expect(response.body.name).toBe('Санкт-Петербург');
    });

    it('возвращает 404, если город не найден', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/cities/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Тест' })
        .expect(404);
    });

    it('возвращает 403, если пользователь не админ', async () => {
      await request(app.getHttpServer())
        .patch(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Тест' })
        .expect(403);
    });
  });

  describe('DELETE /cities/:id', () => {
    it('удаляет город (только админ)', async () => {
      const toDelete = cityRepo.create({ name: 'Удаляемый' });
      await cityRepo.save(toDelete);

      await request(app.getHttpServer())
        .delete(`/cities/${toDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = await cityRepo.findOne({ where: { id: toDelete.id } });
      expect(found).toBeNull();
    });

    it('возвращает 404, если город не найден', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/cities/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('возвращает 403, если пользователь не админ', async () => {
      await request(app.getHttpServer())
        .delete(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
