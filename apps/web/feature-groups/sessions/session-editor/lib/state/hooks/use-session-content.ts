import { useMemo } from "react";
import { editorContentSchema } from "@/lib/schemas/editor-content-schema";
import type { EditorContent, SessionDTO } from "@/lib/types";

export function useSessionContent(session: SessionDTO): EditorContent {
  return useMemo(() => {
    return editorContentSchema.parse({
      type: "doc",
      content: [
        {
          type: "sessionTitle",
          content: [{ type: "text", text: session.name }],
        },
        {
          type: "createdAtDate",
          attrs: { date: session.createdAt },
        },
        ...session.content.content,
      ],
    });
  }, [session]);
}
