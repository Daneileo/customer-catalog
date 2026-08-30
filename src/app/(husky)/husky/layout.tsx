import { CatalogChrome } from "@/components/catalog-chrome";

export default function HuskyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CatalogChrome store="husky">{children}</CatalogChrome>;
}
