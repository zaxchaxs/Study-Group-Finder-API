import prisma from "../configs/prismaClient";
import { PostPrivateChatMessageType, PostPrivateChatType } from "../types/privatechat";

export async function getAllPrivateChat() {
    return await prisma.privateChat.findMany({
        include: {
            userOne: {
                select: { id: true, username: true, name: true, role: true, avatar: true, }
            },
            userTwo: {
                select: { id: true, username: true, name: true, role: true, avatar: true, }
            },
            messages: {
                include: {
                    author: {
                        select: { id: true, username: true, name: true, role: true, avatar: true, }
                    }
                },
                take: 1,
                orderBy: {
                    "createdAt": "desc"
                }
            }
        }
    });
};

export async function getUserPrivateChat(id: number) {
    return await prisma.privateChat.findMany({
        where: {
            OR: [
                {
                    userIdOne: id,
                },
                {
                    userIdTwo: id,
                },
            ],
        },
        include: {
            userOne: {
                select: { id: true, username: true, name: true, role: true, avatar: true, }
            },
            userTwo: {
                select: { id: true, username: true, name: true, role: true, avatar: true, }
            },
            messages: {
                include: {
                    author: {
                        select: { id: true, username: true, name: true, role: true, avatar: true, }
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

export async function getDetailPrivateChat(id: number) {
    return await prisma.privateChat.findUnique({
        where: {
            id
        },
        include: {
            messages: {
                include: {
                    author: {
                        select: { id: true, username: true, name: true, role: true, avatar: true, }
                    }
                }
            }
        }
    })   
};

export async function createPrivateChat(data: PostPrivateChatType) {
    return await prisma.privateChat.create({
        data
    })
}

export async function deletePrivateChat(id: number) {
    return await prisma.privateChat.delete({
        where: {
            id
        }
    })
};


// message
export async function getAllPrivateChatMessage() {
    return await prisma.privateChatMessage.findMany();
};

// get data pesan pada personal chat
export async function getUserPrivateChatMessage(id: number) {
    return await prisma.privateChatMessage.findMany({
        where: {
            chatId: id
        }
    })
};

export async function postPrivateChatMessage(data: PostPrivateChatMessageType) {
    return await prisma.privateChatMessage.create({data})
};

export async function updatePrivateChatMessage(id: number, data: PostPrivateChatMessageType) {
    return await prisma.privateChatMessage.update({
        where: {
            id
        },
        data: {
            content: data.content
        }
    })
};

export async function deletePrivateChatMessage(id: number) {
    return await prisma.privateChatMessage.delete({
        where: {
            id
        }
    })
}