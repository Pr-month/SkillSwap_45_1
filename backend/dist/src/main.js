"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
const all_exception_filter_1 = require("./common/all-exception.filter");
const swagger_1 = require("@nestjs/swagger");
const winston_logger_1 = require("./logger/winston.logger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_logger_1.winstonLogger,
    });
    app.setGlobalPrefix('api');
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('SkillSwap')
        .setDescription('Documentation')
        .setVersion('1.0')
        .addTag('SkillSwap')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const config = app.get(app_config_1.appConfig.KEY);
    await app.listen(config.port);
}
bootstrap();
//# sourceMappingURL=main.js.map