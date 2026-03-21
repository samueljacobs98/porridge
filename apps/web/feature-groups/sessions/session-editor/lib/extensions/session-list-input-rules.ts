import { InputRule } from "@tiptap/core";
import { BulletList } from "@tiptap/extension-list/bullet-list";
import { OrderedList } from "@tiptap/extension-list/ordered-list";

/**
 * Default list input rules use `findWrapping` + `wrap`, which can fail for our
 * custom `doc` content spec. Using `deleteRange` + `toggleBulletList` /
 * `toggleOrderedList` matches the same UX while using the list commands’ path.
 */
export const SessionBulletList = BulletList.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^\s*([-+*])\s$/,
        handler: ({ range, chain }) => {
          chain()
            .focus()
            .deleteRange({ from: range.from, to: range.to })
            .toggleBulletList()
            .run();
        },
      }),
    ];
  },
});

export const SessionOrderedList = OrderedList.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^(\d+)\.\s$/,
        handler: ({ range, chain, match }) => {
          const start = Number(match[1]);
          const safeStart = Number.isFinite(start) && start > 0 ? start : 1;
          chain()
            .focus()
            .deleteRange({ from: range.from, to: range.to })
            .toggleOrderedList()
            .updateAttributes("orderedList", { start: safeStart })
            .run();
        },
      }),
    ];
  },
});
