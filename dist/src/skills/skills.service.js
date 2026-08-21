"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const skill_entity_1 = require("./entities/skill.entity");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
let SkillsService = class SkillsService {
    skillRepo;
    userRepo;
    categoryRepo;
    constructor(skillRepo, userRepo, categoryRepo) {
        this.skillRepo = skillRepo;
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
    }
    async create(createSkillDto, userId) {
        let category = null;
        if (createSkillDto.categoryId !== undefined) {
            const foundCategory = await this.categoryRepo.findOne({
                where: { id: createSkillDto.categoryId },
            });
            if (!foundCategory) {
                throw new common_1.BadRequestException('Указанная категория не найдена');
            }
            category = foundCategory;
        }
        const categoryValue = category ? { id: category.id } : undefined;
        const skill = this.skillRepo.create({
            title: createSkillDto.title,
            description: createSkillDto.description,
            images: createSkillDto.images,
            ...(categoryValue && { category: categoryValue }),
            owner: { id: userId },
        });
        return this.skillRepo.save(skill);
    }
    async findAll(paginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const [data, total] = await this.skillRepo.findAndCount({
            skip,
            take: limit,
            relations: { owner: true, category: true },
        });
        const totalPages = Math.ceil(total / limit);
        if (total === 0) {
            if (page !== 1) {
                throw new common_1.NotFoundException(`Page ${page} does not exist. No data available.`);
            }
        }
        else if (page > totalPages) {
            throw new common_1.NotFoundException(`Page ${page} does not exist. Total pages: ${totalPages}`);
        }
        return {
            data,
            meta: {
                page,
                limit,
                totalItems: total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async findOne(id) {
        const skill = await this.skillRepo.findOne({
            where: { id },
            relations: { owner: true },
        });
        if (!skill) {
            throw new common_1.NotFoundException(`Skill with id ${id} not found`);
        }
        return skill;
    }
    async update(id, updateSkillDto, userId) {
        const skill = await this.findOne(id);
        if (skill.owner.id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own skills');
        }
        let category = skill.category;
        if (updateSkillDto.categoryId !== undefined) {
            if (updateSkillDto.categoryId === null) {
                category = null;
            }
            else {
                const foundCategory = await this.categoryRepo.findOne({
                    where: { id: updateSkillDto.categoryId },
                });
                if (!foundCategory) {
                    throw new common_1.BadRequestException('Указанная категория не найдена');
                }
                category = foundCategory;
            }
        }
        const updateData = {};
        if (updateSkillDto.title !== undefined)
            updateData.title = updateSkillDto.title;
        if (updateSkillDto.description !== undefined)
            updateData.description = updateSkillDto.description;
        if (updateSkillDto.images !== undefined)
            updateData.images = updateSkillDto.images;
        if (updateSkillDto.categoryId !== undefined) {
            updateData.category = category;
        }
        await this.skillRepo.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id, userId) {
        const skill = await this.findOne(id);
        if (skill.owner.id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own skills');
        }
        await this.skillRepo.delete(id);
        return { message: `Skill ${id} deleted successfully` };
    }
    async addToFavorites(skillId, userId) {
        const skill = await this.findOne(skillId);
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { favoriteSkills: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const alreadyInFavorites = user.favoriteSkills.some((favorite) => favorite.id === skill.id);
        if (alreadyInFavorites) {
            throw new common_1.ConflictException('Навык уже добавлен в избранное');
        }
        user.favoriteSkills.push(skill);
        await this.userRepo.save(user);
        return { message: 'Навык добавлен в избранное' };
    }
    async removeFromFavorites(skillId, userId) {
        const skill = await this.findOne(skillId);
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { favoriteSkills: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isInFavorites = user.favoriteSkills.some((favorite) => favorite.id === skill.id);
        if (!isInFavorites) {
            throw new common_1.NotFoundException('Навык не найден в избранном');
        }
        user.favoriteSkills = user.favoriteSkills.filter((favorite) => favorite.id !== skill.id);
        await this.userRepo.save(user);
        return { message: 'Навык удалён из избранного' };
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.SkillEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SkillsService);
//# sourceMappingURL=skills.service.js.map