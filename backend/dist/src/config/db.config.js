"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const config_1 = require("@nestjs/config");
exports.dbConfig = (0, config_1.registerAs)('database', () => {
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
});
//# sourceMappingURL=db.config.js.map