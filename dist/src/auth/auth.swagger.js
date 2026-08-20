"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPostRegister = AuthPostRegister;
exports.AuthPostLogout = AuthPostLogout;
exports.AuthPostLogin = AuthPostLogin;
exports.AuthPostRefresh = AuthPostRefresh;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
function AuthPostRegister() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Register a new user' }), (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User registered successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }));
}
function AuthPostLogout() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Logout a user' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }));
}
function AuthPostLogin() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Login a user' }), (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged in successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid email or password' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }));
}
function AuthPostRefresh() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }), (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Access token refreshed successfully',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token',
    }));
}
//# sourceMappingURL=auth.swagger.js.map