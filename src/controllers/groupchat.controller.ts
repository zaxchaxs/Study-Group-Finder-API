import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createGroupchat, deleteGroupchat, getAllGroupChat, getDetailGroupchat, getUserGroupchat, postGroupchatMessage, updateGroupchat } from "../services/groupchat.service";
import fs from "fs";

export async function getAllGroupChatHandle(req: Request, res: Response) {
    try {
        const groups = await getAllGroupChat();
        res.status(200).json(successResponse(groups));

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getUserGroupChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const numberId = Number(id);
        const groups = await getUserGroupchat(numberId)
        res.status(200).json(successResponse(groups))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

// include message
export async function getDetailGroupChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { showMessages } = req.query;

        const numberid = Number(id);
        
        const data = await getDetailGroupchat(numberid, showMessages == "true")
        
        res.status(200).json(successResponse(data))
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function postGroupChatHandle(req: Request, res: Response) {
    try {
        const result = await createGroupchat(req.body);
        res.status(200).json(successResponse(result))
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function updateGroupChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const numberId = Number(id);
        const result = await updateGroupchat(numberId, req.body);
        res.status(200).json(result)
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteGroupChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const numberId = Number(id);
        const result = await deleteGroupchat(numberId);
        fs.unlink(`public/${result.image}`, err => {
            console.error("#irzi ignore this: ", err);
        })
        res.status(200).json(successResponse(result));
        
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}


export async function postGroupchatMessageHandle(req: Request, res: Response) {
    try {
        const result = await postGroupchatMessage(req.body)
        res.status(200).json(successResponse(result));

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}