import { Button } from "@frontend/ui/components/button";
import { IconChevronUp, IconMicrophone } from "@tabler/icons-react";
import { MentionsTextArea } from "@/components/mentions-text-area";
import { MENTIONS_PLACEHOLDER } from "./lib/constants";

export function ErrorFallback() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="aspect-square rounded-full py-6"
        disabled
      >
        <span className="flex items-center">
          <IconMicrophone color="gray" />
          <IconChevronUp color="gray" />
        </span>
      </Button>
      <MentionsTextArea placeholder={MENTIONS_PLACEHOLDER} disabled readOnly />
    </div>
  );
}
