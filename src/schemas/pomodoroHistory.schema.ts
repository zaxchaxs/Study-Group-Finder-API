import { z } from "zod";

export const PomodoroHistorySchema = z.object({
  userId: z.number({ message: "User ID is required" }),
  duration: z.number({ message: "Duration is required" }),
  session: z.number({ message: "Session is required" }),
});
