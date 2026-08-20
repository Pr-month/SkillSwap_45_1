import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthRequest } from 'src/auth/auth.types';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(createSkillDto: CreateSkillDto, req: AuthRequest): Promise<import("./entities/skill.entity").SkillEntity>;
    addToFavorites(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
    removeFromFavorites(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: import("./entities/skill.entity").SkillEntity[];
        meta: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findOne(id: string): Promise<import("./entities/skill.entity").SkillEntity>;
    update(id: string, updateSkillDto: UpdateSkillDto, req: AuthRequest): Promise<import("./entities/skill.entity").SkillEntity>;
    remove(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
