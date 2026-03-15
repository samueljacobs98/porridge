import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { DecorationSet } from "@tiptap/pm/view";
import { getEmptyContentPlaceholderDecoration } from "../utils/get-empty-content-placeholder-decoration";

export const EmptySessionContentPlaceholder = Extension.create({
  name: "emptySessionContentPlaceholder",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const placeholderDecoration = getEmptyContentPlaceholderDecoration(
              state.doc
            );

            return placeholderDecoration
              ? DecorationSet.create(state.doc, [placeholderDecoration])
              : null;
          },
        },
      }),
    ];
  },
});
