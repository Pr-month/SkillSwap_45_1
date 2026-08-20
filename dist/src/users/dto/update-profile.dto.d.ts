import { UpdateUserDto } from './update-user.dto';
declare const UpdateProfileDto_base: import("@nestjs/mapped-types").MappedType<Omit<UpdateUserDto, "password">>;
export declare class UpdateProfileDto extends UpdateProfileDto_base {
}
export {};
