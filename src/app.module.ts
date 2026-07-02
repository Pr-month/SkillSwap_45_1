import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './app.config';
import { jwtConfig } from './jwt.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from '../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule, 
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
