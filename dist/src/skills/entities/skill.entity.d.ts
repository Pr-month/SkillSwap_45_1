import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
export declare class SkillEntity {
    id: string;
    title: string;
    description?: string;
    category: CategoryEntity | null;
    images?: string[];
    owner: UserEntity;
}
