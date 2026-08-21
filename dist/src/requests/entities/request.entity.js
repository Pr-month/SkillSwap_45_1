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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const skill_entity_1 = require("../../skills/entities/skill.entity");
const requests_enums_1 = require("../enums/requests.enums");
let RequestEntity = class RequestEntity {
    id;
    createdAt;
    sender;
    receiver;
    status;
    offeredSkill;
    requestedSkill;
    isRead;
};
exports.RequestEntity = RequestEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RequestEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RequestEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'senderId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], RequestEntity.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'receiverId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], RequestEntity.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: requests_enums_1.RequestStatus,
        default: requests_enums_1.RequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], RequestEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.SkillEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'offeredSkillId' }),
    __metadata("design:type", skill_entity_1.SkillEntity)
], RequestEntity.prototype, "offeredSkill", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.SkillEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requestedSkillId' }),
    __metadata("design:type", skill_entity_1.SkillEntity)
], RequestEntity.prototype, "requestedSkill", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RequestEntity.prototype, "isRead", void 0);
exports.RequestEntity = RequestEntity = __decorate([
    (0, typeorm_1.Entity)('requests')
], RequestEntity);
//# sourceMappingURL=request.entity.js.map