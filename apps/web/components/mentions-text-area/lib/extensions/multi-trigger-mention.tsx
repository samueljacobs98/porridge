import type { ComponentProps } from "react";
import { Popover, PopoverContent } from "@frontend/ui/components/popover";
import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { exitSuggestion } from "@tiptap/suggestion";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { MentionsSuggestionMenu } from "../../components/mentions-suggestion-menu";
import type {
  MentionOption,
  MentionsMap,
  SuggestionController,
} from "../types";
import { getMentionInsertedText } from "../utils/get-mention-inserted-text";
import { getSuggestionItems } from "../utils/get-suggestion-items";

type MultiTriggerMentionOptions = {
  controllerRef: { current: SuggestionController | null };
  mentions: MentionsMap;
  onMentionSelect?: (trigger: string, option: MentionOption) => void;
};

type SuggestionRenderProps = {
  command: (item: ReturnType<typeof getSuggestionItems>[number]) => void;
  editor: {
    view: {
      dom: HTMLElement;
    };
  };
  items: ReturnType<typeof getSuggestionItems>;
};

export const MultiTriggerMention = Extension.create<MultiTriggerMentionOptions>(
  {
    name: "multiTriggerMention",

    addOptions() {
      return {
        controllerRef: { current: null },
        mentions: {},
        onMentionSelect: undefined,
      };
    },

    addProseMirrorPlugins() {
      return Object.entries(this.options.mentions).map(([trigger, config]) => {
        const controllerRef = this.options.controllerRef;
        const pluginKey = new PluginKey(`mentionsSuggestion-${trigger}`);

        return Suggestion({
          char: trigger,
          editor: this.editor,
          pluginKey,
          items: ({ query }) =>
            getSuggestionItems({
              insertAction: config.insertAction,
              options: config.options,
              query,
              trigger,
            }),
          command: ({ editor, range, props }) => {
            const insertedText = getMentionInsertedText({
              insertAction: props.insertAction,
              label: props.option.label,
              textAfterSelection: editor.state.doc.textBetween(
                range.to,
                editor.state.doc.content.size,
                "",
                ""
              ),
              textBeforeSelection: editor.state.doc.textBetween(
                0,
                range.from,
                "",
                ""
              ),
            });

            editor.commands.setContent({
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  ...(insertedText
                    ? {
                        content: [{ type: "text", text: insertedText }],
                      }
                    : {}),
                },
              ],
            });
            editor.commands.focus("end");
            this.options.onMentionSelect?.(trigger, props.option);
          },
          render: () => {
            let container: HTMLDivElement | null = null;
            let latestProps: SuggestionRenderProps | null = null;
            let root: Root | null = null;
            let selectedIndex = 0;

            const handleSuggestionKeyDown = (event: {
              defaultPrevented?: boolean;
              key: string;
              preventDefault: () => void;
            }) => {
              if (!latestProps) {
                return false;
              }

              if (event.defaultPrevented) {
                return true;
              }

              if (event.key === "Escape") {
                event.preventDefault();
                exitSuggestion(this.editor.view, pluginKey);
                return true;
              }

              if (latestProps.items.length === 0) {
                return false;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                selectedIndex =
                  (selectedIndex + latestProps.items.length - 1) %
                  latestProps.items.length;
                renderMenu();
                return true;
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                selectedIndex = (selectedIndex + 1) % latestProps.items.length;
                renderMenu();
                return true;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                return selectItem(selectedIndex);
              }

              return false;
            };

            const selectItem = (index: number) => {
              const item = latestProps?.items[index];

              if (!item) {
                return false;
              }

              latestProps?.command(item);
              return true;
            };

            const updateController = () => {
              controllerRef.current = latestProps
                ? {
                    handleKeyDown: handleSuggestionKeyDown,
                  }
                : null;
            };

            const renderMenu = () => {
              if (!container || !root || !latestProps) {
                return;
              }

              const anchorElement =
                latestProps.editor.view.dom.closest(
                  "[data-mentions-text-area-anchor]"
                ) ?? latestProps.editor.view.dom;

              const anchor = {
                contextElement: latestProps.editor.view.dom,
                getBoundingClientRect: () =>
                  anchorElement.getBoundingClientRect(),
              } satisfies NonNullable<
                ComponentProps<typeof PopoverContent>["anchor"]
              >;

              root.render(
                <Popover modal={false} open={latestProps.items.length > 0}>
                  <PopoverContent
                    align="start"
                    anchor={anchor}
                    className="max-h-64 w-[calc(var(--container-xl)-(var(--spacing))*6*2)] gap-0 overflow-y-auto p-0.5"
                    initialFocus={false}
                    finalFocus={false}
                    positionMethod="fixed"
                    side="top"
                    sideOffset={24}
                    alignOffset={-80}
                  >
                    <MentionsSuggestionMenu
                      items={latestProps.items}
                      onSelect={(item) => {
                        const nextIndex = latestProps?.items.findIndex(
                          (candidate) =>
                            candidate.trigger === item.trigger &&
                            candidate.option.value === item.option.value
                        );

                        if (typeof nextIndex === "number" && nextIndex >= 0) {
                          selectedIndex = nextIndex;
                        }

                        selectItem(selectedIndex);
                      }}
                      selectedIndex={selectedIndex}
                    />
                  </PopoverContent>
                </Popover>
              );
            };

            return {
              onStart: (props) => {
                latestProps = props as SuggestionRenderProps;
                props.editor.view.dom.dataset.mentionsSuggestionOpen = "true";
                selectedIndex = 0;
                container = document.createElement("div");
                root = createRoot(container);
                props.editor.view.dom.ownerDocument.body.appendChild(container);
                updateController();
                renderMenu();
              },

              onUpdate: (props) => {
                latestProps = props as SuggestionRenderProps;
                props.editor.view.dom.dataset.mentionsSuggestionOpen = "true";
                selectedIndex = Math.min(
                  selectedIndex,
                  Math.max(props.items.length - 1, 0)
                );
                updateController();
                renderMenu();
              },

              onKeyDown: (props) => handleSuggestionKeyDown(props.event),

              onExit: () => {
                this.editor.view.dom.dataset.mentionsSuggestionOpen = "false";
                controllerRef.current = null;
                latestProps = null;
                root?.unmount();
                container?.remove();
                root = null;
                container = null;
              },
            };
          },
        });
      });
    },
  }
);
