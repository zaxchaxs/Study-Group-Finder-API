import { z } from "zod";

export const addTodolistSchema = z.object({
    userId: z.number({ message: "User ID is required" }),
    title: z.string({ message: "Title is required" }).min(4).max(191, { message: "Title is too long" }),
    description: z.string({ message: "Description is required" }).min(4).max(191, { message: "Description is too long" }).optional(),
    status: z.enum(["completed", "progress", "uncompleted"]),
    priority: z.number({ message: "Priority is required" }),
    icon: z.string().optional(),
    deadline: z.string({ message: "Deadline todolist is required" }).max(191, { message: "Deadline timeline is too long" }),
});