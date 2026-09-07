import { notFound } from "next/navigation";
import { isMasterEnabled } from "@/lib/master-access";

export default function MasterSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isMasterEnabled()) notFound();
  return children;
}
