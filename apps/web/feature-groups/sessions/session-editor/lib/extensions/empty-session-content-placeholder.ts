import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { DecorationSet } from "@tiptap/pm/view";
import { getEmptyContentPlaceholderDecoration } from "../utils/get-empty-content-placeholder-decoration";
import { getEmptyTitlePlaceholderDecoration } from "../utils/get-empty-title-placeholder-decoration";

export const EmptySessionContentPlaceholder = Extension.create({
  name: "emptySessionContentPlaceholder",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const placeholderDecorations = [
              getEmptyTitlePlaceholderDecoration(state.doc),
              getEmptyContentPlaceholderDecoration(state.doc),
            ].filter((decoration) => decoration !== null);

            return placeholderDecorations.length > 0
              ? DecorationSet.create(state.doc, placeholderDecorations)
              : null;
          },
        },
      }),
    ];
  },
});
