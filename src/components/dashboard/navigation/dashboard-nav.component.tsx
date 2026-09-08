import { DASHBOARD_NAVIGATION } from "@/config/navigation";
import { NavGroup } from "./nav-group.component";

interface DashboardNavProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function DashboardNav({
  isCollapsed = false,
  onNavigate,
}: DashboardNavProps) {
  return (
    <nav aria-label="Dashboard navigation" className="flex flex-col gap-4">
      {DASHBOARD_NAVIGATION.map((group) => (
        <NavGroup
          key={group.id}
          group={group}
          isCollapsed={isCollapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
