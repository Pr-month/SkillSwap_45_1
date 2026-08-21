import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100 })
  name!: string;

  // Пользователи, живущие в этом городе
  @OneToMany(() => UserEntity, (user) => user.city)
  users!: UserEntity[];
}
