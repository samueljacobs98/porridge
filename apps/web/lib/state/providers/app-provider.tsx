import type { ReactNode } from "react";
import { SidebarProvider } from "@frontend/ui/components/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider>
      <NuqsAdapter>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
