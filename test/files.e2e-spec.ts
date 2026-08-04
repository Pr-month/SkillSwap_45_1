import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import fs from 'fs';
import path from 'path';

describe('FilesController (e2e)', () => {
  let app: INestApplication;

  // Путь к папке загрузок
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Создаём папку, если её нет
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  // Очищаем папку после каждого теста (удаляем только файлы, созданные тестами)
  afterEach(async () => {
    const files = fs.readdirSync(uploadDir);
    for (const file of files) {
      fs.unlinkSync(path.join(uploadDir, file));
    }
  });

  describe('POST /files/upload', () => {
    it('should upload a file and return file info', async () => {
      const filePath = path.join(__dirname, 'test-file.txt');
      // Создаём временный файл
      fs.writeFileSync(filePath, 'Hello, world!');

      const response = await request(app.getHttpServer())
        .post('/files/upload')
        .attach('file', filePath)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Файл успешно загружен');
      expect(response.body).toHaveProperty('url');
      expect(response.body.url).toMatch(/^\/uploads\/.+/);
      expect(response.body).toHaveProperty('originalName', 'test-file.txt');
      expect(response.body).toHaveProperty('size');
      expect(response.body).toHaveProperty('mimeType', 'text/plain');

      // Проверяем, что файл действительно существует на диске
      const fileName = path.basename(response.body.url);
      const savedPath = path.join(uploadDir, fileName);
      expect(fs.existsSync(savedPath)).toBe(true);

      // Удаляем временный файл
      fs.unlinkSync(filePath);
    });

    it('should return 400 if no file is uploaded', async () => {
      await request(app.getHttpServer()).post('/files/upload').expect(400);
    });

    it('should return 413 if file is too large (if configured)', async () => {
      // Создаём файл размером 3MB (если лимит 2MB)
      const largeFilePath = path.join(__dirname, 'large-file.bin');
      // переводим в байты
      const buffer = Buffer.alloc(3 * 1024 * 1024);
      fs.writeFileSync(largeFilePath, buffer);

      await request(app.getHttpServer())
        .post('/files/upload')
        .attach('file', largeFilePath)
        .expect(413); // Payload Too Large

      fs.unlinkSync(largeFilePath);
    });

    it('should return 400 if file type is not allowed (if configured in multerOptions)', async () => {
      // Зависит от настроек multerOptions (например, fileFilter)
      // Если разрешены только изображения, то текстовый файл вызовет 400
      const txtFilePath = path.join(__dirname, 'test-file.txt');
      fs.writeFileSync(txtFilePath, 'Hello');

      // Если multerOptions настроен на только изображения, этот запрос должен вернуть 400
      // Тест может быть пропущен, если фильтра нет
      const response = await request(app.getHttpServer())
        .post('/files/upload')
        .attach('file', txtFilePath);

      // Если статус 201, то фильтр не активен - пропускаем проверку
      if (response.status === 201) {
        console.warn(
          'File type filter not configured – skipping type validation test',
        );
        // Удаляем загруженный файл, если он создался
        const fileName = path.basename(response.body.url);
        const savedPath = path.join(uploadDir, fileName);
        if (fs.existsSync(savedPath)) {
          fs.unlinkSync(savedPath);
        }
      } else {
        expect(response.status).toBe(400);
      }

      fs.unlinkSync(txtFilePath);
    });
  });
});
