import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

export const fileValidation = {
  image: ["image/jpeg", "image/png"],
  document: ["application/pdf", "application/json"],
};

export const cloudFileUpload = ({
  validation = [],
}: {
  validation?: string[];
}) => {
  const storage = multer.diskStorage({});

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    if (validation.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file format"));
    }
  };

  return multer({
    storage,
    fileFilter,
  });
};