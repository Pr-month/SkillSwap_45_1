import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {

}
