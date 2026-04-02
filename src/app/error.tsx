"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-bg text-white p-8">
      <h1 className="text-5xl font-black">Something went wrong</h1>
      <p className="mt-4 text-brand-muted max-w-lg text-center">{error?.message ?? "Unexpected application error"}</p>
      <div className="mt-6 flex gap-4">
        <button onClick={() => reset()} className="rounded-lg bg-brand-neon px-6 py-3 text-sm font-bold text-brand-bg hover:bg-[#4ddbb6] transition-colors">
          Try Again
        </button>
        <Link href="/" className="rounded-lg border border-brand-card px-6 py-3 text-sm font-bold text-brand-neon hover:bg-brand-paper transition-colors">
          Go Home
        </Link>
      </div>
    </main>
  );
}
