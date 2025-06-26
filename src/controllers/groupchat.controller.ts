import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createGroupchat, deleteGroupchat, deleteGroupchatMessage, getAllGroupChat, getAllGroupchatMessage, getDetailGroupchat, getUserGroupchat, postGroupchatMessage, updateGroupchat, updateGroupchatMessage } from "../services/groupchat.service";
import fs from "fs";
import { decryptText, encryptText } from "../utils/messageEncript";

export async function getAllGroupChatHandle(req: Request, res: Response) {
    try {
        const host = `${req.protocol}://${req.get("host")}`
        const groups = await getAllGroupChat();
        groups.forEach(group => {
            if(group.image) {
                group.image = `${host}/${group.image}`
            }
            group.messages.forEach(message => {
                message.content = decryptText(message.content);
                if(message.image) {
                    message.image = `${host}/${message.image}`
                }
            })
        })
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
        const host = `${req.protocol}://${req.get("host")}`
        const numberId = Number(id);
        const groups = await getUserGroupchat(numberId)
        groups.forEach(group => {
            if(group.image) {
                group.image = `${host}/${group.image}`
            }
            group.messages.forEach(message => {
                message.content = decryptText(message.content);
                if(message.image) {
                    message.image = `${host}/${message.image}`
                }
            })
        })
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
        const host = `${req.protocol}://${req.get("host")}`
        const { showMessages } = req.query;
        
        const numberid = Number(id);
        
        const data = await getDetailGroupchat(numberid, showMessages == "true")
        if(data?.image) {
            data.image = `${host}/${data.image}`
        }
        if(data?.messages) {
            data.messages.forEach(message => {
                message.content = decryptText(message.content)
                if(message.image) {
                    message.image = `${host}/${message.image}`
                }
            })
        }
        
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
        const host = `${req.protocol}://${req.get("host")}`
        
        const result = await createGroupchat(req.body);
        if(result.image) {
            result.image = `${host}/${result.image}`
        }
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
        console.log("marsh", req.body);
        
        const { id } = req.params;
        const host = `${req.protocol}://${req.get("host")}`
        const numberId = Number(id);
        
        const result = await updateGroupchat(numberId, req.body);
        if(result.image) {
            result.image = `${host}/${result.image}`
        }
        res.status(200).json(successResponse(result))
        
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

// Messages
export async function getAllGroupchatMessageHandle(req: Request, res: Response) {
    try {
        const groups = await getAllGroupchatMessage();
        res.status(200).json(successResponse(groups));

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
        req.body.content = encryptText(req.body.content);
        const result = await postGroupchatMessage(req.body)
        result.content = decryptText(result.content)
        res.status(200).json(successResponse(result));

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function updateGroupchatMessageHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const numberId = Number(id);
        req.body.content = encryptText(req.body.content);
        const result = await updateGroupchatMessage(numberId, req.body)
        result.content = decryptText(result.content)
        res.status(200).json(successResponse(result));

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteGroupchatMessageHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const numberId = Number(id);
        const result = await deleteGroupchatMessage(numberId);
        if(result.image) {
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
