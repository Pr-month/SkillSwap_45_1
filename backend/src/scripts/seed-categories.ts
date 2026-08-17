import { DataSource } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { CategoriesData } from 'src/scripts/data/seed-categories.data';

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(CategoryEntity);
  const categoryCount = await categoryRepo.count();

  if (categoryCount > 0) {
    console.log('Categories already seeded');
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
}
