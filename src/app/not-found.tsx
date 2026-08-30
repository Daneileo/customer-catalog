import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That catalog page does not exist.
      </p>
      <Button nativeButton={false} className="mt-6" render={<Link href="/taurus" />}>
        Go to catalog
      </Button>
    </div>
  );
}
