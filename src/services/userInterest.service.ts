import prisma from "../configs/prismaClient";
import { PostUserInterestType } from "../types/interest";

export async function getAllUserIntereset() {
    return await prisma.userInterest.findMany();
};

export async function getUserInterest(userId: number) {
    return await prisma.userInterest.findMany({
        where: {
            userId: userId
        }
    })
};

export async function createUserInterest(data: PostUserInterestType) {
    return await prisma.userInterest.create({
        data
    })
};

export async function updateUserInterest(id: number, data: PostUserInterestType) {
    return await prisma.userInterest.update({
        where: {
            id
        },
        data
    })
};

export async function deleteUserInterest(id: number) {
    return await prisma.userInterest.delete({
        where: {
            id
        }
    })
};

