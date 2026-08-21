"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
const category_entity_1 = require("../categories/entities/category.entity");
const seed_categories_data_1 = require("./data/seed-categories.data");
async function seedCategories(dataSource) {
    const categoryRepo = dataSource.getRepository(category_entity_1.CategoryEntity);
    const categoryCount = await categoryRepo.count();
    if (categoryCount > 0) {
        console.log('Categories already seeded');
        return;
    }
    const createdCategoriesMap = new Map();
    for (const parent of seed_categories_data_1.CategoriesData) {
        const parentCategory = categoryRepo.create({
            name: parent.name,
        });
        await categoryRepo.save(parentCategory);
        createdCategoriesMap.set(parent.name, parentCategory);
        if (!parent.children)
            continue;
        for (const childName of parent.children) {
            const childCategory = categoryRepo.create({
                name: childName,
                parent: parentCategory,
            });
            await categoryRepo.save(childCategory);
            createdCategoriesMap.set(childName, childCategory);
        }
    }
    console.log('Categories seeded');
}
//# sourceMappingURL=seed-categories.js.map