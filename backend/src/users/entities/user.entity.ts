import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { CategoryEntity } from '../../categories/entities/category.entity';
import { CityEntity } from '../../cities/entities/city.entity';
// import { RequestEntity } from './request.entity';

import { Gender, UserRole } from '../enums/users.enums';
import { SkillEntity } from 'src/skills/entities/skill.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  about!: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthdate!: Date;

  // Город пользователя (связь с сущностью City)
  @ManyToOne(() => CityEntity, (city) => city.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cityId' })
  city?: CityEntity | null;

  @Column({ type: 'uuid', nullable: true })
  cityId?: string | null;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender!: Gender;

  @Column({
    nullable: true,
  })
  avatar!: string;

  // Навыки пользователя
  @OneToMany(() => SkillEntity, (skill) => skill.owner)
  skills!: SkillEntity[];

  //Категории, которым хочет научиться
  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  wantToLearn!: CategoryEntity[];

  // Избранные навыки
  @ManyToMany(() => SkillEntity)
  @JoinTable()
  favoriteSkills!: SkillEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Exclude()
  refreshToken?: string | null;

  // Заявки
  // @OneToMany(
  //   () => RequestEntity,
  //   (request) => request.user,
  // )
  // requests!: RequestEntity[];
}
