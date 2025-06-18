import multer from "multer";

export const memoryUpload = (fields: { name: string; maxCount: number }[]) => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  }).fields(fields);
};