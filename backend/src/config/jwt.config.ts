import { registerAs, ConfigType } from '@nestjs/config';
import ms from 'ms';

export const jwtConfig = registerAs('JWT_CONFIG', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'jwt-access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
  accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
    '1h') as ms.StringValue,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
    '7d') as ms.StringValue,
}));

export type IJwtConfig = ConfigType<typeof jwtConfig>;
