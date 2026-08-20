"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersPatchChangePassword = UsersPatchChangePassword;
exports.UsersPatchMe = UsersPatchMe;
exports.UsersPostCreate = UsersPostCreate;
exports.UsersGetAll = UsersGetAll;
exports.UsersGetMe = UsersGetMe;
exports.UsersGetById = UsersGetById;
exports.UsersPatchUpdate = UsersPatchUpdate;
exports.UsersDeleteById = UsersDeleteById;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const change_password_dto_1 = require("./dto/change-password.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
function UsersPatchChangePassword() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Change user password' }), (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized or invalid old password',
    }));
}
function UsersPatchMe() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update current user profile' }), (0, swagger_1.ApiBody)({ type: update_profile_dto_1.UpdateProfileDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Update user successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }));
}
function UsersPostCreate() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create a new user' }), (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Create user successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }));
}
function UsersGetAll() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get all users' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Get all users successfully' }));
}
function UsersGetMe() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get current user' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Get current user successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }));
}
function UsersGetById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Get user by ID successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }));
}
function UsersPatchUpdate() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Update user by ID successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }));
}
function UsersDeleteById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }));
}
//# sourceMappingURL=users.swagger.js.map