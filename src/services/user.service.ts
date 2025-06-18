import prisma from "../configs/prismaClient";
import { LoginUserType, PostUserType, UpdateUserType } from "../types/user";

export async function getAllUser() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

export async function getUser(id: number) {
  return await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  })
}

export async function createUser(data: PostUserType) {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
    }
  });
}

export async function updateUser(id: number, data: UpdateUserType) {
  return await prisma.user.update({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
    data
  })
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
    }
  })
}

export async function loginUser(data: LoginUserType) {
  return await prisma.user.findUnique({
    where: {
      email: data.email
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })
}