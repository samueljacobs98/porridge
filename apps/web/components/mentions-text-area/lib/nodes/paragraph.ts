import { mergeAttributes, Node } from "@tiptap/core";

export const Paragraph = Node.create({
  name: "paragraph",
  priority: 1_000,
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "p" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(HTMLAttributes), 0];
  },
});
