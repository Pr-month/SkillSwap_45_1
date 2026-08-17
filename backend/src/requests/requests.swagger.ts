import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateRequestDto } from './dto/create-request.dto';

export function RequestPost() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create new request' }),
    ApiBody({ type: CreateRequestDto }),
    ApiResponse({ status: 201, description: 'Request created successfully' }),
    ApiResponse({
      status: 400,
      description: 'Cannot send request to yourself',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'You can only offer your own skills',
    }),
    ApiResponse({
      status: 404,
      description: 'Requested or offered skill not found',
    }),
  );
}

export function RequestGetIncoming() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get incoming request' }),
    ApiResponse({
      status: 200,
      description: 'Incoming requests received successfully',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function RequestGetOutgoing() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get outgoing request' }),
    ApiResponse({
      status: 200,
      description: 'Outgoing requests received successfully',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function RequestGetAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all requests' }),
    ApiResponse({
      status: 200,
      description: 'All requests received successfully',
    }),
  );
}

export function RequestGetById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get request by ID' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Request received successfully' }),
  );
}

export function RequestPatchRead() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Mark request as read' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Request marked as read' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Only the receiver can change the request status',
    }),
    ApiResponse({ status: 404, description: 'Request not found' }),
  );
}

export function RequestPatchAccept() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Accept request' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Request accepted successfully' }),
    ApiResponse({ status: 400, description: 'Status already changed' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Only the receiver can change the request status',
    }),
    ApiResponse({ status: 404, description: 'Request not found' }),
  );
}

export function RequestPatchReject() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Reject request' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Request rejected successfully' }),
    ApiResponse({ status: 400, description: 'Status already changed' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Only the receiver can change the request status',
    }),
    ApiResponse({ status: 404, description: 'Request not found' }),
  );
}

export function RequestDelete() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete request' }),
    ApiParam({ name: 'id', type: 'string' }),
    ApiResponse({ status: 200, description: 'Request deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'You can only delete your own requests',
    }),
    ApiResponse({ status: 404, description: 'Request not found' }),
  );
}
