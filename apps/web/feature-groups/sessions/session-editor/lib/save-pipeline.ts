import type {
  EditorContent,
  SessionContent,
} from "@/lib/schemas/editor-content-schema";
import { editorContentSchema } from "@/lib/schemas/editor-content-schema";

export function buildSubmittedContent(rawContent: unknown): SessionContent {
  const editorContent = editorContentSchema.parse(rawContent);
  const [title, createdAtDate, ...body] = editorContent.content;

  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: title.content,
      },
      createdAtDate,
      ...body,
    ],
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

export function safeBuildSubmittedContent(
  rawContent: unknown
): SessionContent | null {
  const editorContent = safeParseEditorContent(rawContent);
  if (!editorContent) return null;

  const [title, createdAtDate, ...body] = editorContent.content;
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: title.content,
      },
      createdAtDate,
      ...body,
    ],
  };
}

export type SaveResult = {
  didSave: boolean;
  savedAt: number | null;
  error: unknown | null;
};
