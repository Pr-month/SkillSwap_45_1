import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export function UsersPatchChangePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Change user password' }),
    ApiBody({ type: ChangePasswordDto }),
    ApiResponse({ status: 200, description: 'Password changed successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized or invalid old password' }),
  );
}

export function UsersPatchMe() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update current user profile' }),
    ApiBody({ type: UpdateProfileDto }),
    ApiResponse({ status: 200, description: 'Update user successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function UsersPostCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({ status: 201, description: 'Create user successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 409, description: 'User already exists' }),
  );
}

export function UsersGetAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({ status: 200, description: 'Get all users successfully' }),
  );
}

export function UsersGetMe() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current user' }),
    ApiResponse({ status: 200, description: 'Get current user successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function UsersGetById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Get user by ID successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function UsersPatchUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({ status: 200, description: 'Update user by ID successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function UsersDeleteById() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}