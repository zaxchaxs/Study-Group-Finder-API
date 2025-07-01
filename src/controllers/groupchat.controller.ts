import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { createGroupchat, deleteGroupchat, deleteGroupchatMessage, deleteUserFromGroupchatMember, getAllGroupChat, getAllGroupchatMessage, getDetailGroupchat, getJoindedUserGroupChat, getUserGroupchat, insertUserToGroupMember, postGroupchatMessage, updateGroupchat, updateGroupchatMessage } from "../services/groupchat.service";
import fs from "fs";
import { decryptText, encryptText } from "../utils/messageEncript";
import { getLastMessageTimestamp } from "../utils/chatUtils";
import prisma from "../configs/prismaClient";

export async function getAllGroupChatHandle(req: Request, res: Response) {
    try {
        const host = `${req.protocol}://${req.get("host")}`
        const groups = await getAllGroupChat();
        groups.forEach(group => {
            if (group.image) {
                group.image = `${host}/${group.image}`
            }
            group.messages.forEach(message => {
                message.content = decryptText(message.content);
                if (message.image) {
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

export async function getJoinedUserGroupChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const host = `${req.protocol}://${req.get("host")}`
        const numberId = Number(id);
        const result = await getJoindedUserGroupChat(numberId)
        result.forEach(data => {
            if (data.group.image) {
                data.group.image = `${host}/${data.group.image}`
            };
            data.group.messages.forEach(message => {
                message.content = decryptText(message.content)
            })
        });
        result.sort((a, b) => {
            const timeA = getLastMessageTimestamp(a.group.messages[0]?.createdAt);
            const timeB = getLastMessageTimestamp(b.group.messages[0]?.createdAt);
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

export async function getUserGroupChatHandle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const host = `${req.protocol}://${req.get("host")}`
        const numberId = Number(id);
        const groups = await getUserGroupchat(numberId)
        groups.forEach(group => {
            if (group.image) {
                group.image = `${host}/${group.image}`
            }
            group.messages.forEach(message => {
                message.content = decryptText(message.content);
                if (message.image) {
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
        if (data?.image) {
            data.image = `${host}/${data.image}`
        }
        if (data?.messages) {
            data.messages.forEach(message => {
                message.content = decryptText(message.content)
                if (message.image) {
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
        await insertUserToGroupMember(result.id, req.body.authorId)
        if (result.image) {
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

export async function addUserIntoMemberGroupchatHandle(req: Request, res: Response) {
    try {
        const groupId = parseInt(req.params.id);
        if (isNaN(groupId)) {
            res.status(400).json(errorResponse(400, 'Bad Request', "Invalid Group ID.", "Invalid Group ID."));
            return;
        };

        const isManyMember = req.query.manyMember === 'true';
        let addedMembers = [];
        let alreadyJoinedUsers: {
            id: number;
            userId: number;
            groupId: number;
        }[] | null = [];

        if (isManyMember) {
            if (typeof req.body.userId === 'string') {
                req.body.userId = JSON.parse(req.body.userId);
            }
            if (!Array.isArray(req.body.userId)) {
                res.status(400).json(errorResponse(400, 'Bad Request', "userId must be an array when manyMember is 'true'.", "userId must be an array."));
                return;
            }

            const userIdsToAdd: number[] = req.body.userId.map(Number);

            const addPromises = userIdsToAdd.map(async (id) => {
                const existingMember = await prisma.groupChatMember.findFirst({
                    where: {
                        userId: id,
                        groupId: groupId
                    }
                });

                if (existingMember) {
                    console.warn(`User with ID: ${id} is already a member of group ${groupId}.`);
                    alreadyJoinedUsers.push(existingMember);
                    return null;
                } else {
                    const newMember = await insertUserToGroupMember(groupId, id);
                    return newMember;
                }
            });

            const results = await Promise.all(addPromises);
            addedMembers = results.filter(Boolean); // Filter out nulls

            if (addedMembers.length > 0) {
                res.status(200).json(successResponse({
                    addedMembers: addedMembers,
                    alreadyJoinedUsers: alreadyJoinedUsers
                }));
            } else if (alreadyJoinedUsers.length > 0) {
                res.status(409).json(errorResponse(409, 'Conflict', "Conflict", "All specified users are already members of this group."));
            } else {
                res.status(500).json(errorResponse(500, 'Internal Server Error', "No members added due to an unknown reason.", "No members added."));
            }

        } else { // Single member addition
            const userId = Number(req.body.userId);
            if (isNaN(userId)) {
                res.status(400).json(errorResponse(400, 'Bad Request', "Invalid User ID.", "Invalid User ID."));
                return;
            }

            const existingMember = await prisma.groupChatMember.findFirst({
                where: {
                    userId: userId,
                    groupId: groupId
                }
            });

            if (existingMember) {
                res.status(409).json(errorResponse(409, 'Conflict', "Conflict", "User already joined into group"));
                return;
            }

            const newMember = await insertUserToGroupMember(groupId, userId);
            console.log("single: ", newMember);
            res.status(200).json(successResponse(newMember));
        }

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
        res.status(500).json(
            errorResponse(500, 'Internal Server Error', error, errMessage)
        )
    }
}

export async function deleteUserFromMemberGroupchatHandle(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const result = await deleteUserFromGroupchatMember(id);
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
        const host = `${req.protocol}://${req.get("host")}`
        const numberId = Number(id);

        const result = await updateGroupchat(numberId, req.body);
        if (result.image) {
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
