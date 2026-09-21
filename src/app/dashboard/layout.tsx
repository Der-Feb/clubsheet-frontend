import { cookies } from "next/headers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell.component";
import { ACTIVE_CLUB_COOKIE_NAME } from "@/lib/theme-storage.utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const initialClubId = (await cookies()).get(ACTIVE_CLUB_COOKIE_NAME)?.value;

  return <DashboardShell initialClubId={initialClubId}>{children}</DashboardShell>;
}
