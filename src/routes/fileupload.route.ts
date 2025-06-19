import { Router } from "express";
import { validateImageUpload } from "../middlewares/fileUploadHandle";
import { uploadFileHandle } from "../controllers/fileUpload.controller";

const router = Router();

router.post("/image", validateImageUpload, uploadFileHandle);

export default router;
