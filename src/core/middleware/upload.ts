import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

            cb(null,
                uniqueName + path.extname(file.originalname)
            );
    },
});

const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb:any 
) => {
    const allowedTypes = /jpg|jpeg|png|gif|webp/;

   const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype); 
    if (extname && mimetype) {
        return cb(null, true);
    } 
    cb(new Error("Only image files are allowed!"));
};

export const upload = multer({
    storage,
    fileFilter,
    //limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
   
});
