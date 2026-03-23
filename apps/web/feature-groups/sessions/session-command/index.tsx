import { FeatureBoundary } from "@frontend/ui/components/feature-boundary";
import { ErrorFallback } from "../session-editor/error-fallback";
import { LoadingFallback } from "../session-editor/loading-fallback";
import { Content } from "./content";

export function SessionCommand() {
  return (
    <FeatureBoundary
      loadingFallback={<LoadingFallback />}
      errorFallback={<ErrorFallback />}
    >
      <Content />
    </FeatureBoundary>
  );
}
