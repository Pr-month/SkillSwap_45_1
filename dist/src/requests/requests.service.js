"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_entity_1 = require("./entities/request.entity");
const skill_entity_1 = require("../skills/entities/skill.entity");
const typeorm_2 = require("typeorm");
const requests_enums_1 = require("./enums/requests.enums");
const skills_service_1 = require("../skills/skills.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const notification_payload_type_1 = require("../notifications/types/notification-payload.type");
const users_enums_1 = require("../users/enums/users.enums");
let RequestsService = class RequestsService {
    requestsRepository;
    skillsService;
    skillsRepository;
    notificationsGateway;
    constructor(requestsRepository, skillsService, skillsRepository, notificationsGateway) {
        this.requestsRepository = requestsRepository;
        this.skillsService = skillsService;
        this.skillsRepository = skillsRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async create(createRequestDto, senderId) {
        const { requestedSkillId, offeredSkillId } = createRequestDto;
        const requestedSkill = await this.skillsRepository.findOne({
            where: { id: requestedSkillId },
            relations: { owner: true },
        });
        if (!requestedSkill) {
            throw new common_1.NotFoundException('Запрашиваемый навык не найден');
        }
        const offeredSkill = await this.skillsRepository.findOne({
            where: { id: offeredSkillId },
            relations: { owner: true },
        });
        if (!offeredSkill) {
            throw new common_1.NotFoundException('Предлагаемый навык не найден');
        }
        if (offeredSkill.owner.id !== senderId) {
            throw new common_1.ForbiddenException('Вы можете предлагать только свои навыки');
        }
        const receiverId = requestedSkill.owner.id;
        if (receiverId === senderId) {
            throw new common_1.BadRequestException('Нельзя отправить заявку самому себе');
        }
        const request = this.requestsRepository.create({
            sender: { id: senderId },
            receiver: { id: receiverId },
            offeredSkill: { id: offeredSkillId },
            requestedSkill: { id: requestedSkillId },
        });
        const savedRequest = await this.requestsRepository.save(request);
        this.notificationsGateway.notifyUser(receiverId, {
            type: notification_payload_type_1.NotificationType.NEW_REQUEST,
            skillTitle: requestedSkill.title,
            fromUser: offeredSkill.owner.name,
        });
        return savedRequest;
    }
    async findIncoming(userId) {
        return this.requestsRepository.find({
            where: {
                receiver: {
                    id: userId,
                },
            },
            relations: {
                sender: true,
                receiver: true,
                offeredSkill: true,
                requestedSkill: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findOutgoing(userId) {
        return this.requestsRepository.find({
            where: {
                sender: {
                    id: userId,
                },
            },
            relations: {
                sender: true,
                receiver: true,
                offeredSkill: true,
                requestedSkill: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    findAll() {
        return `This action returns all requests`;
    }
    findOne(id) {
        return `This action returns a #${id} request`;
    }
    async markAsRead(requestId, currentUserId) {
        const request = await this.findRequestOrFail(requestId);
        this.ensureReceiver(request, currentUserId);
        request.isRead = true;
        await this.requestsRepository.save(request);
        return request;
    }
    async accept(requestId, currentUserId) {
        const request = await this.findRequestOrFail(requestId);
        this.ensureReceiver(request, currentUserId);
        this.ensurePending(request);
        await this.exchangeSkills(request);
        request.status = requests_enums_1.RequestStatus.ACCEPTED;
        await this.requestsRepository.save(request);
        this.notificationsGateway.notifyUser(request.sender.id, {
            type: notification_payload_type_1.NotificationType.ACCEPTED,
            skillTitle: request.requestedSkill.title,
            fromUser: request.receiver.name,
        });
        return request;
    }
    async reject(requestId, currentUserId) {
        const request = await this.findRequestOrFail(requestId);
        this.ensureReceiver(request, currentUserId);
        this.ensurePending(request);
        request.status = requests_enums_1.RequestStatus.REJECTED;
        await this.requestsRepository.save(request);
        this.notificationsGateway.notifyUser(request.sender.id, {
            type: notification_payload_type_1.NotificationType.REJECTED,
            skillTitle: request.requestedSkill.title,
            fromUser: request.receiver.name,
        });
        return request;
    }
    async findRequestOrFail(requestId) {
        const request = await this.requestsRepository.findOne({
            where: { id: requestId },
            relations: {
                sender: true,
                receiver: true,
                offeredSkill: true,
                requestedSkill: true,
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Заявка не найдена');
        }
        return request;
    }
    ensureReceiver(request, currentUserId) {
        if (request.receiver.id !== currentUserId) {
            throw new common_1.ForbiddenException('Только получатель может изменить статус заявки');
        }
    }
    ensurePending(request) {
        if (request.status !== requests_enums_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Статус уже изменён');
        }
    }
    async exchangeSkills(request) {
        const { sender, receiver, offeredSkill, requestedSkill } = request;
        await this.skillsService.create({
            title: offeredSkill.title,
            description: offeredSkill.description,
            categoryId: offeredSkill.category?.id,
            images: offeredSkill.images,
        }, receiver.id);
        await this.skillsService.create({
            title: requestedSkill.title,
            description: requestedSkill.description,
            categoryId: requestedSkill.category?.id,
            images: requestedSkill.images,
        }, sender.id);
    }
    async remove(requestId, currentUserId, currentUserRole) {
        const request = await this.findRequestOrFail(requestId);
        const isOwner = request.sender.id === currentUserId;
        const isAdmin = currentUserRole === users_enums_1.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new common_1.ForbiddenException('Вы можете удалять только свои заявки');
        }
        await this.requestsRepository.remove(request);
        return { message: 'Заявка удалена' };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.RequestEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(skill_entity_1.SkillEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        skills_service_1.SkillsService,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], RequestsService);
//# sourceMappingURL=requests.service.js.map