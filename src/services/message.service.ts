import prisma from "../configs/prismaClient"
import { PostGroupChatMessageType } from "../types/message";

export const getGroupMessage = async (id: number) => {
    try {
        const messages = await prisma.groupChatMessage.findMany({
            where: {
                groupId: id
            },
            include: {
                author: {
                    select: {
                        id: true, email: true, avatar: true, name: true, role: true, username: true,
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        return {
            status: 200,
            statusCode: "Success",
            data: messages
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
    }
}

export const postGroupMessage = async (data: PostGroupChatMessageType) => {
    try {
        const newMessage = await prisma.groupChatMessage.create({
            data,
            include: {
                author: {
                    select: {
                        id: true, email: true, avatar: true, name: true, role: true, username: true,
                    }
                }
            }
        })
        return newMessage
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errMessage)
    }
}