import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  requestedSkillId!: string;

  @IsString()
  @IsNotEmpty()
  offeredSkillId!: string;
}
