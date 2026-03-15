import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/server/handlers/actions/get-session";
import { SessionProvider } from "@/lib/state/providers";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ sessionId: string }>;
  children: ReactNode;
}) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
