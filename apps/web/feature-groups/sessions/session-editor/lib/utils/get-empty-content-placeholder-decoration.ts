import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Decoration } from "@tiptap/pm/view";
import { EMPTY_CONTENT_PLACEHOLDER } from "../constants";
import { hasOnlyEmptyContentParagraph } from "./has-only-empty-content-paragraph";

export function getEmptyContentPlaceholderDecoration(doc: ProseMirrorNode) {
  if (!hasOnlyEmptyContentParagraph(doc)) {
    return null;
  }

  const paragraph = doc.child(2);
  const paragraphPosition = doc.child(0).nodeSize + doc.child(1).nodeSize;

  return Decoration.node(
    paragraphPosition,
    paragraphPosition + paragraph.nodeSize,
    {
      class: "is-empty-session-content",
      "data-placeholder": EMPTY_CONTENT_PLACEHOLDER,
    }
  );
}
