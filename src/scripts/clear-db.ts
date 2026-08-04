import { AppDataSource } from "../config/ormconfig";

export async function clearDatabase() {
  console.log('🧹 Clearing database with synchronize(true)...');
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true); // пересоздаёт таблицы
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Если запускаем как самостоятельный скрипт
if (require.main === module) {
  clearDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}