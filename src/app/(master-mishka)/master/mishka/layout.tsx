import { notFound } from "next/navigation";
import { CatalogChrome } from "@/components/catalog-chrome";
import { isMasterEnabled } from "@/lib/master-access";

export default function MasterMishkaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isMasterEnabled()) notFound();

  return (
    <CatalogChrome store="mishka" mode="master">
      {children}
    </CatalogChrome>
  );
}
