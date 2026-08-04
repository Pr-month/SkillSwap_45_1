import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    example: 'uuid',
    description: 'ID запрашиваемого навыка',
  })
  @IsUUID()
  @IsNotEmpty()
  requestedSkillId!: string;

  @ApiProperty({
    example: 'uuid',
    description: 'ID предлагаемого навыка',
  })
  @IsUUID()
  @IsNotEmpty()
  offeredSkillId!: string;
}
