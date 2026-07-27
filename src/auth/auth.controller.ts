import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refreshGuard';
import { RequestWithUser } from './auth.types';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthPostLogin, AuthPostLogout, AuthPostRefresh, AuthPostRegister } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @AuthPostLogin()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @AuthPostRefresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @AuthPostLogout()
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user);
  }
  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  @AuthPostRegister()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
