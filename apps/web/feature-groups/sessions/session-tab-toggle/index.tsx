"use client";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@frontend/ui/components/toggle-group";
import { IconAlignLeft, IconSparkles } from "@tabler/icons-react";
import { useSessionTabParam } from "@/feature-groups/shared/lib/state/hooks/use-session-tab-param";

export function SessionTabToggle({ className }: { className?: string }) {
  const { tab, setTab } = useSessionTabParam();
  return (
    <ToggleGroup
      variant="outline"
      value={[tab]}
      onValueChange={(value) => setTab(value[0] as "raw" | "enhanced")}
      className={className}
    >
      <ToggleGroupItem value="raw" aria-label="Toggle raw">
        <IconAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="enhanced" aria-label="Toggle enhanced">
        <IconSparkles />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
