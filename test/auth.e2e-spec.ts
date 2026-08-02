import { INestApplication, ValidationPipe } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { UserEntity } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from 'supertest';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let userRepo: Repository<UserEntity>;

    const testUser = {
        email: 'auth-test@test.com',
        password: '123456',
        name: 'Test Auth User',
    }
    let accessToken: string;
    let refreshToken: string;
    let userId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
              transform: true,
            }),
        );
        await app.init();

        userRepo = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        jwtService = moduleFixture.get<JwtService>(JwtService);

    });

    beforeEach(async () => {
        await userRepo.query('TRUNCATE TABLE users CASCADE;');

        const hashedPassword = await bcrypt.hash(testUser.password, 10);
            
            const user = await userRepo.create({
                name: testUser.name,
                email: testUser.email,
                password: hashedPassword
            });
            await userRepo.save(user);
            userId = user.id;

            const payload = {sub: user.id, email: user.email, role: user.role};
            accessToken = jwtService.sign(payload);
            const rt = jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
                expiresIn: '7d',
            });
            const hashedRefresh = await bcrypt.hash(rt, 10);
            await userRepo.update(userId, { refreshToken: hashedRefresh });
            refreshToken = rt;
    })

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await userRepo.query('TRUNCATE TABLE users CASCADE;');
    });

    describe('POST /auth/register', () => {
        it('should register a new user and return tokens', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'register-test@test.com',
                    password: '123456',
                    name: 'Test register User',
                })
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            expect(response.body.user.email).toBe('register-test@test.com');
        });

        it('should return 400 if email already exists', async () => {
            await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'register-test@test.com',
                    password: '123456',
                    name: 'Test register User',
                })
                .expect(201);

            await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'register-test@test.com',
                    password: '123456',
                    name: 'Test register User',
                })
                .expect(400);
        });
    });

    describe('POST /auth/login', () => {

        it('should login an existent user and return tokens', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({email: testUser.email, password: testUser.password})
                .expect(200)
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            expect(response.body.user.email).toBe(testUser.email);
        });

        it('should return 401 if wrong password', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({email: testUser.email, password: 'testUser.password'})
                .expect(401)
        });
    });

    describe('POST /auth/refresh', () => {

        it('should refresh and return new tokens', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000)); //задержка, чтобы время изменилось и jwtervice сохранил новые токены
            const response = await request(app.getHttpServer())
                .post('/auth/refresh')
                .send({refreshToken})
                .expect(200)
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            expect(response.body.accessToken).not.toEqual(accessToken);
            expect(response.body.refreshToken).not.toEqual(refreshToken);
        });

        it('should return 401 if invalid refreshToken', async () => {
            await request(app.getHttpServer())
                .post('/auth/refresh')
                .send({refreshToken: 'worngRT'})
                .expect(401)
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout and delete refreshToken', async () => {

            const response = await request(app.getHttpServer())
                .post('/auth/logout')
                .send({refreshToken})
                .expect(200)

            expect(response.body).toHaveProperty('message', 'Вы успешно вышли из системы');
            const user = await userRepo.findOne({ where: { id: userId } });
            expect(user?.refreshToken).toBeNull();
        });
    });
})