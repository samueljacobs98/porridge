"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSessionId } from "@/lib/state/providers/session-provider";
import { Document } from "./lib/document";
import { EmptySessionContentPlaceholder } from "./lib/extensions/empty-session-content-placeholder";
import { ScopedSelectAll } from "./lib/extensions/scoped-select-all";
import { CreatedAtDate } from "./lib/nodes/created-at-date";
import { SessionParagraph } from "./lib/nodes/session-paragraph";
import { SessionTitle } from "./lib/nodes/session-title";
import { useSessionContent } from "./lib/state/hooks/use-session-content";
import { moveSelectionToEnd } from "./lib/utils/move-selection-to-end";
import { LoadingFallback } from "./loading-fallback";

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
      EmptySessionContentPlaceholder,
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
      className="[&_.tiptap]:outline-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-semibold [&_.tiptap_h1.is-empty-session-title]:before:pointer-events-none [&_.tiptap_h1.is-empty-session-title]:before:float-left [&_.tiptap_h1.is-empty-session-title]:before:h-0 [&_.tiptap_h1.is-empty-session-title]:before:text-muted-foreground [&_.tiptap_h1.is-empty-session-title]:before:content-[attr(data-placeholder)] [&_.tiptap_p.is-empty-session-content]:before:pointer-events-none [&_.tiptap_p.is-empty-session-content]:before:float-left [&_.tiptap_p.is-empty-session-content]:before:h-0 [&_.tiptap_p.is-empty-session-content]:before:text-muted-foreground [&_.tiptap_p.is-empty-session-content]:before:content-[attr(data-placeholder)]"
    />
  );
}
