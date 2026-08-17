import { OmitType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';

export class UpdateProfileDto extends OmitType(UpdateUserDto, [
  'password',
] as const) {}
