import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-bg text-white p-8">
      <h1 className="text-6xl font-black">404</h1>
      <p className="text-xl text-brand-neon mt-2">Page not found</p>
      <p className="mt-4 max-w-md text-center text-brand-muted">
        The route you’re looking for does not exist or has moved. Let’s get back to the DevVibe shop.
      </p>
      <Link href="/" className="mt-6 rounded-lg bg-brand-neon px-6 py-3 text-sm font-bold text-brand-bg hover:bg-[#4ddbb6] transition-colors">
        Return to Home
      </Link>
    </main>
  );
}
