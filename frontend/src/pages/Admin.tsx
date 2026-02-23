export default function Admin() {
  return (
    <main className="min-h-screen bg-primary-50 px-6 py-12 text-zinc-900 dark:bg-dark-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/80 p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Admin components load as a separate route chunk.
        </p>
      </div>
    </main>
  );
}
