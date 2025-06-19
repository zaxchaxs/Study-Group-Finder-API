import { NextFunction, Request, Response } from "express";
import { addPrivateChatMessageSchema, addPrivateChatSchema, updatePrivateChatMessageSchema } from "../schemas/privatechat.schema";
import { errorResponse } from "../utils/response";

export async function validateCreatePrivateChat(req: Request, res: Response, next: NextFunction) {
    try {
        const data = {
            ...req.body,
            userIdOne: Number(req.body.userIdOne),
            userIdTwo: Number(req.body.userIdTwo)
        }
        const result = addPrivateChatSchema.safeParse
            (data);
        if (!result.success) {
            const parsed = JSON.parse(result.error.message)
            res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
            return;
        }
        next()

    } catch (error) {
        next(error)
    }
}

export async function validateCreatePrivateChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const data = {
            ...req.body,
            chatId: Number(req.body.chatId),
            authorId: Number(req.body.authorId)
        };
        const result = addPrivateChatMessageSchema.safeParse(data);
        if (!result.success) {
            const parsed = JSON.parse(result.error.message)
            res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
            return;
        }

        next()
    } catch (error) {
        next(error)
    }
}

export async function validateUpdatePrivateChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const result = updatePrivateChatMessageSchema.safeParse(req.body);
        if (!result.success) {
            const parsed = JSON.parse(result.error.message)
            res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
            return;
        }

        next()
    } catch (error) {
        next(error)
    }
}