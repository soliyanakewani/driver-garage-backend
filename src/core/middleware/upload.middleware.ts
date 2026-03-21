import multer from 'multer';
import path from 'path';
import fs from 'fs';

/** Generic multipart parser for text-only forms (e.g. garage signup). */
export const multipartForm = multer().any();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'vehicles');
const GARAGE_UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'garages');

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
