import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  @IsNotEmpty()
  requestedSkillId!: string;

  @IsUUID()
  @IsNotEmpty()
  offeredSkillId!: string;
}
