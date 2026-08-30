import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHref } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function visiblePages(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 3);
    pages.add(total - 2);
    pages.add(total - 1);
  }
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function PaginationBar({
  pathname,
  page,
  pageCount,
  query,
}: {
  pathname: string;
  page: number;
  pageCount: number;
  query?: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const pages = visiblePages(page, pageCount);

  return (
    <nav
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          disabled={page <= 1}
          render={
            page <= 1 ? undefined : (
              <Link href={pageHref(pathname, page - 1, query)} />
            )
          }
        >
          <ChevronLeft />
          Prev
        </Button>
        {pages.map((n, i) => {
          const prev = pages[i - 1];
          return (
            <span key={n} className="contents">
              {prev && n - prev > 1 ? (
                <span className="px-1 text-muted-foreground">…</span>
              ) : null}
              <Link
                href={pageHref(pathname, n, query)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-sm",
                  n === page
                    ? "bg-foreground text-background"
                    : "hover:bg-muted",
                )}
              >
                {n}
              </Link>
            </span>
          );
        })}
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          render={
            page >= pageCount ? undefined : (
              <Link href={pageHref(pathname, page + 1, query)} />
            )
          }
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
