import { registerAs, ConfigType } from '@nestjs/config';

export const throttlerConfig = registerAs('THROTTLER_CONFIG', () => ({
  // время жизни окна в миллисекундах
  ttl: Number(process.env.THROTTLE_TTL) || 60000,
  // максимум запросов за это время
  limit: Number(process.env.THROTTLE_LIMIT) || 100,
}));

export type IThrottlerConfig = ConfigType<typeof throttlerConfig>;
