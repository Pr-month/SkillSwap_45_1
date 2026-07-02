import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

//import { SkillEntity } from './skill.entity';
//import { CategoryEntity } from './category.entity';
//import { RequestEntity } from './request.entity';

import { Gender, UserRole } from '../enums/users.enums';

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

  @Column({
    nullable: true,
  })
  city!: string;

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
  //@OneToMany(
  //  () => SkillEntity,
  //  (skill) => skill.author,
 // )
 // skills!: SkillEntity[];

  // Категории, которым хочет научиться
 // @ManyToMany(() => CategoryEntity)
 // @JoinTable()
 // wantToLearn!: CategoryEntity[];

  // Избранные навыки
 // @ManyToMany(() => SkillEntity)
 // @JoinTable()
  //favoriteSkills!: SkillEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    nullable: true,
  })
  refreshToken!: string;

  // Заявки
 // @OneToMany(
 //   () => RequestEntity,
 //   (request) => request.user,
 // )
 // requests!: RequestEntity[];
}