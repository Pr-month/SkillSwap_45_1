import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (_req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const safeName = file.originalname.replace(fileExtName, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileName = `${safeName}-${Date.now()}${fileExtName}`;
      callback(null, fileName);
    },
  }),
  limits: {
    fileSize: 2*1024*1024,
  },
};
