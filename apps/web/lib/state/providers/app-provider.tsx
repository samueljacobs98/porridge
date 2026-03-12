import type { ReactNode } from "react";
import { SidebarProvider } from "@frontend/ui/components/sidebar";
import { QueryClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
