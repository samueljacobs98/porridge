import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { DatetimeFormat, formatDatetime } from "@repo/datetimes";

export function CreatedAtDateView({ node }: ReactNodeViewProps) {
  const formatted =
    typeof node.attrs.date === "string"
      ? formatDatetime(node.attrs.date, DatetimeFormat.Date)
      : null;

  return (
    <NodeViewWrapper as="p" className="text-sm text-muted-foreground">
      {formatted}
    </NodeViewWrapper>
  );
}
