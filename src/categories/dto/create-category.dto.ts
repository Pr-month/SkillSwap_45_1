import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: String, required: true, description: 'Category name' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Parent category id',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
