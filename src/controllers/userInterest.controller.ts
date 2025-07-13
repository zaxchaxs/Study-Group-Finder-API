import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createUserInterest, deleteUserInterest, getAllUserIntereset, getUserInterest, updateUserInterest } from "../services/userInterest.service";

export async function getAllUserInterestHandle(req: Request, res: Response) {
    try {
        const result = await getAllUserIntereset();
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getUserInterestHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.userId);
        
        const result = await getUserInterest(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function postUserInterestHandle(req: Request, res: Response) {
    try {
        const result = await createUserInterest(req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function updateUserInterestHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        
        const result = await updateUserInterest(id, req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteUserInterestHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        
        const result = await deleteUserInterest(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}