import type { Session } from "@/lib/types";

export function buildInitialContent(session: Session) {
  return {
    type: "doc" as const,
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: session.name }],
      },
      {
        type: "createdAtDate",
        attrs: { date: session.createdAt },
      },
      ...(session.content.content.slice(2).length > 0
        ? session.content.content.slice(2)
        : [{ type: "paragraph" }]),
    ],
  };
}
