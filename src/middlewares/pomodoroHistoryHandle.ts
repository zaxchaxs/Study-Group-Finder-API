import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";
import { PomodoroHistorySchema } from "../schemas/pomodoroHistory.schema";

export async function validateCreatePomodoro(req: Request, res: Response, next: NextFunction) {
    try {
        const result = PomodoroHistorySchema.safeParse(req.body);
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