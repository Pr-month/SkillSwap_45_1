import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Gender } from '../enums/users.enums';

export class UpdateUserDto {
  @ApiProperty({ required: false, maxLength: 100, description: 'Имя пользователя' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, description: 'Email пользователя' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: false,
    minLength: 6,
    maxLength: 32,
    description: 'Пароль пользователя'
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password?: string;

  @ApiProperty({ required: false, maxLength: 1000, description: 'Информация о пользователе' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  about?: string;

  @ApiProperty({ required: false, type: Date, format: 'date', description: 'Дата рождения' })
  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @ApiProperty({ required: false, maxLength: 100, description: 'Город' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ required: false, enum: Gender, description: 'Пол' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false, description: 'URL аватара' })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
