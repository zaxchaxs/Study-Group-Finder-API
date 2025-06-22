import prisma from "../configs/prismaClient";
import { PostTodolistType, UpdateTodolistType } from "../types/todolist";

export async function getAllTodolist() {
    return await prisma.todolist.findMany({
        include: {
            user: {
                select: { id: true, name: true, username: true, role: true, avatar: true }
            }
        }
    });
}

export async function getUserTodolist(userId: number) {
    return await prisma.todolist.findMany({
        where: {
            userId
        }
    })
};

export async function getDetailTodolist(id: number) {
    return await prisma.todolist.findUnique({
        where: {
            id
        }
    })
};

export async function createTodolist(data: PostTodolistType) {
    return await prisma.todolist.create({ data })
};

export async function updateTodolist(id: number, data: UpdateTodolistType) {
    return await prisma.todolist.update({
        where: {
            id
        },
        data
    })
};

export async function deleteTodolist(id: number) {
    return await prisma.todolist.delete({
        where: {
            id
        }
    })
}