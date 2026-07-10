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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/auth.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @Req() req: AuthRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.updatePassword(req.user.sub, changePasswordDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req: AuthRequest) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
