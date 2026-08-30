import Link from "next/link";

export function CategoryChips({
  categories,
  activeId,
}: {
  categories: { id: string; name: string }[];
  activeId?: string;
}) {
  if (categories.length === 0) return null;

  const chips = categories.slice(0, 24);

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <Link
        href="/"
        className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap sm:text-sm ${
          !activeId
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </Link>
      {chips.map((category) => (
        <Link
          key={category.id}
          href={`/c/${category.id}`}
          className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap sm:text-sm ${
            activeId === category.id
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
