import { z } from "zod";

export const addUserRankSchema = z.object({
    userId: z.number({ message: "User ID is required" }),
    rankCatId: z.number({ message: "Rank Category ID is required"}),
    rankValue: z.number({message: "Rank Value is required!"})
});