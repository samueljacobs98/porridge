"use server";

import { ok, Result } from "@repo/result";
import type { Session } from "@/lib/types";
import { action } from "@/lib/utils/action";
import { getSessionSchema } from "../../schemas/get-session-schema";

export const getSession = action(
  getSessionSchema,
  async (sessionId): Promise<Result<Session, void>> => {
    const createdAt = new Date("2026-03-14T09:23:11Z").toISOString();

    return ok({
      id: sessionId,
      name: "Session 1",
      lecturer: "Lecturer 1",
      updatedAt: new Date("2026-03-14T14:47:32Z").toISOString(),
      createdAt,
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Session 1" }],
          },
          {
            type: "createdAtDate",
            attrs: { date: createdAt },
          },
          { type: "paragraph" },
        ],
      },
    });
  }
);
