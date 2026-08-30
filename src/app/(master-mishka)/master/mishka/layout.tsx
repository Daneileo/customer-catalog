import { CatalogChrome } from "@/components/catalog-chrome";

export default function MasterMishkaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CatalogChrome store="mishka" mode="master">
      {children}
    </CatalogChrome>
  );
}
