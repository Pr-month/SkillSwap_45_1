import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/auth/auth.types';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRequestDto: CreateRequestDto, @Req() req: AuthRequest) {
    return this.requestsService.create(createRequestDto, req.user.sub);
  }

  @Get('incoming')
  @UseGuards(JwtAuthGuard)
  findIncoming(@Req() req: AuthRequest) {
    return this.requestsService.findIncoming(req.user.sub);
  }

  @Get('outgoing')
  @UseGuards(JwtAuthGuard)
  findOutgoing(@Req() req: AuthRequest) {
    return this.requestsService.findOutgoing(req.user.sub);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id); //Продолжаем передавать строку с айдишкой в формате uuid
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.requestsService.markAsRead(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/accept')
  accept(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.requestsService.accept(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.requestsService.reject(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.requestsService.remove(id, req.user.sub, req.user.role);
  }
}
