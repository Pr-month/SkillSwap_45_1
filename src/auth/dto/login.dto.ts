import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password!: string;
}
