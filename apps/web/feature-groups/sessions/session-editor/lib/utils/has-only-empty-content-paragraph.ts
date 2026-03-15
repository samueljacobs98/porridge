import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

export function hasOnlyEmptyContentParagraph(doc: ProseMirrorNode) {
  if (doc.childCount !== 3) {
    return false;
  }

  const contentNode = doc.child(2);

  return (
    contentNode.type.name === "paragraph" && contentNode.content.size === 0
  );
}
