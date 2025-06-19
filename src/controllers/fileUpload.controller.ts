import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";

export async function uploadFileHandle(req: Request, res: Response) {
    try {
        res.status(200).json(successResponse(req.body.path))
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}