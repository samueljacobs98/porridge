import z from "zod";
import { sessionContentSchema } from "@/lib/schemas";

export const saveSessionSchema = z.object({
  id: z.string(),
  content: sessionContentSchema,
});
