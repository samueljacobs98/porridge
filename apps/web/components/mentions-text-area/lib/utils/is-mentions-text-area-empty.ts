import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

export function isMentionsTextAreaEmpty(doc: ProseMirrorNode) {
  if (doc.childCount !== 1) {
    return false;
  }

  const paragraph = doc.firstChild;

  return paragraph?.type.name === "paragraph" && paragraph.content.size === 0;
}
