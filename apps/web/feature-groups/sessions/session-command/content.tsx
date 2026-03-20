import { Button } from "@frontend/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@frontend/ui/components/popover";
import { IconChevronUp, IconMicrophone } from "@tabler/icons-react";
import { MentionsTextArea } from "@/components/mentions-text-area";
import {
  MENTIONS_PLACEHOLDER,
  SESSION_COMMAND_MENTIONS,
} from "./lib/constants";
import { transcript } from "./placeholder-transcript";

export function Content() {
  return (
    <Popover>
      <form className="flex items-center gap-2">
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="aspect-square rounded-full py-6 focus-visible:ring-primary/30"
            />
          }
        >
          <span className="flex items-center">
            <IconMicrophone color="gray" />
            <IconChevronUp color="gray" />
          </span>
        </PopoverTrigger>
        <MentionsTextArea
          maxHeight="100px"
          placeholder={MENTIONS_PLACEHOLDER}
          mentions={SESSION_COMMAND_MENTIONS}
        />
      </form>
      <PopoverContent
        className="max-h-96 w-[calc(var(--container-xl)-(var(--spacing))*6*2)] gap-1 overflow-y-auto p-2 text-xs"
        align="start"
      >
        {transcript.split(".").map((line, index) => (
          <div
            key={index}
            className="w-fit rounded-sm bg-secondary p-1 leading-tight"
          >
            {line}.
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
