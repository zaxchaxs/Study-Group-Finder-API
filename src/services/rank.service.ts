import prisma from "../configs/prismaClient";
import { PostRankCategoryType, PostUserRankType, UpdateUserRankType } from "../types/rank";

export async function getAllRank() {
    return await prisma.userRank.findMany({
        include: {
            user: {
                select: {id: true, name: true, username: true, email: true, avatar: true}
            }
        }
    });
};

export async function getUserRank(userId: number) {
    return await prisma.userRank.findFirst({
        where: {
            user: {
                id: userId
            }
        },
        include: {
            user: {
                select: {id: true, name: true, username: true, email: true, avatar: true}
            }
        }
    })
};

export async function getDetailRank(rankId: number) {
    return await prisma.userRank.findUnique({
        where: {
            id: rankId
        },
        include: {
            user: {
                select: {id: true, name: true, username: true, email: true, avatar: true}
            }
        }
    })
};

export async function createUserRank(data: PostUserRankType) {
    return await prisma.userRank.create({
        data
    })
};

export async function updateUserRank(id: number, data: UpdateUserRankType) {
    return await prisma.userRank.update({
        where: {
            id
        },
        data
    })
};

export async function deleteUserRank(id: number) {
    return await prisma.userRank.delete({
        where: {
            id
        }
    })
};

// Rank Category
export async function getAllRankCategory() {
    return await prisma.rankCategory.findMany();
};

export async function getDetailRankCategory(id: number) {
    return await prisma.rankCategory.findUnique({
        where: {
            id
        }
    })
};

export async function createRankCategory(data: PostRankCategoryType) {
    return await prisma.rankCategory.create({
        data
    })   
};

export async function updateRankCategory(id: number, data: PostRankCategoryType) {
    return await prisma.rankCategory.update({
        where: {
            id
        },
        data
    })
};

export async function deleteRankCategory(id: number) {
    return await prisma.rankCategory.delete({
        where: {
            id
        }
    })
};
