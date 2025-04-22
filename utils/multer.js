import multer from 'multer';
import logger from './logger.js';

// Configure Multer middleware
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Basic check for image mimetypes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      logger.warn(`Upload blocked: Invalid file type - ${file.mimetype}`);
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

