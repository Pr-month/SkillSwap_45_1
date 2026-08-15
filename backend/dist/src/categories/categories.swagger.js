"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryPostCreate = CategoryPostCreate;
exports.CategoryGetAll = CategoryGetAll;
exports.CategoryGetById = CategoryGetById;
exports.CategoryPatchUpdate = CategoryPatchUpdate;
exports.CategoryDeleteById = CategoryDeleteById;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
function CategoryPostCreate() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create a new category' }), (0, swagger_1.ApiBody)({ type: create_category_dto_1.CreateCategoryDto }), (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The category has been successfully created.',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden. ADMIN role required.',
    }));
}
function CategoryGetAll() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get all categories' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All categories have been successfully received.',
    }));
}
function CategoryGetById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get category by id' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category has been successfully received.',
    }));
}
function CategoryPatchUpdate() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update category by id' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiBody)({ type: update_category_dto_1.UpdateCategoryDto }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category has been successfully updated.',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden. ADMIN role required.',
    }));
}
function CategoryDeleteById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete category by id' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category has been successfully deleted.',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden. ADMIN role required.',
    }));
}
//# sourceMappingURL=categories.swagger.js.map