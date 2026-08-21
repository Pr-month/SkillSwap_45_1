import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthRequest } from '../auth/auth.types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updatePassword(req: AuthRequest, changePasswordDto: ChangePasswordDto): Promise<void>;
    updateProfile(req: AuthRequest, updateProfileDto: UpdateProfileDto): Promise<import("./entities/user.entity").UserEntity>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").UserEntity>;
    findAll(): Promise<import("./entities/user.entity").UserEntity[]>;
    getCurrentUser(req: AuthRequest): Promise<import("./entities/user.entity").UserEntity>;
    findOne(id: string): Promise<import("./entities/user.entity").UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").UserEntity>;
    remove(id: string): Promise<import("./entities/user.entity").UserEntity>;
}
