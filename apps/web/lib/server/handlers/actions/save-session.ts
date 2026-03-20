"use server";
import { ok, type Result } from "@repo/result";
import { action } from "@/lib/utils/action";
import { saveSessionSchema } from "../../schemas/save-session-schema";

export const saveSession = action(
  saveSessionSchema,
  async (data): Promise<Result<undefined, never>> => {
    console.log(`Saving session ${data.id} content:`, data);
    return ok(undefined);
  }
);
