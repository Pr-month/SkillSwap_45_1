import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ type: String, description: 'Название города' })
  @IsString()
  @MaxLength(100)
  name!: string;
}
