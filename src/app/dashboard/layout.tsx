import { DashboardShell } from "@/components/dashboard/dashboard-shell.component";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return <DashboardShell>{children}</DashboardShell>;
}
