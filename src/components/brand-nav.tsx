"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

export function BrandNav({
  store,
  categories,
}: {
  store: StoreSlug;
  categories: Category[];
}) {
  const pathname = usePathname();
  const activeId = pathname.match(/\/c\/([^/?]+)/)?.[1];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = Math.min(
      window.innerWidth - 16,
      Math.max(rect.width, 20 * 16),
    );
    const left = Math.min(
      Math.max(8, rect.left),
      window.innerWidth - width - 8,
    );
    const top = rect.bottom + 8;

    setPosition({ top, left, width });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  const dropdown =
    mounted && open && position
      ? createPortal(
          <>
            <div
              ref={panelRef}
              role="listbox"
              aria-label="Brands"
              className="brand-dropdown-panel"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
              }}
            >
              <div className="relative shrink-0 border-b px-3 py-2">
                <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a brand"
                  className="h-8 bg-card pl-8 text-sm"
                />
              </div>
              <div ref={listRef} className="brand-dropdown-list">
                {groups.length === 0 ? (
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
                            onClick={() => setOpen(false)}
                            className={cn(
                              "rounded-md px-3 py-2 text-sm hover:bg-muted",
                              activeId === category.id
                                ? "bg-muted font-medium"
                                : "",
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
          </>,
          document.body,
        )
      : null;

  return (
    <div className="relative flex items-center gap-1">
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
          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
          open || activeId
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) updatePosition();
            return next;
          });
        }}
      >
        {active?.name || "Brands"}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {dropdown}
    </div>
  );
}
