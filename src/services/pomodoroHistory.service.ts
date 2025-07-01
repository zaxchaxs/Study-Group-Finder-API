import prisma from "../configs/prismaClient";
import {
  PomodoroHistoryType,
  PostPomodoroHistoryType,
  UpdatePomodoroHistoryType,
} from "../types/pomodoroHistory";

export const createPomodoroHistory = async (data: PostPomodoroHistoryType) => {
  return await prisma.pomodoroHistory.create({ data });
};

export const getAllPomodoroHistory = async () => {
  return await prisma.pomodoroHistory.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          avatar: true,
        },
      },
    },
  });
};

export async function getUserPomodoroHistory(userId: number) {
  return await prisma.pomodoroHistory.findMany({
    where: {
      userId,
    },
  });
}

export async function getDetailPomodoroHistory(id: number) {
  return await prisma.pomodoroHistory.findUnique({
    where: {
      id,
    },
  });
}

export async function updatePomodoroHistory(
  id: number,
  data: UpdatePomodoroHistoryType,
) {
  return await prisma.pomodoroHistory.update({
    where: {
      id,
    },
    data,
  });
}

export async function deletePomodoroHistory(id: number) {
  return await prisma.pomodoroHistory.delete({
    where: {
      id,
    },
  });
}
