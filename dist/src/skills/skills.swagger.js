"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsPost = SkillsPost;
exports.SkillsPostFavouriteById = SkillsPostFavouriteById;
exports.SkillsRemoveFromFavouriteById = SkillsRemoveFromFavouriteById;
exports.SkillsGetAll = SkillsGetAll;
exports.SkillsGetById = SkillsGetById;
exports.SkillsPatchUpdate = SkillsPatchUpdate;
exports.SkillsDeleteById = SkillsDeleteById;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const update_skill_dto_1 = require("./dto/update-skill.dto");
function SkillsPost() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create new skill' }), (0, swagger_1.ApiBody)({ type: create_skill_dto_1.CreateSkillDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Create skill successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Category not found' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }));
}
function SkillsPostFavouriteById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Add skill to favourite' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Added to favourite successfully',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Skill or user not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Skill already in favourites' }));
}
function SkillsRemoveFromFavouriteById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Remove skill from favourite' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Removed skill from favourite successfully',
    }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Skill, user or favourite not found',
    }));
}
function SkillsGetAll() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get all skills' }), (0, swagger_1.ApiQuery)({ name: 'page', type: 'number', required: false }), (0, swagger_1.ApiQuery)({ name: 'limit', type: 'number', required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Get all skills successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Page does not exist' }));
}
function SkillsGetById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get skill by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Get skill by ID successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Skill not found' }));
}
function SkillsPatchUpdate() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update skill by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiBody)({ type: update_skill_dto_1.UpdateSkillDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Update skill successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Category not found' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You can only update your own skills',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Skill not found' }));
}
function SkillsDeleteById() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete skill by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Delete skill successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You can only delete your own skills',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Skill not found' }));
}
//# sourceMappingURL=skills.swagger.js.map