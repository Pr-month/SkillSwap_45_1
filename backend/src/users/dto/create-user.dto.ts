import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUrl,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Gender } from '../enums/users.enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Себастиан', description: 'Имя пользователя' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'sebastian@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password',
    minLength: 6,
    maxLength: 32,
    description: 'Пароль пользователя',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password!: string;

  @ApiProperty({ required: false, description: 'Информация о пользователе' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  about?: string;

  @ApiProperty({
    required: false,
    type: Date,
    format: 'date',
    description: 'Дата рождения',
  })
  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @ApiProperty({ required: false, description: 'ID города' })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiProperty({ required: false, enum: Gender, description: 'Пол' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false, description: 'URL аватара' })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
