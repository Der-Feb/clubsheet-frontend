"use client";

import { useEffect, useRef } from "react";
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
  const linkRef = useRef<HTMLAnchorElement>(null);

  const isActive = item.matchExact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  useEffect(() => {
    if (isActive) {
      linkRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isActive, pathname]);

  const Icon = item.icon;

  return (
    <Link
      ref={linkRef}
      href={item.href}
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150",
        isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
        isActive
          ? "bg-primary-subtle text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {/* Left active accent bar */}
      {isActive && (
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-r-full bg-primary",
            isCollapsed ? "left-0 h-6 w-1" : "left-0 h-5 w-0.5"
          )}
        />
      )}

      <Icon
        aria-hidden="true"
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105",
          isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
        )}
      />

      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {!isCollapsed && item.badge != null && (
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
            item.badgeVariant === "primary"
              ? "bg-primary-subtle text-primary"
              : item.badgeVariant === "warning"
              ? "bg-warning/20 text-warning"
              : "bg-muted text-muted-foreground group-hover:bg-muted/80"
          )}
        >
          {item.badge}
        </span>
      )}

      {/* Indicator dot for collapsed desktop mode */}
      {isCollapsed && item.badge != null && (
        <span
          className={cn(
            "absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-card",
            item.badgeVariant === "primary"
              ? "bg-primary"
              : item.badgeVariant === "warning"
              ? "bg-warning"
              : "bg-muted-foreground"
          )}
          aria-hidden="true"
        />
      )}

      {/* Floating tooltip for collapsed desktop mode */}
      {isCollapsed && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full ml-2.5 hidden rounded-md bg-popover text-popover-foreground border border-border px-2 py-1 text-xs font-medium shadow-md group-hover:flex items-center gap-1.5 z-50 whitespace-nowrap"
        >
          <span>{item.label}</span>
          {item.badge != null && (
            <span
              className={cn(
                "rounded px-1 text-[10px] font-bold",
                item.badgeVariant === "primary"
                  ? "bg-primary text-primary-foreground"
                  : item.badgeVariant === "warning"
                  ? "bg-warning text-warning-foreground"
                  : "bg-muted text-muted-foreground"
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
