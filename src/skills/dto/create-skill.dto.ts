import { IsString, IsOptional, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string; 

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
