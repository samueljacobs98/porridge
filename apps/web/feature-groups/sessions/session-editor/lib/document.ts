import TiptapDocument from "@tiptap/extension-document";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";

export const Document = TiptapDocument.extend({
  content:
    "sessionTitle createdAtDate (paragraph|bulletList|orderedList|blockquote|codeBlock)+",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        filterTransaction: (transaction) => {
          if (!transaction.docChanged) {
            return true;
          }

          return hasProtectedSessionStructure(transaction.doc);
        },
      }),
    ];
  },
});

function hasProtectedSessionStructure(doc: ProseMirrorNode) {
  if (doc.childCount < 3) {
    return false;
  }

  const title = doc.child(0);
  const createdAtDate = doc.child(1);

  return (
    title.type.name === "sessionTitle" &&
    createdAtDate.type.name === "createdAtDate" &&
    typeof createdAtDate.attrs.date === "string"
  );
}
