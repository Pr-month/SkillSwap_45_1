import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Текущий пароль'})
  @IsString()
  oldPassword!: string;

  @ApiProperty({ minLength: 6, maxLength: 32, description: 'Новый пароль'})
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  newPassword!: string;
}
