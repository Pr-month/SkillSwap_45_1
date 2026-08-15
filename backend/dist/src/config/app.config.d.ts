import { ConfigType } from '@nestjs/config';
export declare const appConfig: (() => {
    port: number;
    hashSalt: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    hashSalt: number;
}>;
export type IAppConfig = ConfigType<typeof appConfig>;
