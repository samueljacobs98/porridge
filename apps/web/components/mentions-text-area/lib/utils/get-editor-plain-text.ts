import type { Editor } from "@tiptap/react";

export function getEditorPlainText(editor: Editor) {
  return editor.getText({ blockSeparator: "" });
}
