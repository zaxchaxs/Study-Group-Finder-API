import { NextFunction, Request, Response } from "express";
import { addGroupchatMessageSchema, addGroupChatSchema, updateGroupchatMessageSchema, updateGroupChatSchema } from "../schemas/groupchat.schema";
import { errorResponse } from "../utils/response";
import { memoryUpload } from "./multerFileUpload";
import fs from "fs";
import path from "path";

export async function validateCreateGroupchat(req: Request, res: Response, next: NextFunction) {
    memoryUpload([{ name: "image", maxCount: 1 }])(req, res, async err => {
        if (err) next(err);

        try {
            const data = {
                ...req.body,
                authorId: Number(req.body.authorId)
            }

            const result = addGroupChatSchema.safeParse(data);
            if (!result.success) {
                const parsed = JSON.parse(result.error.message)
                res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
                return;
            }

            // Jika file ada, simpan manual ke disk
            if (req.files && typeof req.files === "object" && "image" in req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                const file = files["image"][0];
                const dir = path.join("public/images/groupchat");
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                const ext = file.mimetype.split("/")[1] === "jpeg" ? "jpg" : file.mimetype.split("/")[1];
                const filename = `${Date.now()}.${ext}`;
                const fullPath = path.join(dir, filename);

                fs.writeFileSync(fullPath, file.buffer);
                
                req.body.image = path.join("images/groupchat", filename);
            }
            req.body.authorId = data.authorId
            next()

        } catch (error) {
            next(error)
        }
    })
};

export async function validateUpdateGroupChat(req: Request, res: Response, next: NextFunction) {
    memoryUpload([{ name: "newImage", maxCount: 1 }])(req, res, async error => {
        if (error) return next(error);

        try {
            const data = {
                ...req.body,
                authorId: Number(req.body.authorId),
                image: req.body.image === 'null' ? null : req.body.image
            }

            const result = updateGroupChatSchema.safeParse(data);
            if (!result.success) {
                const parsed = JSON.parse(result.error.message)
                res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
                return;
            }

            if (req.files && typeof req.files === "object" && "newImage" in req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                const file = files["newImage"][0];
                const dir = path.join("public/images/groupchat");
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                const ext = file.mimetype.split("/")[1] === "jpeg" ? "jpg" : file.mimetype.split("/")[1];
                const filename = `${Date.now()}.${ext}`;
                const fullPath = path.join(dir, filename);

                fs.writeFileSync(fullPath, file.buffer);

                // delete image lama
                fs.unlink(`public/${data.image}`, (error) => {
                    console.error("#irzi ignore this: ", error);
                });

                req.body.image = path.join("images/groupchat", filename)
            }

            req.body.authorId = data.authorId

            next()
        } catch (error) {
            next(error)
        }
    })
}

// message
export async function validateCreateGroupchatMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const result = addGroupchatMessageSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json(errorResponse(400, 'Bad Request', JSON.parse(result.error.message), JSON.parse(result.error.message)[0].message));
            return;
        }

        next()
    } catch (error) {
        next(error)
    }
}

export async function validateUpdateGroupchatMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const result = updateGroupchatMessageSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json(errorResponse(400, 'Bad Request', JSON.parse(result.error.message), JSON.parse(result.error.message)[0].message));
            return;
        }

        next()
    } catch (error) {
        next(error)
    }
}