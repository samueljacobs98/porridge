import { ok, type Result } from "@repo/result";
import { sessionContentSchema, type SessionContent } from "@/lib/schemas/editor-content-schema";
import { action } from "@/lib/utils/action";

export const validateSubmittedContent = action(
  sessionContentSchema,
  async (data): Promise<Result<SessionContent, never>> => {
    console.log("Validated session content:", data);
    return ok(data);
  }
);
