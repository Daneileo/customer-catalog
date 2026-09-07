"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { brandLetter } from "@/lib/category-nav";
import {
  catalogCategoryPath,
  catalogHome,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

export function BrandNav({
  store,
  categories,
  mode = "storefront",
}: {
  store: StoreSlug;
  categories: Category[];
  mode?: CatalogMode;
}) {
  const pathname = usePathname();
  const activeId = pathname.match(/\/c\/([^/?]+)/)?.[1];
  const reactId = useId().replace(/:/g, "");
  const popoverId = `brand-dropdown-${mode}-${store}-${reactId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const expandId = `brand-expand-${mode}-${store}-${reactId}`;

  const groups = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const category of categories) {
      const letter = brandLetter(category.name);
      const list = map.get(letter) ?? [];
      list.push(category);
      map.set(letter, list);
    }
    return [...map.entries()].sort(([a], [b]) =>
      a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b),
    );
  }, [categories]);

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

    const applyFilter = (value: string) => {
      const q = value.trim().toLowerCase();
      panel.querySelectorAll<HTMLElement>("[data-brand-name]").forEach((el) => {
        const name = el.getAttribute("data-brand-name") ?? "";
        el.hidden = Boolean(q) && !name.includes(q);
      });
      panel.querySelectorAll<HTMLElement>("[data-brand-group]").forEach((group) => {
        const anyVisible = [...group.querySelectorAll<HTMLElement>("[data-brand-name]")].some(
          (el) => !el.hidden,
        );
        group.hidden = Boolean(q) && !anyVisible;
      });
      const empty = panel.querySelector<HTMLElement>("[data-brand-empty]");
      const anyShown = [...panel.querySelectorAll<HTMLElement>("[data-brand-name]")].some(
        (el) => !el.hidden,
      );
      if (empty) empty.hidden = !q || anyShown;
    };

    const onSearch = (event: Event) => {
      applyFilter((event.target as HTMLInputElement).value);
    };

    const onBeforeToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState;
      if (next === "open") {
        place();
        const input = panel.querySelector("input");
        if (input) {
          input.value = "";
          applyFilter("");
          input.addEventListener("input", onSearch);
        }
      }
    };

    const input = panel.querySelector("input");
    input?.addEventListener("input", onSearch);
    panel.addEventListener("beforetoggle", onBeforeToggle);
    window.addEventListener("resize", place);
    return () => {
      input?.removeEventListener("input", onSearch);
      panel.removeEventListener("beforetoggle", onBeforeToggle);
      window.removeEventListener("resize", place);
    };
  }, [popoverId]);

  useEffect(() => {
    panelRef.current?.hidePopover?.();
  }, [pathname]);

  return (
    <div className="brand-nav group/brands space-y-2">
      <input
        id={expandId}
        type="checkbox"
        className="sr-only"
      />
      <div className="flex flex-wrap items-center gap-1">
        <Link
          href={catalogHome(store, mode)}
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

        <label
          htmlFor={expandId}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground group-has-[:checked]/brands:hidden"
        >
          Show all brands
          <ChevronDown className="size-3.5" />
        </label>
        <label
          htmlFor={expandId}
          className="hidden cursor-pointer items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground group-has-[:checked]/brands:inline-flex"
        >
          Hide brands
          <ChevronUp className="size-3.5" />
        </label>
      </div>

      <div
        ref={panelRef}
        id={popoverId}
        popover="auto"
        role="listbox"
        aria-label="Brands"
        className="brand-dropdown-panel"
      >
        <div
          className="relative shrink-0 border-b px-3 py-2"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.34-4.34"></path></svg><input type="search" placeholder="Find a brand" autocomplete="off" class="h-8 w-full rounded-lg border border-input bg-card pr-2 pl-8 text-sm outline-none" oninput="var q=this.value.trim().toLowerCase();var p=this.closest('.brand-dropdown-panel');if(!p)return;p.querySelectorAll('[data-brand-name]').forEach(function(el){el.hidden=!!q&amp;&amp;el.getAttribute('data-brand-name').indexOf(q)&lt;0});p.querySelectorAll('[data-brand-group]').forEach(function(g){g.hidden=!!q&amp;&amp;!g.querySelector('[data-brand-name]:not([hidden])')});var empty=p.querySelector('[data-brand-empty]');if(empty){var any=false;p.querySelectorAll('[data-brand-name]').forEach(function(el){if(!el.hidden)any=true});empty.hidden=!q||any;}" />`,
          }}
        />
        <div className="brand-dropdown-list">
          {categories.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Brands will appear when the catalog loads.
            </p>
          ) : (
            <>
              <p
                data-brand-empty
                hidden
                className="px-3 py-6 text-center text-sm text-muted-foreground"
              >
                No brands match that name.
              </p>
              {groups.map(([letter, brands]) => (
                <div key={letter} data-brand-group={letter} className="mb-1">
                  <p className="sticky top-0 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {letter}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3">
                    {brands.map((category) => (
                      <Link
                        key={category.id}
                        href={catalogCategoryPath(store, category.id, mode)}
                        data-brand-name={category.name.toLowerCase()}
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
              ))}
            </>
          )}
        </div>
      </div>

      <div className="hidden max-h-64 flex-wrap gap-1 overflow-y-auto overscroll-contain rounded-xl border bg-card p-2 group-has-[:checked]/brands:flex">
        {categories.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            Brands will appear when the catalog loads.
          </p>
        ) : (
          categories.map((category) => (
            <Link
              key={category.id}
              href={catalogCategoryPath(store, category.id, mode)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm",
                activeId === category.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {category.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
