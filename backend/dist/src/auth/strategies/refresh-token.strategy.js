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
exports.RefreshTokenStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwt_config_1 = require("../../config/jwt.config");
let RefreshTokenStrategy = class RefreshTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    jwtConfig;
    constructor(jwtConfig) {
        const options = {
            jwtFromRequest: (req) => {
                const body = req.body;
                const cookies = req.cookies;
                return body?.refreshToken || cookies?.refreshToken || null;
            },
            ignoreExpiration: false,
            secretOrKey: jwtConfig.refreshSecret,
            passReqToCallback: true,
        };
        super(options);
        this.jwtConfig = jwtConfig;
    }
    validate(req, payload) {
        const body = req.body;
        const cookies = req.cookies;
        const refreshToken = body?.refreshToken || cookies?.refreshToken || null;
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token not found');
        }
        return { sub: payload.sub, email: payload.email, refreshToken };
    }
};
exports.RefreshTokenStrategy = RefreshTokenStrategy;
exports.RefreshTokenStrategy = RefreshTokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(jwt_config_1.jwtConfig.KEY)),
    __metadata("design:paramtypes", [Object])
], RefreshTokenStrategy);
//# sourceMappingURL=refresh-token.strategy.js.map