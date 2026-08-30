import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CatalogError({
  title = "Could not load this catalog",
  message = "The product feed is temporarily unavailable. Try again in a moment.",
  href,
}: {
  title?: string;
  message?: string;
  href?: string;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-card px-6 py-12 text-center">
      <h1 className="font-heading text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {href ? (
        <Button nativeButton={false} className="mt-6" render={<Link href={href} />}>
          Back to catalog
        </Button>
      ) : null}
    </div>
  );
}
