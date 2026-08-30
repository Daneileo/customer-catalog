"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
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
}) {
  const pathname = usePathname();
  const activeId = pathname.match(/\/c\/([^/?]+)/)?.[1];
  const [query, setQuery] = useState("");
  const [queryPath, setQueryPath] = useState(pathname);
  if (queryPath !== pathname) {
    setQueryPath(pathname);
    setQuery("");
  }
  const reactId = useId().replace(/:/g, "");
  const popoverId = `brand-dropdown-${store}-${reactId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;

    trigger.setAttribute("popovertarget", popoverId);
    trigger.setAttribute("popovertargetaction", "toggle");
    panel.setAttribute("popover", "auto");

    const place = () => {
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(window.innerWidth - 16, 36 * 16);
      const left = Math.min(
        Math.max(8, rect.left),
        Math.max(8, window.innerWidth - width - 8),
      );
      panel.style.top = `${rect.bottom + 8}px`;
      panel.style.left = `${left}px`;
      panel.style.width = `${width}px`;
    };

    const onBeforeToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState;
      if (next === "open") place();
    };

    panel.addEventListener("beforetoggle", onBeforeToggle);
    window.addEventListener("resize", place);
    return () => {
      panel.removeEventListener("beforetoggle", onBeforeToggle);
      window.removeEventListener("resize", place);
    };
  }, [popoverId]);

  useEffect(() => {
    panelRef.current?.hidePopover?.();
  }, [pathname]);

  return (
    <div className="brand-nav flex items-center gap-1">
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

      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "brand-dropdown-trigger inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
          activeId && "brand-dropdown-trigger-active",
        )}
        popoverTarget={popoverId}
        popoverTargetAction="toggle"
        aria-haspopup="listbox"
      >
        {active?.name || "Brands"}
        <ChevronDown className="brand-chevron size-3.5" />
      </button>

      <div
        ref={panelRef}
        id={popoverId}
        popover="auto"
        role="listbox"
        aria-label="Brands"
        className="brand-dropdown-panel"
      >
        <div className="relative shrink-0 border-b px-3 py-2">
          <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a brand"
            autoComplete="off"
            className="h-8 w-full rounded-lg border border-input bg-card pr-2 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="brand-dropdown-list">
          {categories.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Brands will appear when the catalog loads.
            </p>
          ) : groups.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No brands match that name.
            </p>
          ) : (
            groups.map(([letter, brands]) => (
              <div key={letter} className="mb-1">
                <p className="sticky top-0 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {letter}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  {brands.map((category) => (
                    <Link
                      key={category.id}
                      href={storeCategoryPath(store, category.id)}
                      role="option"
                      aria-selected={activeId === category.id}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm hover:bg-muted",
                        activeId === category.id ? "bg-muted font-medium" : "",
                      )}
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
  );
}
