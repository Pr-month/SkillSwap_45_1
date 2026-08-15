"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ormconfig_1 = require("../config/ormconfig");
const seed_categories_1 = require("./seed-categories");
const seed_users_1 = require("./seed-users");
const seed_skills_1 = require("./seed-skills");
const seed_admin_1 = require("./seed-admin");
async function runSeeds() {
    console.log('Running seeds...');
    await ormconfig_1.AppDataSource.initialize();
    ormconfig_1.AppDataSource.setOptions({
        logging: false,
    });
    try {
        await (0, seed_categories_1.seedCategories)(ormconfig_1.AppDataSource);
        await (0, seed_users_1.seedUsers)(ormconfig_1.AppDataSource);
        await (0, seed_skills_1.seedSkills)(ormconfig_1.AppDataSource);
        await (0, seed_admin_1.seedAdmin)(ormconfig_1.AppDataSource);
        console.log('Seeds executed successfully');
    }
    catch (error) {
        console.error('Seeds execution failed:', error);
        throw error;
    }
    finally {
        if (ormconfig_1.AppDataSource.isInitialized) {
            await ormconfig_1.AppDataSource.destroy();
            console.log('Database connection closed');
        }
    }
}
runSeeds().catch((error) => {
    console.error('Seeds execution failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-all.js.map