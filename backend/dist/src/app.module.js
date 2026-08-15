"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const db_config_1 = require("./config/db.config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const app_config_1 = require("./config/app.config");
const jwt_config_1 = require("./config/jwt.config");
const skills_module_1 = require("./skills/skills.module");
const files_module_1 = require("./files/files.module");
const requests_module_1 = require("./requests/requests.module");
const categories_module_1 = require("./categories/categories.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
                load: [app_config_1.appConfig, jwt_config_1.jwtConfig, db_config_1.dbConfig],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [db_config_1.dbConfig.KEY],
                useFactory: (config) => config,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            skills_module_1.SkillsModule,
            files_module_1.FilesModule,
            requests_module_1.RequestsModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map