import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getAuthSession } from "@/src/features/auth/session";
import { MvpShell } from "@/src/shared/ui/mvp-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <MvpShell sessionName={session.name} sessionRole={session.role}>
      {children}
    </MvpShell>
  );
}
