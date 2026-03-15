import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { DatetimeFormat, formatDatetime } from "@repo/datetimes";

export function CreatedAtDateView({ node }: ReactNodeViewProps) {
  const formatted = formatDatetime(
    node.attrs.date as string,
    DatetimeFormat.Date
  );

  return (
    <NodeViewWrapper as="p" className="text-sm text-muted-foreground">
      {formatted}
    </NodeViewWrapper>
  );
}
