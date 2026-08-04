import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User name' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'User description' })
  @IsOptional()
  @IsString()
  about?: string;
}
