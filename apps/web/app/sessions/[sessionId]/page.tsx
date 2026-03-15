import { SessionCommand } from "@/feature-groups/sessions/session-command";
import { SessionEditor } from "@/feature-groups/sessions/session-editor";
import { SessionTabToggle } from "@/feature-groups/sessions/session-tab-toggle";

export default function Page() {
  return (
    <div className="relative max-h-svh min-h-svh w-full overflow-y-hidden">
      <SessionTabToggle className="absolute top-2 right-2" />
      <main className="mx-auto flex size-full max-w-xl flex-col p-6">
        <div className="flex-1">
          <SessionEditor />
        </div>
        <SessionCommand />
      </main>
    </div>
  );
}
