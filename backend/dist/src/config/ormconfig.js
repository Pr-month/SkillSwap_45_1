"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const db_config_1 = require("./db.config");
exports.AppDataSource = new typeorm_1.DataSource((0, db_config_1.dbConfig)());
//# sourceMappingURL=ormconfig.js.map