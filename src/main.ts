import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { appConfig, IAppConfig } from './config/app.config';
import { AllExceptionFilter } from './common/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { winstonLogger } from './logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  //Установлен глобальный префикс API - /api
  app.setGlobalPrefix('api');

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionFilter());

  //Swagger конфиг
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SkillSwap')
    .setDescription('Documentation')
    .setVersion('1.0')
    .addTag('SkillSwap')
    .addBearerAuth()
    .build();

  //Генерация документа
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  //Маршрутизация
  SwaggerModule.setup('docs', app, document);

  const config = app.get<IAppConfig>(appConfig.KEY);
  await app.listen(config.port);
}
bootstrap();
