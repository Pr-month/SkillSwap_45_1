import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export function AuthPostRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({ type: RegisterDto }),
    ApiResponse({ status: 200, description: 'User registered successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 409, description: 'User already exists' }),
  );
}

export function AuthPostLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout a user' }),
    ApiResponse({ status: 200, description: 'User logged out successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function AuthPostLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login a user' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({ status: 200, description: 'User logged in successfully' }),
    ApiResponse({ status: 401, description: 'Invalid email or password' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function AuthPostRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token' }),
    ApiBody({ type: RegisterDto }),
    ApiResponse({
      status: 200,
      description: 'Access token refreshed successfully',
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid or expired refresh token',
    }),
  );
}
