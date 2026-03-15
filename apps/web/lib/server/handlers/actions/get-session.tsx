import type { Session } from "@/lib/types";

export async function getSession(sessionId: string): Promise<Session | null> {
  const createdAt = new Date("2026-03-14T09:23:11Z").toISOString();

  return {
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
  };
}
