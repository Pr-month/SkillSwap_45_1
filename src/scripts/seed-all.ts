import { AppDataSource } from 'src/config/ormconfig';
import { seedCategories } from 'src/scripts/seed-categories';
import { seedUsers } from 'src/scripts/seed-users';
import { seedSkills } from 'src/scripts/seed-skills';
import { seedAdmin } from 'src/scripts/seed-admin';

async function runSeeds() {
  console.log('Running seeds...');

  await AppDataSource.initialize();
  AppDataSource.setOptions({
    logging: false,
  });

  try {
    await seedCategories(AppDataSource);
    await seedUsers(AppDataSource);
    await seedSkills(AppDataSource);
    await seedAdmin(AppDataSource);

    console.log('Seeds executed successfully');
  } catch (error) {
    console.error('Seeds execution failed:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

runSeeds().catch((error) => {
  console.error('Seeds execution failed:', error);
  process.exit(1);
});
