import type { JSONContent } from "@tiptap/core";
import { normalizeMentionsTextAreaValue } from "./normalize-mentions-text-area-value";

export function getMentionsTextAreaContent(value?: string): JSONContent {
  const normalizedValue = normalizeMentionsTextAreaValue(value);

  if (!normalizedValue) {
    return {
      type: "doc",
      content: [{ type: "paragraph" }],
    };
  }

  const parts = normalizedValue.split("\n");
  const inlineContent: JSONContent[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      inlineContent.push({ type: "text", text: parts[i] });
    }
    if (i < parts.length - 1) {
      inlineContent.push({ type: "hardBreak" });
    }
  }

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: inlineContent.length > 0 ? inlineContent : undefined,
      },
    ],
  };
}
