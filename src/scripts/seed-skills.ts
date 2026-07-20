import { DataSource } from 'typeorm';
import { SkillEntity } from 'src/skills/entities/skill.entity';
import { SkillsData } from 'src/scripts/data/seed-skills.data';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoryEntity } from 'src/categories/entities/category.entity';

export async function seedSkills(dataSource: DataSource): Promise<void> {
  const skillRepo = dataSource.getRepository(SkillEntity);
  const categoryRepo = dataSource.getRepository(CategoryEntity);
  const userRepo = dataSource.getRepository(UserEntity);

  for (const skillData of SkillsData) {
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
      category: category.name,
      images: skillData.images,
      owner,
    });

    await skillRepo.save(skill);
  }
}
