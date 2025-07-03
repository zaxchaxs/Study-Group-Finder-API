import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createInterest, deleteInterest, getAllInterest, getInterest, updateInterest } from "../services/interest.service";

export async function getallInterestHandle(req: Request, res: Response) {
    try {
        const result = await getAllInterest();
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function getInterestHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const result = await getInterest(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function postInterestHandle(req: Request, res: Response) {
    try {
        const result = await createInterest(req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function updateInterestHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const result = await updateInterest(id, req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function deleteInterestHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const result = await deleteInterest(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};
