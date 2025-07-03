import { Prisma } from "@prisma/client";
import prisma from "../configs/prismaClient";
import { PostInterestType } from "../types/interest";
import { DefaultArgs } from "@prisma/client/runtime/library";

export async function getAllInterest(whereClause?: Prisma.InterestWhereInput, select?: Prisma.InterestSelect<DefaultArgs>) {
    return await prisma.interest.findMany({
        orderBy: {
            name: "asc"
        },
        where: whereClause,
        select
    });
};

export async function getInterest(id: number) {
    return await prisma.interest.findUnique({
        where: {
            id
        }
    })
};

export async function createInterest(data: PostInterestType) {
    return await prisma.interest.create({
        data
    });
};

export async function updateInterest(id: number, data: PostInterestType) {
    return await prisma.interest.update({
        where: {
            id
        },
        data
    })
};

export async function deleteInterest(id: number) {
    return await prisma.interest.delete({
        where: {
            id
        }
    })
};
