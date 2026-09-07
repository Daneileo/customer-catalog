import Link from "next/link";
import {
  STORE_LIST,
  catalogHome,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";
import { cn } from "@/lib/utils";

export function CatalogTabs({
  store,
  mode = "storefront",
}: {
  store?: StoreSlug | null;
  mode?: CatalogMode;
}) {
  const intro = !store;

  return (
    <nav
      className="-mx-1 flex flex-wrap items-center gap-1 px-1 pb-1"
      aria-label="Catalogs"
    >
      <Link
        href="/"
        className={cn(
          "rounded-full px-3 py-1.5 text-sm",
          intro
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
      >
        Home
      </Link>
      {STORE_LIST.map((entry) => {
        const active = store === entry.slug;
        return (
          <Link
            key={entry.slug}
            href={catalogHome(entry.slug, mode)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              active
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {entry.name}
          </Link>
        );
      })}
    </nav>
  );
}
