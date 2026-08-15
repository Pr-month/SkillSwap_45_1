import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").CategoryEntity | null>;
    findAll(): Promise<import("./entities/category.entity").CategoryEntity[]>;
    findOne(id: string): Promise<import("./entities/category.entity").CategoryEntity>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./entities/category.entity").CategoryEntity>;
    remove(id: string): Promise<import("./entities/category.entity").CategoryEntity>;
}
