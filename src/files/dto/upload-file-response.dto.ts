import { ApiProperty } from "@nestjs/swagger";

export class UploadFileResponseDto {
  @ApiProperty({ example: 'Файл успешно загружен' })
  message: string;

  @ApiProperty({ example: '/uploads/file.jpg', description: 'Путь к файлу на сервере'})
  url: string;

  @ApiProperty({ example: 'file.jpg', description: 'Оригинальное имя файла' })
  originalName: string;

  @ApiProperty({ example: 102400 , description: 'Размер файла в байтах' })
  size: number;

  @ApiProperty({ example: 'image/jpeg', description: 'MIME-тип файла' })
  mimeType: string;
}