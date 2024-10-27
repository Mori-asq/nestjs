import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

const allowedFileTypes = ['image/jpeg', 'image/png'];
const maxFileSize = 1 * 1024 * 1024; // 5 MB

export const multerOptions = {
  storage: diskStorage({
    destination: './static/uploads', // folder for uploading files
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split('.').pop();
      callback(null, uniqueSuffix + '.' + extension);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('File type is not allowed!'), false);
    }
  },
  limits: {
    fileSize: maxFileSize,
  },
};
