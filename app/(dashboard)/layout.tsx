import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getAuthSession } from "@/src/features/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return children;
}
