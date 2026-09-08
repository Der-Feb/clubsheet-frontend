import type { NavGroupConfig } from "@/config/navigation";
import { NavItem } from "./nav-item.component";

interface NavGroupProps {
  group: NavGroupConfig;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function NavGroup({
  group,
  isCollapsed = false,
  onNavigate,
}: NavGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {!isCollapsed && group.title && (
        <p className="mb-1 px-3 text-[10px] font-bold tracking-wider text-zinc-400 uppercase select-none">
          {group.title}
        </p>
      )}

      {isCollapsed && group.id !== "overview" && (
        <div className="my-1.5 mx-auto h-px w-6 bg-zinc-200" aria-hidden="true" />
      )}

      {group.items.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          isCollapsed={isCollapsed}
          onClick={onNavigate}
        />
      ))}
    </div>
  );
}
