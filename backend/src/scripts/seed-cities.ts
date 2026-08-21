import { DataSource } from 'typeorm';
import { CityEntity } from 'src/cities/entities/city.entity';
import { CitiesData } from 'src/scripts/data/seed-cities.data';

export async function seedCities(dataSource: DataSource): Promise<void> {
  const cityRepo = dataSource.getRepository(CityEntity);
  const cityCount = await cityRepo.count();

  if (cityCount > 0) {
    console.log('Cities already seeded');
    return;
  }

  for (const name of CitiesData) {
    const city = cityRepo.create({ name });
    await cityRepo.save(city);
  }

  console.log('Cities seeded');
}
