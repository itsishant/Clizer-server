import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';

const allowedMimeTypes = new Set([
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
  'video/webm',
  'video/x-msvideo',
  'video/mpeg'
]);

const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}${ext}`;
    cb(null, name);
  }
});

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: env.maxUploadSizeBytes
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError('Invalid video mime type', 400));
      return;
    }
    cb(null, true);
  }
});
