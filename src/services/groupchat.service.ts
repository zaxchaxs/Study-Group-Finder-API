import prisma from "../configs/prismaClient";
import { GroupchatMessageType, PostGroupchatMessageType, PostGroupchatType, UpdateGroupchatType } from "../types/groupchat";

export async function getAllGroupChat() {
    const result = await prisma.groupChat.findMany({
        include: {
            messages: {
                include: {
                    author: {
                        select: { name: true, id: true, }
                    }
                },
                take: 1,
                orderBy: {
                    "createdAt": "desc"
                }
            }
        }
    });
    return result
}

export async function getUserGroupchat(id: number) {
    return await prisma.groupChat.findMany({
        where: {
            authorId: id
        },
        include: {
            messages: {
                include: {
                    author: {
                        select: { name: true, id: true, }
                    }
                },
                take: 1,
                orderBy: {
                    "createdAt": "desc"
                }
            }
        }
    })
}

export async function getDetailGroupchat(id: number, showMessages?: boolean): DetailGroupChatReturnType {
    let include;

    if (showMessages) {
        include = {
            messages: {
                include: {
                    author: {
                        select: { id: true, name: true, avatar: true, role: true, }
                    }
                }
            }
        }
    }

    return await prisma.groupChat.findUnique({
        where: {
            id
        },
        include
    })
}

export async function createGroupchat(data: PostGroupchatType) {
    return await prisma.groupChat.create({ data })
};

export async function updateGroupchat(id: number, data: UpdateGroupchatType) {
    return await prisma.groupChat.update({
        where: {
            id
        },
        data
    })
};

export async function deleteGroupchat(id: number) {
    return await prisma.groupChat.delete({
        where: {
            id
        }
    })
}


// Message

export async function getAllGroupchatMessage() {
    const result = await prisma.groupChatMessage.findMany();
    return result
}

export async function postGroupchatMessage(data: PostGroupchatMessageType) {
    return await prisma.groupChatMessage.create({ data })
}

export async function updateGroupchatMessage(id: number, data: PostGroupchatMessageType) {
    return await prisma.groupChatMessage.update({
        where: {
            id
        },
        data: {
            content: data.content
        }
    })
}

export async function deleteGroupchatMessage(id: number) {
    return await prisma.groupChatMessage.delete({
        where: {
            id
        }
    })
}

type DetailGroupChatReturnType = Promise<{
    id: number;
    authorId: number;
    name: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    messages?: GroupchatMessageType[]
} | null>