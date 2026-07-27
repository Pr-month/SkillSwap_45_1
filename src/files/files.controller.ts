import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse 
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { Express } from 'express';
import { multerOptions } from '../config/multer.config';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Загрузить файл' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto})
  @ApiResponse({ status: 201, type: UploadFileResponseDto })
  @ApiResponse({ status: 400, description: 'Файл не загружен' })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    return this.filesService.saveFile(file);
  }
}
