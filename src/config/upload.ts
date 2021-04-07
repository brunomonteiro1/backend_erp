import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

// const filePath = path.resolve(__dirname, '..', '..', 'archive');
const uploadFilePath = path.resolve(
  __dirname,
  '..',
  '..',
  'archive',
  'uploads'
);
const tmpFilePath = path.resolve(__dirname, '..', '..', 'archive', 'tmp');

export default {
  uploadDirectory: uploadFilePath,
  tmpDirectory: tmpFilePath,
  storage: multer.diskStorage({
    destination: path.resolve(tmpFilePath),
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
