import { ConfigType } from '@nestjs/config';
export declare const throttlerConfig: (() => {
    ttl: number;
    limit: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    ttl: number;
    limit: number;
}>;
export type IThrottlerConfig = ConfigType<typeof throttlerConfig>;
