import { ConfigType, registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dbConfig = registerAs(
  'database',
  (): DataSourceOptions => {
    console.log(`✅ Connecting to database: ${process.env.DB_DATABASE || 'skillswap_database'}`);
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'test',
      password: process.env.DB_PASSWORD || 'test',
      database: process.env.DB_DATABASE || 'skillswap_database',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    };
  },
);

export type TDatabaseConfig = ConfigType<typeof dbConfig>;
