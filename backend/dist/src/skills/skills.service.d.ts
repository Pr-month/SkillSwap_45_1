import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillEntity } from './entities/skill.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { CategoryEntity } from '../categories/entities/category.entity';
export declare class SkillsService {
    private skillRepo;
    private userRepo;
    private categoryRepo;
    constructor(skillRepo: Repository<SkillEntity>, userRepo: Repository<UserEntity>, categoryRepo: Repository<CategoryEntity>);
    create(createSkillDto: CreateSkillDto, userId: string): Promise<SkillEntity>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: SkillEntity[];
        meta: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findOne(id: string): Promise<SkillEntity>;
    update(id: string, updateSkillDto: UpdateSkillDto, userId: string): Promise<SkillEntity>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    addToFavorites(skillId: string, userId: string): Promise<{
        message: string;
    }>;
    removeFromFavorites(skillId: string, userId: string): Promise<{
        message: string;
    }>;
}
