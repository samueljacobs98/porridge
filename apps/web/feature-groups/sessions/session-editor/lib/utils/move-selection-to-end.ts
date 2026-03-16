import { TextSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";

export function moveSelectionToEnd(view: EditorView) {
  view.dispatch(
    view.state.tr.setSelection(TextSelection.atEnd(view.state.doc))
  );
}
