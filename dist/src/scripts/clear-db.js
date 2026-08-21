"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDatabase = clearDatabase;
const ormconfig_1 = require("../config/ormconfig");
async function clearDatabase() {
    console.log('🧹 Clearing database with synchronize(true)...');
    try {
        await ormconfig_1.AppDataSource.initialize();
        await ormconfig_1.AppDataSource.synchronize(true);
        console.log('✅ Database cleared successfully');
    }
    catch (error) {
        console.error('❌ Failed to clear database:', error);
        throw error;
    }
    finally {
        if (ormconfig_1.AppDataSource.isInitialized) {
            await ormconfig_1.AppDataSource.destroy();
        }
    }
}
if (require.main === module) {
    clearDatabase().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=clear-db.js.map