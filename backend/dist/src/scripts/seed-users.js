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
exports.seedUsers = seedUsers;
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const seed_users_data_1 = require("./data/seed-users.data");
const app_config_1 = require("../config/app.config");
async function seedUsers(dataSource) {
    const repo = dataSource.getRepository(user_entity_1.UserEntity);
    const hashSalt = (0, app_config_1.appConfig)().hashSalt || 10;
    for (const userData of seed_users_data_1.UsersData) {
        const existing = await repo.findOne({
            where: { email: userData.email },
        });
        const hashedPassword = await bcrypt.hash(userData.password, hashSalt);
        const user = repo.create({
            ...(existing || {}),
            ...userData,
            password: hashedPassword,
        });
        await repo.save(user);
    }
    console.log('Users seeded');
}
//# sourceMappingURL=seed-users.js.map