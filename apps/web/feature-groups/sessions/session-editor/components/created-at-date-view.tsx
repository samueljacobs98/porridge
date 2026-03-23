import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { DatetimeFormat } from "@repo/datetimes";
import { ClientLocalFormattedDatetime } from "@/components/client-local-formatted-datetime";

export function CreatedAtDateView({ node }: ReactNodeViewProps) {
  const iso = typeof node.attrs.date === "string" ? node.attrs.date : null;

  return (
    <NodeViewWrapper as="p" className="text-sm text-muted-foreground">
      {iso ? (
        <ClientLocalFormattedDatetime format={DatetimeFormat.Date}>
          {iso}
        </ClientLocalFormattedDatetime>
      ) : null}
    </NodeViewWrapper>
  );
}
