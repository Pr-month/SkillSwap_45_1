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
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const jwt_strategy_1 = require("../../auth/strategies/jwt.strategy");
let WsJwtGuard = class WsJwtGuard {
    jwtStrategy;
    constructor(jwtStrategy) {
        this.jwtStrategy = jwtStrategy;
    }
    async verify(token) {
        if (!token) {
            throw new websockets_1.WsException('Токен не найден');
        }
        try {
            return await this.jwtStrategy.validate(token);
        }
        catch {
            throw new websockets_1.WsException('Невалидный или истёкший токен');
        }
    }
    extractToken(client) {
        const token = client.handshake.query?.token;
        return Array.isArray(token) ? token[0] : token;
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_strategy_1.JwtStrategy])
], WsJwtGuard);
//# sourceMappingURL=ws-jwt.guard.js.map