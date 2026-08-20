import { ConfigType } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
export declare const dbConfig: (() => DataSourceOptions) & import("@nestjs/config").ConfigFactoryKeyHost<DataSourceOptions>;
export type TDatabaseConfig = ConfigType<typeof dbConfig>;
