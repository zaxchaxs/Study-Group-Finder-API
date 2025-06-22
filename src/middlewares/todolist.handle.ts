import { NextFunction, Request, Response } from "express";
import { addTodolistSchema } from "../schemas/todolist.schema";
import { errorResponse } from "../utils/response";

export async function validateCreateTodolist(req: Request, res: Response, next: NextFunction) {
    try {
        const result = addTodolistSchema.safeParse(req.body);
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