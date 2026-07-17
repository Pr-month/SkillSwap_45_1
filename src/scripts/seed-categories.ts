import { AppDataSource } from 'src/config/ormconfig';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { CategoriesData } from 'src/scripts/data/seed-categories.data';

async function seedCategories() {
  await AppDataSource.initialize();
  AppDataSource.setOptions({
    logging: false,
  });

  const categoryRepo = AppDataSource.getRepository(CategoryEntity);
  const categoryCount = await categoryRepo.count();

  if (categoryCount > 0) {
    console.log('Categories already seeded');
    await AppDataSource.destroy();
    return;
  }

  const createdCategoriesMap = new Map<string, CategoryEntity>();

  for (const parent of CategoriesData) {
    const parentCategory = categoryRepo.create({
      name: parent.name,
    });
    await categoryRepo.save(parentCategory);
    createdCategoriesMap.set(parent.name, parentCategory);

    if (!parent.children) continue;

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
  await AppDataSource.destroy();
}

seedCategories()
  .catch((error) => {
    console.error('Error seeding categories:', error);
  })
  .finally(() => {
    if (AppDataSource.isInitialized) {
      AppDataSource.destroy();
    }
  });
