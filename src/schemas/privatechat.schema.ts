import { z } from "zod";

export const addPrivateChatSchema = z.object({
  userIdOne: z.number({ message: "Current User ID is required" }),
  userIdTwo: z.string({ message: "Target User ID is required" }).min(4).max(191, { message: "Group name is too long" }),
});

export const addPrivateChatMessageSchema = z.object({
  chatId: z.number({ message: "Private chat ID is required" }),
  author: z.number({ message: "Author ID is required" }).min(4).max(191, { message: "Group name is too long" }),
  content: z.string({message: "Message content is required!"}),
  image: z.string({message: "Image field is required!"}).max(255, {message: "Image value contain most 255 character!"}).or(z.null()).optional()
});

export const updatePrivateChatMessageSchema = z.object({
  content: z.string({message: "Message content is required!"}),
});

