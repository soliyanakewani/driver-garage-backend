import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/** Generic multipart parser for text-only forms (e.g. garage signup). */
export const multipartForm = multer().any();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'vehicles');
const GARAGE_UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'garages');
const COMMUNITY_UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'community');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const vehicleDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(UPLOADS_DIR);
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

/** Multer instance for vehicle create/update. Accepts image, insuranceDocument, registrationDocument. */
export const vehicleUpload = multer({
  storage: vehicleDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not allowed`));
    }
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'insuranceDocument', maxCount: 1 },
  { name: 'registrationDocument', maxCount: 1 },
]);

const garageDocumentDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(GARAGE_UPLOADS_DIR);
    cb(null, GARAGE_UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const communityImageDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(COMMUNITY_UPLOADS_DIR);
    cb(null, COMMUNITY_UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

/** Community post images: accepts up to 5 image files under `images`. */
export const communityImageUpload = multer({
  storage: communityImageDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not allowed`));
    }
  },
});

/** Garage signup / profile: business or registration document (PDF or images). */
export const garageDocumentUpload = multer({
  storage: garageDocumentDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not allowed`));
    }
  },
}).fields([
  { name: 'businessDocument', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'registrationDocument', maxCount: 1 },
]);

const EDUCATION_MANUALS_DIR = path.join(process.cwd(), 'uploads', 'education-manuals');
const EDUCATION_IMAGES_DIR = path.join(process.cwd(), 'uploads', 'education-images');

const educationContentDiskStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'pdf') {
      ensureDir(EDUCATION_MANUALS_DIR);
      cb(null, EDUCATION_MANUALS_DIR);
    } else {
      ensureDir(EDUCATION_IMAGES_DIR);
      cb(null, EDUCATION_IMAGES_DIR);
    }
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

/** Admin education: PDF manual (`pdf`) + optional cover image (`image`). */
export const educationContentUpload = multer({
  storage: educationContentDiskStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (file.fieldname === 'pdf') {
      if (ext === 'pdf') {
        cb(null, true);
      } else {
        cb(new Error('Manual must be a .pdf file'));
      }
      return;
    }
    if (file.fieldname === 'image') {
      if (/^(jpeg|jpg|png|gif|webp)$/i.test(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Cover image must be jpeg, png, gif, or webp'));
      }
      return;
    }
    cb(new Error(`Unexpected upload field: ${file.fieldname}`));
  },
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

/** Run multipart parser only when client sends multipart/form-data (keeps JSON-only requests working). */
export function educationContentUploadIfMultipart(req: Request, res: Response, next: NextFunction) {
  const ct = req.headers['content-type'] || '';
  if (ct.toLowerCase().includes('multipart/form-data')) {
    return educationContentUpload(req, res, next);
  }
  next();
}
