import { NextFunction, Request, Response } from "express";
import { addUserRankSchema } from "../schemas/rank.schema";
import { errorResponse } from "../utils/response";
import { z } from "zod";
import prisma from "../configs/prismaClient";

export async  function validateCreateUserRank(req: Request, res: Response, next: NextFunction) {
    try {
        const result = addUserRankSchema.safeParse(req.body);
        if (!result.success) {
            const parsed = JSON.parse(result.error.message)
            res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
            return;
        }
        const isUserAlreadyHaveRank = await prisma.userRank.findFirst({
            where: {
                userId: req.body.userId
            }
        });
        if(isUserAlreadyHaveRank) {
            res.status(409).json(errorResponse(409, 'Conflict', "Conflict", "User already have rank!"));
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}

export function validateUpdateUserRank(req: Request, res: Response, next: NextFunction) {
    try {
        const result = addUserRankSchema.safeParse(req.body);
        if (!result.success) {
            const parsed = JSON.parse(result.error.message)
            res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export function validateCreateRankCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = z.object({
            name: z.string({message: "Rank name is required!"})
        });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const parsed = JSON.parse(result.error.message)
            res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
            return;
        }
        next();
    } catch (error) {
        next(error);
    }    
}