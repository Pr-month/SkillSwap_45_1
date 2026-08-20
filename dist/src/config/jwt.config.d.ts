import { ConfigType } from '@nestjs/config';
import ms from 'ms';
export declare const jwtConfig: (() => {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: ms.StringValue;
    refreshExpiresIn: ms.StringValue;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: ms.StringValue;
    refreshExpiresIn: ms.StringValue;
}>;
export type IJwtConfig = ConfigType<typeof jwtConfig>;
