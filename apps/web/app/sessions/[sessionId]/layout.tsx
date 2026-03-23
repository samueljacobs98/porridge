import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SessionIdProvider } from "@/lib/state/providers";
import { sessionsQueries } from "@/lib/state/queries";
import { getQueryClient } from "@/lib/utils/get-query-client";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ sessionId: string }>;
  children: ReactNode;
}) {
  const { sessionId } = await params;
  const queryClient = getQueryClient();
  const session = await queryClient.fetchQuery(
    sessionsQueries.session(sessionId)
  );

  if (!session) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionIdProvider sessionId={sessionId}>{children}</SessionIdProvider>
    </HydrationBoundary>
  );
}
