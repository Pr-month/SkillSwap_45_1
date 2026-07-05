import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConfig, IJwtConfig } from '../config/jwt.config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (config: IJwtConfig) => ({
        secret: config.accessSecret,
        signOptions: {
          expiresIn: config.accessExpiresIn,
        },
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
