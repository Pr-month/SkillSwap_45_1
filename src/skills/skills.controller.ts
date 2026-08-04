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
  Query,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import { AuthRequest } from 'src/auth/auth.types';
import {
  SkillsPost,
  SkillsPostFavouriteById,
  SkillsRemoveFromFavouriteById,
  SkillsGetAll,
  SkillsGetById,
  SkillsPatchUpdate,
  SkillsDeleteById,
} from './skills.swagger';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @SkillsPost()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSkillDto: CreateSkillDto, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.create(createSkillDto, userId);
  }

  @SkillsPostFavouriteById()
  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  addToFavorites(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.addToFavorites(id, userId);
  }

  @SkillsRemoveFromFavouriteById()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  removeFromFavorites(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.removeFromFavorites(id, userId);
  }

  @SkillsGetAll()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.skillsService.findAll(paginationDto);
  }

  @SkillsGetById()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @SkillsPatchUpdate()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.sub;
    return this.skillsService.update(id, updateSkillDto, userId);
  }

  @SkillsDeleteById()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.remove(id, userId);
  }
}
