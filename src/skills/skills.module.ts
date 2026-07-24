import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { SkillEntity } from './entities/skill.entity';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity, UserEntity]), AuthModule],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [TypeOrmModule],
})
export class SkillsModule {}
