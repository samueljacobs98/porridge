import { editorContentSchema } from "@/lib/schemas/editor-content-schema";
import type { BodyNode, EditorContent, SaveSessionBodyDTO } from "@/lib/types";

function sessionTitleToName(title: EditorContent["content"][0]): string {
  return title.content.map((n) => n.text).join("");
}

function normalizeBodyBlocks(nodes: BodyNode[]): [BodyNode, ...BodyNode[]] {
  if (nodes.length > 0) {
    return [nodes[0]!, ...nodes.slice(1)];
  }
  return [{ type: "paragraph" }];
}

export function buildSavePayloadFromEditor(
  rawContent: unknown
): SaveSessionBodyDTO {
  const editorContent = editorContentSchema.parse(rawContent);
  const [title, , ...body] = editorContent.content;
  const name = sessionTitleToName(title);
  const bodyTuple = normalizeBodyBlocks(body);

  return {
    name,
    content: {
      type: "doc",
      content: bodyTuple,
    },
  };
}

export function parseEditorContent(rawContent: unknown): EditorContent {
  return editorContentSchema.parse(rawContent);
}

export function safeParseEditorContent(
  rawContent: unknown
): EditorContent | null {
  const parsed = editorContentSchema.safeParse(rawContent);
  return parsed.success ? parsed.data : null;
}

export function safeBuildSavePayloadFromEditor(
  rawContent: unknown
): SaveSessionBodyDTO | null {
  const editorContent = safeParseEditorContent(rawContent);
  if (!editorContent) return null;

  const [title, , ...body] = editorContent.content;
  const name = sessionTitleToName(title);
  const bodyTuple = normalizeBodyBlocks(body);

  return {
    name,
    content: {
      type: "doc",
      content: bodyTuple,
    },
  };
}

export type SaveResult = {
  didSave: boolean;
  savedAt: number | null;
  error: unknown | null;
};
