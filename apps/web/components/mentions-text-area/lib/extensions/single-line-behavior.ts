import { Extension } from "@tiptap/core";

export const SingleLineBehavior = Extension.create({
  name: "singleLineBehavior",

  addKeyboardShortcuts() {
    return {
      Enter: () => true,
    };
  },
});
