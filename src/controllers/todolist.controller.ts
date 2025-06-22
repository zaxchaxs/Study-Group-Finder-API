import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createTodolist, deleteTodolist, getAllTodolist, getDetailTodolist, getUserTodolist, updateTodolist } from "../services/todolist.service";

export async function getAllTodolistHandle(req: Request, res: Response) {
    try {
        const result = await getAllTodolist();
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getUserTodolistHandle(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id);
        const result = await getUserTodolist(userId);
        res.status(200).json(successResponse(result))
        
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getDetailTodolistHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = await getDetailTodolist(id)
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function postTodolistHandle(req: Request, res: Response) {
    try {
        const result = await createTodolist(req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function updateTodolistHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = await updateTodolist(id, req.body);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteTodolistHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = await deleteTodolist(id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}