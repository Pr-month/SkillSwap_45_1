import { CategoryEntity } from '../../categories/entities/category.entity';
import { Gender, UserRole } from '../enums/users.enums';
import { SkillEntity } from 'src/skills/entities/skill.entity';
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    about: string;
    birthdate: Date;
    city: string;
    gender: Gender;
    avatar: string;
    skills: SkillEntity[];
    wantToLearn: CategoryEntity[];
    favoriteSkills: SkillEntity[];
    role: UserRole;
    refreshToken?: string | null;
}
