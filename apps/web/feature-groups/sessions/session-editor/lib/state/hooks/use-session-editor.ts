import { useRef } from "react";
import { useEditor } from "@tiptap/react";
import { Document } from "../../document";
import StarterKit from "@tiptap/starter-kit";
import type { SaveSessionBodyDTO, SessionDTO } from "@/lib/types";
import { EmptySessionContentPlaceholder } from "../../extensions/empty-session-content-placeholder";
import {
  SessionBulletList,
  SessionOrderedList,
} from "../../extensions/session-list-input-rules";
import { ScopedSelectAll } from "../../extensions/scoped-select-all";
import { CreatedAtDate } from "../../nodes/created-at-date";
import { SessionParagraph } from "../../nodes/session-paragraph";
import { SessionTitle } from "../../nodes/session-title";
import { moveSelectionToEnd } from "../../utils/move-selection-to-end";
import { useSessionAutosave } from "./use-session-autosave";
import { useSessionContent } from "./use-session-content";

export function useSessionEditor(
  session: SessionDTO,
  {
    onSave,
  }: Partial<{
    onSave: (
      payload: SaveSessionBodyDTO,
      previousSession: SessionDTO
    ) => Promise<void>;
  }> = {}
) {
  const content = useSessionContent(session);
  const latestRawContentRef = useRef<unknown>(content);

  const autosave = useSessionAutosave({
    sessionId: session.id,
    getLatestRawContent: () => {
      return latestRawContentRef.current ?? null;
    },
    remoteSave: async (payload) => {
      await onSave?.(payload, session);
    },
  });

  return useEditor({
    extensions: [
      Document,
      StarterKit.configure({
        document: false,
        heading: false,
        paragraph: false,
        bulletList: false,
        orderedList: false,
      }),
      SessionParagraph,
      SessionBulletList,
      SessionOrderedList,
      SessionTitle,
      CreatedAtDate,
      EmptySessionContentPlaceholder,
      ScopedSelectAll,
    ],
    content,
    onUpdate: ({ editor: nextEditor }) => {
      latestRawContentRef.current = nextEditor.getJSON();
      autosave.onEdit();
    },
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
        blur() {
          autosave.onBlur();
          return false;
        },
      },
    },
  });
}
