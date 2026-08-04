import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/auth.types';
import {
  UsersPatchChangePassword,
  UsersPatchMe,
  UsersPostCreate,
  UsersGetAll,
  UsersGetMe,
  UsersGetById,
  UsersPatchUpdate,
  UsersDeleteById,
} from './users.swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsersPatchChangePassword()
  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @Req() req: AuthRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.updatePassword(req.user.sub, changePasswordDto);
  }

  @UsersPatchMe()
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(req.user.sub, updateProfileDto);
  }

  @UsersPostCreate()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UsersGetAll()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UsersGetMe()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req: AuthRequest) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @UsersGetById()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UsersPatchUpdate()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UsersDeleteById()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
