"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSkills = seedSkills;
const skill_entity_1 = require("../skills/entities/skill.entity");
const seed_skills_data_1 = require("./data/seed-skills.data");
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
async function seedSkills(dataSource) {
    const skillRepo = dataSource.getRepository(skill_entity_1.SkillEntity);
    const categoryRepo = dataSource.getRepository(category_entity_1.CategoryEntity);
    const userRepo = dataSource.getRepository(user_entity_1.UserEntity);
    for (const skillData of seed_skills_data_1.SkillsData) {
        const owner = await userRepo.findOneByOrFail({
            email: skillData.owner,
        });
        const existing = await skillRepo.findOne({
            where: {
                title: skillData.title,
                owner: { id: owner.id },
            },
        });
        const category = await categoryRepo.findOneByOrFail({
            name: skillData.category,
        });
        const skill = skillRepo.create({
            ...(existing || {}),
            title: skillData.title,
            description: skillData.description,
            category: { id: category.id },
            images: skillData.images,
            owner,
        });
        await skillRepo.save(skill);
    }
}
//# sourceMappingURL=seed-skills.js.map