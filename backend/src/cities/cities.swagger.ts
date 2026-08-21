import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

export function CityPostCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Создать новый город (только ADMIN)' }),
    ApiBody({ type: CreateCityDto }),
    ApiResponse({ status: 201, description: 'Город успешно создан.' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Требуется роль ADMIN.',
    }),
    ApiResponse({ status: 409, description: 'Город уже существует.' }),
  );
}

export function CityGetAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить список городов (поиск по query, максимум 10)',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Поиск по названию города',
    }),
    ApiResponse({ status: 200, description: 'Список городов получен.' }),
  );
}

export function CityGetById() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить город по id' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Город получен.' }),
    ApiResponse({ status: 404, description: 'Город не найден.' }),
  );
}

export function CityPatchUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Обновить город по id (только ADMIN)' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiBody({ type: UpdateCityDto }),
    ApiResponse({ status: 200, description: 'Город успешно обновлён.' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Требуется роль ADMIN.',
    }),
    ApiResponse({ status: 404, description: 'Город не найден.' }),
  );
}

export function CityDeleteById() {
  return applyDecorators(
    ApiOperation({ summary: 'Удалить город по id (только ADMIN)' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Город успешно удалён.' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Требуется роль ADMIN.',
    }),
    ApiResponse({ status: 404, description: 'Город не найден.' }),
  );
}
