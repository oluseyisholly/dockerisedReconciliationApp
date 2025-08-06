import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import * as fs from 'fs-extra';
import { FILE_UPLOADS_DIR } from './index';

export const fileMulterOptions = {
  storage: diskStorage({
    destination: (req: Request, file: any, callback) => {
      // Use properties from the request body to determine the destination
      try {
        const uploadPath = FILE_UPLOADS_DIR;

        fs.ensureDir(uploadPath)
          .then(() => {
            callback(null, uploadPath);
          })
          .catch((err) => {
            callback(err, null);
          });
      } catch (error) {
        callback(error, null);
      }
    },
    filename: (req: Request, file: any, callback) => {
      // Construct a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
};
