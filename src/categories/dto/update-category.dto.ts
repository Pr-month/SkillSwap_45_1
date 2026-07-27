import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ type: String, required: false, description: 'Category name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ type: String, required: false, description: 'Parent category id' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
