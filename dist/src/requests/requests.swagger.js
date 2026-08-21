"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPost = RequestPost;
exports.RequestGetIncoming = RequestGetIncoming;
exports.RequestGetOutgoing = RequestGetOutgoing;
exports.RequestGetAll = RequestGetAll;
exports.RequestGetById = RequestGetById;
exports.RequestPatchRead = RequestPatchRead;
exports.RequestPatchAccept = RequestPatchAccept;
exports.RequestPatchReject = RequestPatchReject;
exports.RequestDelete = RequestDelete;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_request_dto_1 = require("./dto/create-request.dto");
function RequestPost() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create new request' }), (0, swagger_1.ApiBody)({ type: create_request_dto_1.CreateRequestDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Request created successfully' }), (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot send request to yourself',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You can only offer your own skills',
    }), (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Requested or offered skill not found',
    }));
}
function RequestGetIncoming() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get incoming request' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Incoming requests received successfully',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }));
}
function RequestGetOutgoing() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get outgoing request' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Outgoing requests received successfully',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }));
}
function RequestGetAll() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get all requests' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All requests received successfully',
    }));
}
function RequestGetById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get request by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request received successfully' }));
}
function RequestPatchRead() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Mark request as read' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request marked as read' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Only the receiver can change the request status',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }));
}
function RequestPatchAccept() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Accept request' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request accepted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Status already changed' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Only the receiver can change the request status',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }));
}
function RequestPatchReject() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Reject request' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request rejected successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Status already changed' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Only the receiver can change the request status',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }));
}
function RequestDelete() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete request' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You can only delete your own requests',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }));
}
//# sourceMappingURL=requests.swagger.js.map