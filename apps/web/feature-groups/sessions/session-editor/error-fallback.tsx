"use client";

import { Button } from "@frontend/ui/components/button";
import { useErrorBoundary } from "react-error-boundary";

export function ErrorFallback() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="text-2xl font-semibold">Failed to Load Session</h1>
      <p className="text-sm">
        An error occurred while loading the session. Try again later.
      </p>
      <Button onClick={() => resetBoundary()} className="mt-4 w-fit">
        Retry
      </Button>
    </div>
  );
}
