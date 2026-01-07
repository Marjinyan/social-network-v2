import multer from "multer";
import uniqid from "uniqid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${uniqid()}.${file.originalname.split(".").at(-1)}`);
    },
});

export const upload = multer({ storage });