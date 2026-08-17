import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'Игра на барабанах', description: 'Название навыка' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Описание для навыка' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Муз. Инструменты', description: 'Категория навыка' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: 'Массив ссылок на изображения' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
