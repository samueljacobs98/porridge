import { FeatureBoundary } from "@frontend/ui/components/feature-boundary";
import { Content } from "./content";
import { ErrorFallback } from "./error-fallback";
import { LoadingFallback } from "./loading-fallback";

export function SessionsList() {
  return (
    <FeatureBoundary
      loadingFallback={<LoadingFallback />}
      errorFallback={<ErrorFallback />}
    >
      <Content />
    </FeatureBoundary>
  );
}
