"use client";
import { createContext, type ReactNode, use } from "react";
import type { Session } from "@/lib/types";

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionId() {
  const session = use(SessionContext);
  if (!session) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return session;
}
