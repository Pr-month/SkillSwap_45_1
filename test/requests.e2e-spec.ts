import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AppModule } from "src/app.module";
import { RequestEntity } from "src/requests/entities/request.entity";
import { SkillEntity } from "src/skills/entities/skill.entity";
import request from 'supertest';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserEntity } from "src/users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { describe, it, beforeAll, afterAll, afterEach, beforeEach, expect } from '@jest/globals';

describe('RequestsController (e2e)', () => {
    let app: INestApplication;
    let requestsRepository: Repository<RequestEntity>;
    let skillsRepository: Repository<SkillEntity>;
    let usersRepo: Repository<UserEntity>;
    let jwtService: JwtService;

    const senderData = {
        email: 'sender@test.com',
        password: '123456',
        name: 'Sender',
    };
    let senderId: string;
    let senderToken: string;

    const receiverData = {
        email: 'receiver@test.com',
        password: '123456',
        name: 'Receiver',
    };
    let receiverId: string;
    let receiverToken: string;

    let senderSkillId: string;
    let receiverSkillId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({imports: [AppModule]}).compile();
        
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));

        await app.init();

        requestsRepository = moduleFixture.get<Repository<RequestEntity>>(getRepositoryToken(RequestEntity));
        skillsRepository = moduleFixture.get<Repository<SkillEntity>>(getRepositoryToken(SkillEntity));
        jwtService = moduleFixture.get<JwtService>(JwtService);
        usersRepo = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

        await requestsRepository.query('TRUNCATE TABLE requests, skills, users CASCADE;');

        const hashedSenderPassword = await bcrypt.hash(senderData.password, 10);
        const sender = usersRepo.create({
            email: senderData.email,
            password: hashedSenderPassword,
            name: senderData.name
        });
        await usersRepo.save(sender);
        senderId = sender.id;

        const senderPayload = {sub: sender.id, email: sender.email, role: sender.role};
        senderToken = jwtService.sign(senderPayload);

        const hashedReceiverPassword = await bcrypt.hash(receiverData.password, 10);
        const receiver = usersRepo.create({
            email: receiverData.email,
            password: hashedReceiverPassword,
            name: receiverData.name
        });
        await usersRepo.save(receiver);
        receiverId = receiver.id;

        const receiverPayload = {sub: receiver.id, email: receiver.email, role: receiver.role};
        receiverToken = jwtService.sign(receiverPayload);

        const senderSkill = skillsRepository.create({
            title: 'Guitar',
            description: 'Learn chords',
            owner: {id: sender.id}
        });
        await skillsRepository.save(senderSkill);
        senderSkillId = senderSkill.id;

        const receiverSkill = skillsRepository.create({
            title: 'Piano',
            description: 'Play piano',
            owner: {id: receiver.id}
        });
        await skillsRepository.save(receiverSkill);
        receiverSkillId = receiverSkill.id;
        
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await requestsRepository.query('TRUNCATE TABLE requests CASCADE;');
    });

    describe('POST /requests', () => {
        it('should create a new request when authenticated', async () => {
            const createDto = {
                requestedSkillId: receiverSkillId,
                offeredSkillId: senderSkillId,
            };

            const response = await request(app.getHttpServer())
                .post('/requests')
                .set('Authorization', `Bearer ${senderToken}`)
                .send(createDto)
                .expect(201)
            
            expect(response.body).toHaveProperty('id');
            expect(response.body.requestedSkill.id).toBe(receiverSkillId);
            expect(response.body.sender.id).toBe(senderId);
            expect(response.body.offeredSkill.id).toBe(senderSkillId);
            expect(response.body.receiver.id).toBe(receiverId);
            expect(response.body.status).toBe('pending');
            expect(response.body.isRead).toBe(false);
        });

        it('should return 401 if no token', async () => {
            await request(app.getHttpServer())
                .post('/requests')
                .send({
                    requestedSkillId: receiverSkillId,
                    offeredSkillId: senderSkillId,
                })
                .expect(401);
        });

        it('should return 403 if trying to offer someone elses skill', async () => {
            const createDto = {
                requestedSkillId: receiverSkillId,
                offeredSkillId: receiverSkillId,
            };
            await request(app.getHttpServer())
                .post('/requests')
                .set('Authorization', `Bearer ${senderToken}`)
                .send(createDto)
                .expect(403);
        })
    });

    describe('GET /requests/incoming', () => {
        beforeEach(async () => {
            const request = requestsRepository.create({
                sender: { id: senderId },
                receiver: { id: receiverId },
                offeredSkill: { id: senderSkillId },
                requestedSkill: { id: receiverSkillId },
            });
            await requestsRepository.save(request);
        });

        it('should return incoming requests for receiver', async () => {
        const response = await request(app.getHttpServer())
            .get('/requests/incoming')
            .set('Authorization', `Bearer ${receiverToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(response.body[0].sender.id).toBe(senderId);
        expect(response.body[0].receiver.id).toBe(receiverId);
        });

        it('should return 401 without token', async () => {
            await request(app.getHttpServer())
                .get('/requests/incoming')
                .expect(401);
        });
    });

    describe('GET /requests/outgoing', () => {
        beforeEach(async () => {
            const request = requestsRepository.create({
                sender: { id: senderId },
                receiver: { id: receiverId },
                offeredSkill: { id: senderSkillId },
                requestedSkill: { id: receiverSkillId },
            });
            await requestsRepository.save(request);
        });

        it('should return outgoing requests for sender', async () => {
            const response = await request(app.getHttpServer())
                .get('/requests/outgoing')
                .set('Authorization', `Bearer ${senderToken}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].sender.id).toBe(senderId);
            expect(response.body[0].receiver.id).toBe(receiverId);
        });

        it('should return 401 without token', async () => {
            await request(app.getHttpServer())
                .get('/requests/outgoing')
                .expect(401);
        });
    });

    describe('PATCH /requests/:id/accept', () => {
        let requestId: string;

        beforeEach(async () => {
            const request = requestsRepository.create({
                sender: { id: senderId },
                receiver: { id: receiverId },
                offeredSkill: { id: senderSkillId },
                requestedSkill: { id: receiverSkillId },
            });
            await requestsRepository.save(request);
            requestId = request.id;
        });

        it('should accept request and exchange skills', async () => {
            // Получаем начальное количество навыков у пользователей
            const senderSkillsBefore = await skillsRepository.count({ where: { owner: { id: senderId } } });
            const receiverSkillsBefore = await skillsRepository.count({ where: { owner: { id: receiverId } } });

            const response = await request(app.getHttpServer())
                .patch(`/requests/${requestId}/accept`)
                .set('Authorization', `Bearer ${receiverToken}`)
                .expect(200);

            expect(response.body.status).toBe('accepted');

            // Проверяем, что навыки добавились (появились копии)
            const senderSkillsAfter = await skillsRepository.count({ where: { owner: { id: senderId } } });
            const receiverSkillsAfter = await skillsRepository.count({ where: { owner: { id: receiverId } } });

            // У каждого должно появиться по одному новому навыку
            expect(senderSkillsAfter).toBe(senderSkillsBefore + 1);
            expect(receiverSkillsAfter).toBe(receiverSkillsBefore + 1);
        });

        it('should return 403 if not receiver', async () => {
            // Sender пытается принять свою же заявку
            await request(app.getHttpServer())
                .patch(`/requests/${requestId}/accept`)
                .set('Authorization', `Bearer ${senderToken}`)
                .expect(403);
        });

        it('should return 400 if request not pending', async () => {
            // Сначала отклоняем заявку
            await request(app.getHttpServer())
                .patch(`/requests/${requestId}/reject`)
                .set('Authorization', `Bearer ${receiverToken}`)
                .expect(200);

            // Затем пытаемся принять уже отклонённую
            await request(app.getHttpServer())
                .patch(`/requests/${requestId}/accept`)
                .set('Authorization', `Bearer ${receiverToken}`)
                .expect(400);
        });
    });

    describe('PATCH /requests/:id/reject', () => {
        let requestId: string;

        beforeEach(async () => {
            const request = requestsRepository.create({
                sender: { id: senderId },
                receiver: { id: receiverId },
                offeredSkill: { id: senderSkillId },
                requestedSkill: { id: receiverSkillId },
            });
            await requestsRepository.save(request);
            requestId = request.id;
        });

        it('should reject request', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/requests/${requestId}/reject`)
                .set('Authorization', `Bearer ${receiverToken}`)
                .expect(200);

            expect(response.body.status).toBe('rejected');
        });

        it('should return 403 if not receiver', async () => {
            await request(app.getHttpServer())
                .patch(`/requests/${requestId}/reject`)
                .set('Authorization', `Bearer ${senderToken}`)
                .expect(403);
        });
    });

    describe('PATCH /requests/:id/read', () => {
        let requestId: string;

        beforeEach(async () => {
            const request = requestsRepository.create({
                sender: { id: senderId },
                receiver: { id: receiverId },
                offeredSkill: { id: senderSkillId },
                requestedSkill: { id: receiverSkillId },
            });
            await requestsRepository.save(request);
            requestId = request.id;
        });

        it('should mark request as read', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/requests/${requestId}/read`)
                .set('Authorization', `Bearer ${receiverToken}`)
                .expect(200);

            expect(response.body.isRead).toBe(true);
        });

        it('should return 403 if not receiver', async () => {
            await request(app.getHttpServer())
                .patch(`/requests/${requestId}/read`)
                .set('Authorization', `Bearer ${senderToken}`)
                .expect(403);
        });
    });
})