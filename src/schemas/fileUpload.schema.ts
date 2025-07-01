import { z } from "zod";

export const uploadImageSchema = z.object({
    path: z.string({message: "Path to store image is required!"}),
    image: z.any({message: "Image file is required!"})
})