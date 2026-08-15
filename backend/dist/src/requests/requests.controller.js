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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const requests_swagger_1 = require("./requests.swagger");
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    create(createRequestDto, req) {
        return this.requestsService.create(createRequestDto, req.user.sub);
    }
    findIncoming(req) {
        return this.requestsService.findIncoming(req.user.sub);
    }
    findOutgoing(req) {
        return this.requestsService.findOutgoing(req.user.sub);
    }
    findAll() {
        return this.requestsService.findAll();
    }
    findOne(id) {
        return this.requestsService.findOne(id);
    }
    markAsRead(id, req) {
        return this.requestsService.markAsRead(id, req.user.sub);
    }
    accept(id, req) {
        return this.requestsService.accept(id, req.user.sub);
    }
    reject(id, req) {
        return this.requestsService.reject(id, req.user.sub);
    }
    remove(id, req) {
        return this.requestsService.remove(id, req.user.sub, req.user.role);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, requests_swagger_1.RequestPost)(),
    (0, common_1.Post)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "create", null);
__decorate([
    (0, requests_swagger_1.RequestGetIncoming)(),
    (0, common_1.Get)('incoming'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findIncoming", null);
__decorate([
    (0, requests_swagger_1.RequestGetOutgoing)(),
    (0, common_1.Get)('outgoing'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOutgoing", null);
__decorate([
    (0, requests_swagger_1.RequestGetAll)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, requests_swagger_1.RequestGetById)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, requests_swagger_1.RequestPatchRead)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "markAsRead", null);
__decorate([
    (0, requests_swagger_1.RequestPatchAccept)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "accept", null);
__decorate([
    (0, requests_swagger_1.RequestPatchReject)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "reject", null);
__decorate([
    (0, requests_swagger_1.RequestDelete)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "remove", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map