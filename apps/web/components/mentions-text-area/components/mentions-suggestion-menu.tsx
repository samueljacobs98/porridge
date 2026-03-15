"use client";

import { Button } from "@frontend/ui/components/button";
import type { MentionSuggestionItem } from "../lib/types";

type MentionsSuggestionMenuProps = {
  items: MentionSuggestionItem[];
  onSelect: (item: MentionSuggestionItem) => void;
  selectedIndex: number;
};

export function MentionsSuggestionMenu({
  items,
  onSelect,
  selectedIndex,
}: MentionsSuggestionMenuProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;

        return (
          <Button
            key={`${item.trigger}-${item.option.value}`}
            type="button"
            variant={isSelected ? "secondary" : "ghost"}
            className="flex w-full justify-between text-xs"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(item)}
          >
            <span className="truncate">{item.option.label}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {item.trigger}
              {item.option.value}
            </span>
          </Button>
        );
      })}
    </>
  );
}
