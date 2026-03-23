"use client";
import { createContext, type ReactNode, use } from "react";

const SessionIdContext = createContext<string | null>(null);

export function SessionIdProvider({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  return (
    <SessionIdContext.Provider value={sessionId}>
      {children}
    </SessionIdContext.Provider>
  );
}

export function useSessionId() {
  const sessionId = use(SessionIdContext);
  if (!sessionId) {
    throw new Error("useSessionId must be used within a SessionIdProvider");
  }
  return sessionId;
}
