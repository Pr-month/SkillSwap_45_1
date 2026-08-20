import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindCitiesQueryDto {
  @ApiPropertyOptional({ description: 'Поиск по названию города' })
  @IsOptional()
  @IsString()
  search?: string;
}
