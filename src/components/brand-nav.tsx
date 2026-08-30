"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { brandLetter } from "@/lib/category-nav";
import {
  storeCategoryPath,
  storeHome,
  type StoreSlug,
} from "@/lib/shops";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

export function BrandNav({
  store,
  categories,
}: {
  store: StoreSlug;
  categories: Category[];
  activeId?: string;
}) {
  const pathname = usePathname();
  const activeId = pathname.match(/\/c\/([^/?]+)/)?.[1];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? categories.filter((category) =>
          category.name.toLowerCase().includes(q),
        )
      : categories;

    const map = new Map<string, Category[]>();
    for (const category of filtered) {
      const letter = brandLetter(category.name);
      const list = map.get(letter) ?? [];
      list.push(category);
      map.set(letter, list);
    }
    return [...map.entries()].sort(([a], [b]) =>
      a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b),
    );
  }, [categories, query]);

  const active = categories.find((category) => category.id === activeId);

  return (
    <div className="flex items-center gap-1">
      <Link
        href={storeHome(store)}
        className={cn(
          "rounded-full px-3 py-1.5 text-sm",
          !activeId && !pathname.includes("/search")
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </Link>

      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
            activeId
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground",
          )}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((value) => !value)}
        >
          {active?.name || "Brands"}
          <ChevronDown className="size-3.5" />
        </button>

        {open ? (
          <div className="absolute top-full left-0 z-50 w-[min(calc(100vw-2rem),42rem)] pt-1">
            <div className="rounded-xl border bg-background p-3 shadow-lg">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a brand"
                className="h-9 bg-card pl-8 text-sm"
              />
            </div>
            <div className="max-h-[min(70vh,32rem)] overflow-y-auto pr-1">
              {groups.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  No brands match that name.
                </p>
              ) : (
                groups.map(([letter, brands]) => (
                  <div key={letter} className="mb-3">
                    <p className="sticky top-0 bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                      {letter}
                    </p>
                    <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-3">
                      {brands.map((category) => (
                        <Link
                          key={category.id}
                          href={storeCategoryPath(store, category.id)}
                          className={cn(
                            "rounded-lg px-2 py-1.5 text-sm hover:bg-muted",
                            activeId === category.id
                              ? "bg-muted font-medium text-foreground"
                              : "text-foreground/90",
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
