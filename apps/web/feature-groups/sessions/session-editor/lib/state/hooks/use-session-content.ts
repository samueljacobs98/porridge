import { useMemo } from "react";
import {
  type EditorContent,
  editorContentSchema,
} from "@/lib/schemas/editor-content-schema";
import type { Session, SessionBlockNode } from "@/lib/types";

export function useSessionContent(session: Session): EditorContent {
  return useMemo(() => {
    const [titleNode, createdAtDateNode, ...blockNodes] =
      session.content.content;
    const normalizedBlockNodes: SessionBlockNode[] =
      blockNodes.length > 0 ? blockNodes : [{ type: "paragraph" }];

    return editorContentSchema.parse({
      type: "doc",
      content: [
        {
          type: "sessionTitle",
          content:
            titleNode.content && titleNode.content.length > 0
              ? titleNode.content
              : [{ type: "text", text: "" }],
        },
        {
          ...createdAtDateNode,
          attrs: {
            ...createdAtDateNode.attrs,
            date:
              typeof createdAtDateNode.attrs.date === "string"
                ? createdAtDateNode.attrs.date
                : session.createdAt,
          },
        },
        ...normalizedBlockNodes,
      ],
    });
  }, [session.content, session.createdAt]);
}
