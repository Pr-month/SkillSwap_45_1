import { Gender } from '../enums/users.enums';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    about?: string;
    birthdate?: Date;
    city?: string;
    gender?: Gender;
    avatar?: string;
}
