import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createUser(data: { email: string; name?: string }) {
  return prisma.user.create({ data });
}
