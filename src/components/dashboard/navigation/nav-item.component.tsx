"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItemConfig } from "@/config/navigation";

interface NavItemProps {
  item: NavItemConfig;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export function NavItem({
  item,
  isCollapsed = false,
  onClick,
}: NavItemProps) {
  const pathname = usePathname();

  const isActive = item.matchExact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150",
        isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
        isActive
          ? "bg-green-50 text-[#005F31] font-semibold"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      )}
    >
      {/* Left active accent bar */}
      {isActive && (
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-r-full bg-[#005F31]",
            isCollapsed ? "left-0 h-6 w-1" : "left-0 h-5 w-0.5"
          )}
        />
      )}

      <Icon
        aria-hidden="true"
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105",
          isActive ? "text-[#005F31]" : "text-zinc-400 group-hover:text-zinc-600"
        )}
      />

      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {!isCollapsed && item.badge != null && (
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
            item.badgeVariant === "primary"
              ? "bg-emerald-100 text-[#005F31]"
              : item.badgeVariant === "warning"
              ? "bg-amber-100 text-amber-800"
              : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200/80"
          )}
        >
          {item.badge}
        </span>
      )}

      {/* Indicator dot for collapsed desktop mode */}
      {isCollapsed && item.badge != null && (
        <span
          className={cn(
            "absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-white",
            item.badgeVariant === "primary"
              ? "bg-[#005F31]"
              : item.badgeVariant === "warning"
              ? "bg-amber-500"
              : "bg-zinc-400"
          )}
          aria-hidden="true"
        />
      )}

      {/* Floating tooltip for collapsed desktop mode */}
      {isCollapsed && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full ml-2.5 hidden rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white shadow-md group-hover:flex items-center gap-1.5 z-50 whitespace-nowrap"
        >
          <span>{item.label}</span>
          {item.badge != null && (
            <span
              className={cn(
                "rounded px-1 text-[10px] font-bold",
                item.badgeVariant === "primary"
                  ? "bg-[#005F31] text-white"
                  : item.badgeVariant === "warning"
                  ? "bg-amber-500 text-white"
                  : "bg-zinc-700 text-zinc-200"
              )}
            >
              {item.badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
