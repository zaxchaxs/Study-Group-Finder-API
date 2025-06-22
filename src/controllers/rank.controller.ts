import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createRankCategory, createUserRank, deleteRankCategory, deleteUserRank, getAllRank, getAllRankCategory, getDetailRank, getDetailRankCategory, getUserRank, updateRankCategory, updateUserRank } from "../services/rank.service";

export async function getAllRankHandle(req: Request, res: Response) {
    try {
        const result = await getAllRank();
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getUserRankHandle(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id)
        const result = await getUserRank(userId);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}
 
export async function getDetailRankHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const result = await getDetailRank(id)
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}
 
export async function postRankHandle(req: Request, res: Response) {
    try {
        const result = await createUserRank(req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}
 
export async function updateRankHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const result = await updateUserRank(id, req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}
 
export async function deleteRankHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const result = await deleteUserRank(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}


// Rank Category
export async function getAllRankCategoryHandle(req: Request, res: Response) {
    try {
        const result = await getAllRankCategory();
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}
 
export async function getDetailRankCategoryHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const result = await getDetailRankCategory(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function postRankCategoryHandle(req: Request, res: Response) {
    try {
        const result = await createRankCategory(req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function updateRankCategoryHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const result = await updateRankCategory(id, req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteRankCategoryHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const result = await deleteRankCategory(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}
 