import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

export const ScopedSelectAll = Extension.create({
  name: "scopedSelectAll",

  addKeyboardShortcuts() {
    return {
      "Mod-a": () => {
        const { doc, selection, tr } = this.editor.state;
        const topLevelIndex = selection.$from.index(0);

        if (doc.childCount < 3) {
          return false;
        }

        if (topLevelIndex === 0) {
          const headingSelection = TextSelection.between(
            doc.resolve(1),
            doc.resolve(doc.child(0).nodeSize - 1)
          );

          this.editor.view.dispatch(tr.setSelection(headingSelection));

          return true;
        }

        if (topLevelIndex < 2) {
          return false;
        }

        const bodyStart = doc.child(0).nodeSize + doc.child(1).nodeSize;
        const bodySelection = TextSelection.between(
          doc.resolve(bodyStart),
          doc.resolve(doc.content.size)
        );

        this.editor.view.dispatch(tr.setSelection(bodySelection));

        return true;
      },
    };
  },
});
