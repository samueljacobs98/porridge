import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CreatedAtDateView } from "../../components/created-at-date-view";

export const CreatedAtDate = Node.create({
  name: "createdAtDate",
  group: "createdAtDate",
  atom: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      date: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-created-at="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-created-at": "true" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CreatedAtDateView);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        filterTransaction: (transaction) => {
          if (!transaction.docChanged) return true;

          let hasNode = false;
          transaction.doc.descendants((node) => {
            if (node.type.name === "createdAtDate") {
              hasNode = true;
              return false;
            }
            return !hasNode;
          });

          return hasNode;
        },
      }),
    ];
  },
});
