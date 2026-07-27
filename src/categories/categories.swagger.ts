import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export function CategoryPostCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new category' }),
    ApiBody({ type: CreateCategoryDto }),
    ApiResponse({
      status: 201,
      description: 'The category has been successfully created.',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. ADMIN role required.',
    }),
  );
}

export function CategoryGetAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all categories' }),
    ApiResponse({
      status: 200,
      description: 'All categories have been successfully received.',
    }),
  );
}

export function CategoryGetById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get category by id' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({
      status: 200,
      description: 'Category has been successfully received.',
    }),
  );
}

export function CategoryPatchUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Update category by id' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiBody({ type: UpdateCategoryDto }),
    ApiResponse({
      status: 200,
      description: 'Category has been successfully updated.',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. ADMIN role required.',
    }),
  );
}

export function CategoryDeleteById() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete category by id' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({
      status: 200,
      description: 'Category has been successfully deleted.',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. ADMIN role required.',
    }),
  );
}
