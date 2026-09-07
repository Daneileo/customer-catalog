import { IntroShell } from "@/components/intro-shell";
import { whatsappLink } from "@/lib/shops";

export const metadata = {
  title: "How to order",
};

export default function IntroPage() {
  return (
    <IntroShell>
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          HOW TO ORDER
        </h1>
        <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
          cycle through the catalouges, each cataloige has its own brands and
          items, if you cant find an item contact me directy at 4162459504 on
          whatsapp, i have EVERYTHINGGGGG
        </p>
        <p className="text-sm text-muted-foreground">
          Use the search bar above to look through every catalog at once, or
          pick a catalog tab to browse.
        </p>
        <a
          className="inline-flex text-sm font-medium underline-offset-2 hover:underline"
          href={whatsappLink("Hi, I want to place an order.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Message on WhatsApp
        </a>
      </div>
    </IntroShell>
  );
}
