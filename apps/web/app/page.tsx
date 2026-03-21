import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SessionCreate } from "@/feature-groups/sessions/session-create";
import { SessionsList } from "@/feature-groups/sessions/sessions-list";
import { sessionsQueries } from "@/lib/state/queries";
import { getQueryClient } from "@/lib/utils/get-query-client";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(sessionsQueries.metadata());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative flex max-h-svh min-h-svh w-full overflow-y-hidden p-6 pb-0">
        <span className="absolute top-2 right-2">
          <SessionCreate />
        </span>
        <main className="mx-auto flex size-full max-w-xl flex-col overflow-hidden">
          <header className="px-6">
            <h1 className="text-2xl font-semibold">Sessions</h1>
          </header>
          <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-2">
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-[calc(var(--spacing)*4.2)] left-0 z-10 h-8 bg-linear-to-b from-background via-background/95 to-transparent"
            />
            <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2.5">
              <div className="h-8" />
              <SessionsList />
              <div className="h-6 shrink-0" />
            </div>
          </section>
        </main>
      </div>
    </HydrationBoundary>
  );
}
