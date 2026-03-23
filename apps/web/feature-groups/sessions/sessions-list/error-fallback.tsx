"use client";

import { Button } from "@frontend/ui/components/button";
import { useErrorBoundary } from "react-error-boundary";

export function ErrorFallback() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div className="flex flex-col gap-0.5 p-2">
      <div className="flex w-fit flex-col items-center justify-center gap-2 rounded-md border bg-muted/50 px-6 py-4">
        <p className="text-sm">
          An error occurred while loading the session. Try again later.
        </p>
        <Button onClick={() => resetBoundary()} className="mx-auto w-fit">
          Retry
        </Button>
      </div>
    </div>
  );
}
