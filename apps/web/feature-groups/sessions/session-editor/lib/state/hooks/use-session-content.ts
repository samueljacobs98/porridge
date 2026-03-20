import { useMemo } from "react";
import { editorContentSchema } from "@/lib/schemas/editor-content-schema";
import type { BodyNode, EditorContent, SessionDTO } from "@/lib/types";

export function useSessionContent(session: SessionDTO): EditorContent {
  return useMemo(() => {
    const [titleNode, createdAtDateNode, ...blockNodes] =
      session.content.content;
    const normalizedBlockNodes: BodyNode[] =
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
