"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <h1 className="font-heading text-xl font-semibold">
          This page could not load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again, or go back to the catalog home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="h-8 rounded-lg bg-foreground px-3 text-sm font-medium text-background"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
