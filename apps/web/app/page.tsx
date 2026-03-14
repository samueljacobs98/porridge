import { SessionsList } from "@/feature-groups/sessions/sessions-list";

export default function Page() {
  return (
    <div className="flex max-h-svh min-h-svh w-full overflow-y-hidden p-6 pb-0">
      <main className="mx-auto flex size-full max-w-xl flex-col overflow-hidden">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2 pt-8">
          <SessionsList />
          <div className="h-6" />
        </section>
      </main>
    </div>
  );
}
