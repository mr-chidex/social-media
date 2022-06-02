import multer from "multer";

const imageFilter = (_: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const imageStorage = multer.diskStorage({});

export const uploads = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
});
