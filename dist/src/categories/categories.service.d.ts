import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<CategoryEntity>);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
    findOne(id: string): Promise<CategoryEntity>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity>;
    remove(id: string): Promise<CategoryEntity>;
}
