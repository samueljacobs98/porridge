import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Decoration } from "@tiptap/pm/view";
import { EMPTY_TITLE_PLACEHOLDER } from "../constants";

export function getEmptyTitlePlaceholderDecoration(doc: ProseMirrorNode) {
  if (doc.childCount === 0) {
    return null;
  }

  const title = doc.child(0);

  if (title.type.name !== "sessionTitle" || title.content.size > 0) {
    return null;
  }

  return Decoration.node(0, title.nodeSize, {
    class: "is-empty-session-title",
    "data-placeholder": EMPTY_TITLE_PLACEHOLDER,
  });
}
