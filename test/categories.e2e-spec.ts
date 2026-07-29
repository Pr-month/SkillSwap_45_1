import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { CategoryEntity } from '../src/categories/entities/category.entity';
import { UserEntity } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../src/users/enums/users.enums';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: Repository<CategoryEntity>;
  let userRepo: Repository<UserEntity>;
  let jwtService: JwtService;

  // Данные админа
  const adminData = {
    email: `admin-${Date.now()}@test.com`,
    password: 'admin123',
    name: 'Admin',
    role: UserRole.ADMIN,
  };
  let adminId: string;
  let adminToken: string;

  // Данные обычного пользователя (для проверки 403)
  const userData = {
    email: `user-${Date.now()}@test.com`,
    password: 'user123',
    name: 'User',
    role: UserRole.USER,
  };
  let userId: string;
  let userToken: string;

  // Созданные категории для тестов
  let rootCategoryId: string;
  let childCategoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    categoryRepo = moduleFixture.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    userRepo = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Очищаем таблицы (порядок важен из-за внешних ключей)
    await categoryRepo.query('TRUNCATE TABLE categories, users CASCADE;');

    // Создаём админа
    const hashedAdminPassword = await bcrypt.hash(adminData.password, 10);
    const admin = userRepo.create({
      email: adminData.email,
      password: hashedAdminPassword,
      name: adminData.name,
      role: adminData.role,
    });
    await userRepo.save(admin);
    adminId = admin.id;
    const adminPayload = { sub: admin.id, email: admin.email, role: admin.role };
    adminToken = jwtService.sign(adminPayload);

    // Создаём обычного пользователя
    const hashedUserPassword = await bcrypt.hash(userData.password, 10);
    const user = userRepo.create({
      email: userData.email,
      password: hashedUserPassword,
      name: userData.name,
      role: userData.role,
    });
    await userRepo.save(user);
    userId = user.id;
    const userPayload = { sub: user.id, email: user.email, role: user.role };
    userToken = jwtService.sign(userPayload);

    // Создаём корневую категорию
    const rootCategory = categoryRepo.create({ name: 'Root Category' });
    await categoryRepo.save(rootCategory);
    rootCategoryId = rootCategory.id;

    // Создаём дочернюю категорию
    const childCategory = categoryRepo.create({
      name: 'Child Category',
      parent: rootCategory,
    });
    await categoryRepo.save(childCategory);
    childCategoryId = childCategory.id;
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Очищаем только категории после каждого теста
    await categoryRepo.query('TRUNCATE TABLE categories CASCADE;');
    // Заново создаём корневую и дочернюю для следующих тестов
    const root = categoryRepo.create({ name: 'Root Category' });
    await categoryRepo.save(root);
    rootCategoryId = root.id;
    const child = categoryRepo.create({ name: 'Child Category', parent: root });
    await categoryRepo.save(child);
    childCategoryId = child.id;
  });

  describe('GET /categories', () => {
    it('should return all root categories with children (public)', async () => {
      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1); // только одна корневая
      expect(response.body[0]).toHaveProperty('id', rootCategoryId);
      expect(response.body[0]).toHaveProperty('name', 'Root Category');
      expect(response.body[0]).toHaveProperty('children');
      expect(response.body[0].children).toBeInstanceOf(Array);
      expect(response.body[0].children.length).toBe(1);
      expect(response.body[0].children[0].id).toBe(childCategoryId);
    });

    it('should return empty array if no categories', async () => {
      // Очищаем все категории
      await categoryRepo.query('TRUNCATE TABLE categories CASCADE;');
      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a single category (public)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/categories/${rootCategoryId}`)
        .expect(200);
      
      // findOne реализован в другом ПР
      expect(response.body).toHaveProperty('id', rootCategoryId);
      expect(response.body).toHaveProperty('name', 'Root Category');
    });

    it('should return 404 if category not found', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/categories/${fakeId}`)
        .expect(404);
    });
  });

  describe('POST /categories', () => {
    it('should create a new category (admin only)', async () => {
      const createDto = { name: 'New Category' };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createDto.name);
      expect(response.body.parent).toBeNull();
    });

    it('should create a subcategory with parentId', async () => {
      const createDto = {
        name: 'Subcategory',
        parentId: rootCategoryId,
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body.name).toBe(createDto.name);
      expect(response.body.parent.id).toBe(rootCategoryId);
    });

    it('should return 404 if parentId does not exist', async () => {
      const createDto = {
        name: 'Invalid Subcategory',
        parentId: '00000000-0000-0000-0000-000000000000',
      };

      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createDto)
        .expect(404);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .post('/categories')
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should return 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test' })
        .expect(403);
    });
  });

  describe('PATCH /categories/:id', () => {
    it('should update category name (admin only)', async () => {
      const updateDto = { name: 'Updated Root' };

      const response = await request(app.getHttpServer())
        .patch(`/categories/${rootCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.name).toBe(updateDto.name);
    });

    it('should update category parent', async () => {
      // Создаём новую корневую категорию для переноса
      const newRoot = categoryRepo.create({ name: 'New Root' });
      await categoryRepo.save(newRoot);

      const updateDto = { parentId: newRoot.id };

      const response = await request(app.getHttpServer())
        .patch(`/categories/${childCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.parent.id).toBe(newRoot.id);
    });

    it('should return 400 if trying to set parent to itself', async () => {
      const updateDto = { parentId: rootCategoryId };

      await request(app.getHttpServer())
        .patch(`/categories/${rootCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(400);
    });

    it('should return 404 if parentId not found', async () => {
      const updateDto = { parentId: '00000000-0000-0000-0000-000000000000' };

      await request(app.getHttpServer())
        .patch(`/categories/${rootCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(404);
    });

    it('should return 404 if category not found', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/categories/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test' })
        .expect(404);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .patch(`/categories/${rootCategoryId}`)
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should return 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .patch(`/categories/${rootCategoryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test' })
        .expect(403);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete category (admin only)', async () => {
      // Создаём категорию специально для удаления
      const toDelete = categoryRepo.create({ name: 'To Delete' });
      await categoryRepo.save(toDelete);

      await request(app.getHttpServer())
        .delete(`/categories/${toDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Проверяем, что категория удалена
      const found = await categoryRepo.findOne({ where: { id: toDelete.id } });
      expect(found).toBeNull();
    });

    it('should return 404 if category not found', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/categories/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should return 401 if no token', async () => {
      await request(app.getHttpServer())
        .delete(`/categories/${rootCategoryId}`)
        .expect(401);
    });

    it('should return 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .delete(`/categories/${rootCategoryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});