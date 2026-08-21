"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const config_1 = require("@nestjs/config");
exports.jwtConfig = (0, config_1.registerAs)('JWT_CONFIG', () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET || 'jwt-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
    accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
        '1h'),
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        '7d'),
}));
//# sourceMappingURL=jwt.config.js.map