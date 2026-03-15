import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { DecorationSet } from "@tiptap/pm/view";
import { getEmptyPlaceholderDecoration } from "../utils/get-empty-placeholder-decoration";

export const MentionsPlaceholder = Extension.create<{
  placeholder?: string;
}>({
  name: "mentionsPlaceholder",

  addOptions() {
    return {
      placeholder: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const placeholderDecoration = getEmptyPlaceholderDecoration(
              state.doc,
              this.options.placeholder
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
