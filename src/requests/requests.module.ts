import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from './entities/request.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { AuthModule } from '../auth/auth.module';
import { SkillsModule } from 'src/skills/skills.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, SkillEntity]), AuthModule, SkillsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
