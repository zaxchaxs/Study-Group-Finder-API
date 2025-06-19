import { z } from "zod";

export const addPrivateChatSchema = z.object({
  userIdOne: z.number({ message: "Current User ID is required" }),
  userIdTwo: z.number({ message: "Target User ID is required" }),
});

export const addPrivateChatMessageSchema = z.object({
  chatId: z.number({ message: "Private chat ID is required" }),
  authorId: z.number({ message: "Author ID is required" }),
  content: z.string({message: "Message content is required!"}),
  image: z.string({message: "Image field is required!"}).max(255, {message: "Image value contain most 255 character!"}).or(z.null()).optional()
});

export const updatePrivateChatMessageSchema = z.object({
  content: z.string({message: "Message content is required!"}),
});

