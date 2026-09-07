"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BrandError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const params = useParams<{ store?: string }>();
  const href = params.store ? `/${params.store}` : "/";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-card px-6 py-12 text-center">
      <h1 className="font-heading text-xl font-semibold">
        This brand could not load
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Try again, or pick another brand from the catalog.
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
          href={href}
          className="inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium"
        >
          Back to catalog
        </Link>
      </div>
    </div>
  );
}
