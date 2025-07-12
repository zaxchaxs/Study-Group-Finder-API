import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { deleteUserProfile, getUserProfile, upsertUserProfile } from "../services/user-profile.service";

export async function getUserProfileHandle(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json(errorResponse(400, "Bad Request", "Invalid User ID", 'Invalid User ID'));
        };

        const result = await getUserProfile(userId);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function upsertUserProfileHandle(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId);

        const result = await upsertUserProfile(userId, req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteUserProfileHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json(errorResponse(400, "Bad Request", "Invalid User ID", 'Invalid User ID'));
        }

        const result = await deleteUserProfile(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}