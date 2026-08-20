"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const users_enums_1 = require("../users/enums/users.enums");
const app_config_1 = require("../config/app.config");
async function seedAdmin(dataSource) {
    const repo = dataSource.getRepository(user_entity_1.UserEntity);
    const hashSalt = (0, app_config_1.appConfig)().hashSalt || 10;
    const email = process.env.ADMIN_EMAIL || 'admin@skillswap.ru';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const existing = await repo.findOne({
        where: { email },
    });
    const hashedPassword = await bcrypt.hash(password, hashSalt);
    const admin = repo.create({
        ...(existing || {}),
        name: 'Admin',
        email,
        password: hashedPassword,
        role: users_enums_1.UserRole.ADMIN,
    });
    await repo.save(admin);
    console.log('Admin seeded');
}
//# sourceMappingURL=seed-admin.js.map