import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { SkillEntity } from '../../skills/entities/skill.entity';
import { RequestStatus } from '../enums/requests.enums';

@Entity('requests')
export class RequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Пользователь, создавший заявку
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender!: UserEntity;

  // Пользователь, которому предложили обмен
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver!: UserEntity;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status!: RequestStatus;

  // Навык, который предлагает отправитель
  @ManyToOne(() => SkillEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'offeredSkillId' })
  offeredSkill!: SkillEntity;

  // Навык, который отправитель хочет получить
  @ManyToOne(() => SkillEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestedSkillId' })
  requestedSkill!: SkillEntity;

  @Column({ default: false })
  isRead!: boolean;
}
