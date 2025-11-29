// ============================================
// FILE: backend/middleware/multer.js
// ============================================
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// DISK STORAGE (for large files - videos, PDFs)
// ============================================
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;
    let folder;

    if (file.fieldname === 'thumbnail' || file.fieldname === 'image') {
      uploadDir = process.env.UPLOAD_DIR || './uploads/courses';
      folder = 'thumbnails';
    } else if (file.fieldname === 'previewVideo' || file.fieldname === 'video') {
      uploadDir = process.env.UPLOAD_DIR || './uploads/courses';
      folder = 'videos';
    } else if (file.fieldname === 'certificateTemplate' || file.fieldname === 'certificate') {
      uploadDir = process.env.UPLOAD_DIR || './uploads/courses';
      folder = 'certificates';
    } else if (file.fieldname === 'lessonVideo') {
      uploadDir = process.env.UPLOAD_DIR || './uploads/courses';
      folder = 'lessons';
    } else {
      uploadDir = process.env.UPLOAD_DIR || './uploads';
      folder = 'misc';
    }

    const destPath = path.join(uploadDir, folder);

    // Ensure directory exists
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ============================================
// FILE FILTER
// ============================================
const createFileFilter = (allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']) => {
  return (req, file, cb) => {
    if (file.fieldname === 'thumbnail' || file.fieldname === 'image') {
      // Images only
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for thumbnails'), false);
      }
    } else if (file.fieldname === 'previewVideo' || file.fieldname === 'video' || file.fieldname === 'lessonVideo') {
      // Videos only
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed'), false);
      }
    } else if (file.fieldname === 'certificateTemplate' || file.fieldname === 'certificate' || file.fieldname === 'pdf') {
      // PDFs and images
      const isPDF = file.mimetype === 'application/pdf';
      const isImage = file.mimetype.startsWith('image/');

      if (isPDF || isImage) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF or image files are allowed'), false);
      }
    } else if (file.fieldname === 'avatar') {
      // Profile images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for avatars'), false);
      }
    } else {
      // Default: allow specified types
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
      }
      cb(null, true);
    }
  };
};

// ============================================
// DISK UPLOAD (for large files)
// ============================================
export const diskUpload = multer({
  storage: diskStorage,
  fileFilter: createFileFilter(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB for videos
    files: 20, // Max files in one request
  }
});

// ============================================
// MEMORY UPLOAD (for small files - images, PDFs < 10MB)
// ============================================
export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for images and small files
  }
});

// ============================================
// EXPORT (for backward compatibility)
// ============================================
export default {
  diskUpload,
  memoryUpload,
  upload: memoryUpload, // Default export
};