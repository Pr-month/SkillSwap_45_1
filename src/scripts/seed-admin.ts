import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/users.enums';
import { appConfig } from 'src/config/app.config';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(UserEntity);
  const hashSalt = appConfig().hashSalt || 10;

  const email = process.env.ADMIN_EMAIL || 'admin@skillswap.ru';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await repo.findOne({
    where: { email },
  });
  const hashedPassword = await bcrypt.hash(password, hashSalt);

  const admin = repo.create({
    ...(existing || {}),
    name: 'Admin',
    email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });
  await repo.save(admin);

  console.log('Admin seeded');
}
