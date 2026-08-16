import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig, TDatabaseConfig } from './config/db.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { throttlerConfig, IThrottlerConfig } from './config/throttler.config';
import { SkillsModule } from './skills/skills.module';
import { FilesModule } from './files/files.module';
import { RequestsModule } from './requests/requests.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      load: [appConfig, jwtConfig, dbConfig, throttlerConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (config: TDatabaseConfig) => config,
    }),
    ThrottlerModule.forRootAsync({
      inject: [throttlerConfig.KEY],
      useFactory: (config: IThrottlerConfig) => [
        { ttl: config.ttl, limit: config.limit },
      ],
    }),
    UsersModule,
    AuthModule,
    SkillsModule,
    FilesModule,
    RequestsModule,
    CategoriesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
