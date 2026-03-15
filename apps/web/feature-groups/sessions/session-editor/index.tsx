"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSessionId } from "@/lib/state/providers/session-provider";
import { Document } from "./lib/document";
import { ScopedSelectAll } from "./lib/extensions/scoped-select-all";
import { CreatedAtDate } from "./lib/nodes/created-at-date";
import { SessionTitle } from "./lib/nodes/session-title";
import { useSessionContent } from "./lib/state/hooks/use-session-content";
import { LoadingFallback } from "./loading-fallback";

const SessionParagraph = Node.create({
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

function moveSelectionToEnd(view: EditorView) {
  view.dispatch(
    view.state.tr.setSelection(TextSelection.atEnd(view.state.doc))
  );
}

export function SessionEditor() {
  const session = useSessionId();
  const content = useSessionContent(session);

  const editor = useEditor({
    extensions: [
      Document,
      StarterKit.configure({
        document: false,
        heading: false,
        paragraph: false,
      }),
      SessionParagraph,
      SessionTitle,
      CreatedAtDate,
      ScopedSelectAll,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      handleClick(view, _position, event) {
        if (event.target === view.dom) {
          moveSelectionToEnd(view);
          return true;
        }

        return false;
      },

      handleDOMEvents: {
        focus(view, event) {
          if (event.target === view.dom) {
            moveSelectionToEnd(view);
          }

          return false;
        },
      },
    },
  });

  if (!editor) {
    return <LoadingFallback />;
  }

  return (
    <EditorContent
      editor={editor}
      className="[&_.tiptap]:outline-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-semibold"
    />
  );
}
