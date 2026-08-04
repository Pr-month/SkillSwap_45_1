import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

export function SkillsPost() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create new skill' }),
    ApiBody({ type: CreateSkillDto }),
    ApiResponse({ status: 201, description: 'Create skill successfully' }),
    ApiResponse({ status: 400, description: 'Category not found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SkillsPostFavouriteById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add skill to favourite' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({
      status: 201,
      description: 'Added to favourite successfully',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Skill or user not found' }),
    ApiResponse({ status: 409, description: 'Skill already in favourites' }),
  );
}

export function SkillsRemoveFromFavouriteById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove skill from favourite' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({
      status: 200,
      description: 'Removed skill from favourite successfully',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: 'Skill, user or favourite not found',
    }),
  );
}

export function SkillsGetAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all skills' }),
    ApiQuery({ name: 'page', type: 'number', required: false }),
    ApiQuery({ name: 'limit', type: 'number', required: false }),
    ApiResponse({ status: 200, description: 'Get all skills successfully' }),
    ApiResponse({ status: 404, description: 'Page does not exist' }),
  );
}

export function SkillsGetById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get skill by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Get skill by ID successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Skill not found' }),
  );
}

export function SkillsPatchUpdate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update skill by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiBody({ type: UpdateSkillDto }),
    ApiResponse({ status: 200, description: 'Update skill successfully' }),
    ApiResponse({ status: 400, description: 'Category not found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'You can only update your own skills',
    }),
    ApiResponse({ status: 404, description: 'Skill not found' }),
  );
}

export function SkillsDeleteById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete skill by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Delete skill successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'You can only delete your own skills',
    }),
    ApiResponse({ status: 404, description: 'Skill not found' }),
  );
}
