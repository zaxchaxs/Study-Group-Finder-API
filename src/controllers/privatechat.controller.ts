import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createPrivateChat, deletePrivateChat, deletePrivateChatMessage, getAllPrivateChat, getAllPrivateChatMessage, getDetailPrivateChat, getUserPrivateChat, getUserPrivateChatMessage, postPrivateChatMessage, updatePrivateChatMessage } from "../services/privatechat.service";
import fs from "fs";
import { decryptText, encryptText } from "../utils/messageEncript";
import { getLastMessageTimestamp } from "../utils/chatUtils";

export async function getAllPrivateChatHandle(req: Request, res: Response) {
    try {
        const result = await getAllPrivateChat();
        result.forEach(messages => {
            messages.messages.forEach(message => {
                message.content = decryptText(message.content);
            })
        });
        res.status(200).json(successResponse(result))
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getUserPrivateChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json(errorResponse(400, "Bad Request", "User ID is required in parameter!", "User ID is required in parameter!"))
            return;
        };
        const numberId = Number(id)
        const result = await getUserPrivateChat(numberId);
        result.forEach(privateMessage => {
            privateMessage.messages.forEach(message => {
                message.content = decryptText(message.content);
            })
        });
        result.sort((a, b) => {
            const timeA = getLastMessageTimestamp(a.messages[0]?.createdAt);
            const timeB = getLastMessageTimestamp(b.messages[0]?.createdAt);
            return timeB - timeA
        })
        res.status(200).json(successResponse(result))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getDetailPrivateChatHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params?.id);
        if (!id) {
            res.status(400).json(errorResponse(400, "Bad Request", "Private chat ID is required in parameter!", "Private chat ID is required in parameter!"))
            return
        };

        const result = await getDetailPrivateChat(id);
        result?.messages.forEach(message => {
            decryptText(message.content);
        });
        res.status(200).json(successResponse(result))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function postPrivateChatHandle(req: Request, res: Response) {
    try {
        const result = await createPrivateChat(req.body);
        res.status(200).json(successResponse(result))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deletePrivateChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const numberId = Number(id);
        const messages = await getUserPrivateChatMessage(numberId);
        if (messages.length !== 0) {
            messages.forEach(message => {
                if (message.image) {
                    fs.unlink(`public/${message.image}`, err => {
                        console.error("#irzi ignore this: ", err);
                    })
                }
            })
        };

        const result = await deletePrivateChat(numberId)
        res.status(200).json(successResponse(result))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

// Messages
export async function getAllPrivateChatMessageHandle(req: Request, res: Response) {
    try {
        const result = await getAllPrivateChatMessage();
        result.forEach(message => {
            message.content = decryptText(message.content);
        });
        res.status(200).json(successResponse(result))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function getUserPrivateChatMessageHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (!id) {
            res.status(400).json(errorResponse(400, "Bad Request", "Chat ID is required in parameter!", "Chat ID is required in parameter!"))
            return
        };
        const result = await getUserPrivateChatMessage(id)
        result.forEach(message => {
            message.content = decryptText(message.content);
        })
        res.status(200).json(successResponse(result))

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function postPrivateChatMessageHandle(req: Request, res: Response) {
    try {
        const result = await postPrivateChatMessage(req.body);
        result.content = decryptText(result.content);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
};

export async function updatePrivateChatMessageHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!id) {
            res.status(400).json(errorResponse(400, "Bad Request", "Message ID is required in parameter!", "Message ID is required in parameter!"))
            return
        };
        req.body.content = encryptText(req.body.content);
        const result = await updatePrivateChatMessage(id, req.body)
        result.content = decryptText(result.content);
        res.status(200).json(successResponse(result));

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deletePrivateChatMessageHandle(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!id) {
            res.status(400).json(errorResponse(400, "Bad Request", "Message ID is required in parameter!", "Message ID is required in parameter!"))
            return
        };
        const result = await deletePrivateChatMessage(id)
        if (result.image) {
            fs.unlink(`public/${result.image}`, err => {
                console.error("#irzi ignore this: ", err);
            })
        }
        res.status(200).json(successResponse(result));

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}