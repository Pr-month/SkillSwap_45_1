"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttlerConfig = void 0;
const config_1 = require("@nestjs/config");
exports.throttlerConfig = (0, config_1.registerAs)('THROTTLER_CONFIG', () => ({
    ttl: Number(process.env.THROTTLE_TTL) || 60000,
    limit: Number(process.env.THROTTLE_LIMIT) || 100,
}));
//# sourceMappingURL=throttler.config.js.map