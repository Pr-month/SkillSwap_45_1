import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersData } from 'src/scripts/data/seed-users.data';
import { appConfig } from 'src/config/app.config';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(UserEntity);
  const hashSalt = appConfig().hashSalt || 10;

  for (const userData of UsersData) {
    const existing = await repo.findOne({
      where: { email: userData.email },
    });
    const hashedPassword = await bcrypt.hash(userData.password, hashSalt);

    const user = repo.create({
      ...(existing || {}),
      ...userData,
      password: hashedPassword,
    });
    await repo.save(user);
  }

  console.log('Users seeded');
}
