import { NextFunction, Request, Response } from "express";
import { memoryUpload } from "./multerFileUpload";
import { uploadImageSchema } from "../schemas/fileUpload.schema";
import { errorResponse } from "../utils/response";
import fs from "fs";
import path from "path";

export async function validateImageUpload(req: Request, res: Response, next: NextFunction) {
    memoryUpload([{ name: "image", maxCount: 1 }])(req, res, async (err) => {
        if (err) next(err);

        try {
            const result = uploadImageSchema.safeParse({
                path: req.body.path,
                image: req.body.files?.image && "image existed"
            });
            if (!result.success) {
                const parsed = JSON.parse(result.error.message)
                res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
                return;
            }

            if (req.files && typeof req.files === "object" && "image" in req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                const file = files["image"][0];
                const dir = path.join(`public/images/`, req.body.path);
                
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                const ext = file.mimetype.split("/")[1] === "jpeg" ? "jpg" : file.mimetype.split("/")[1];
                const filename = `${Date.now()}.${ext}`;
                const fullPath = path.join(dir, filename);

                fs.writeFileSync(fullPath, file.buffer);

                req.body.path = path.join(`images/${req.body.path}`, filename);
            }

            next();
        } catch (error) {
            next(error)
        }
    })
}