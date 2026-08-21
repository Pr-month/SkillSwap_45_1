import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserEntity } from './entities/user.entity';
import { IAppConfig } from '../config/app.config';
export declare class UsersService {
    private readonly repo;
    private readonly appConfiguration;
    constructor(repo: Repository<UserEntity>, appConfiguration: IAppConfig);
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity>;
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<UserEntity>;
    updatePassword(id: string, dto: ChangePasswordDto): Promise<void>;
}
