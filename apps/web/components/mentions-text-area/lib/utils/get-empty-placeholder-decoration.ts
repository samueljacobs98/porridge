import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Decoration } from "@tiptap/pm/view";
import { isMentionsTextAreaEmpty } from "./is-mentions-text-area-empty";

export function getEmptyPlaceholderDecoration(
  doc: ProseMirrorNode,
  placeholder?: string
) {
  if (!placeholder || !isMentionsTextAreaEmpty(doc)) {
    return null;
  }

  const paragraph = doc.firstChild;

  if (!paragraph) {
    return null;
  }

  return Decoration.node(0, paragraph.nodeSize, {
    class: "is-empty-mentions-text-area",
    "data-placeholder": placeholder,
  });
}
