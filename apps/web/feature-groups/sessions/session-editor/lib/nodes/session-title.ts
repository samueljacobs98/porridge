import { mergeAttributes, Node } from "@tiptap/core";

export const SessionTitle = Node.create({
  name: "sessionTitle",
  group: "sessionTitle",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: 'h1[data-session-title="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "h1",
      mergeAttributes(HTMLAttributes, { "data-session-title": "true" }),
      0,
    ];
  },
});
