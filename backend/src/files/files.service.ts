import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  saveFile(file: Express.Multer.File) {
    return {
      message: 'Файл успешно загружен',
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
