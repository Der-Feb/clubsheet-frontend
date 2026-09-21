"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Dumbbell,
  ClipboardCheck,
  FileText,
  Trophy,
  UserCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_NOTIFICATIONS,
  type MockNotification,
  type NotificationCategory,
} from "@/mocks/notifications.mock";

const CATEGORY_ICONS: Record<
  NotificationCategory,
  { icon: LucideIcon; bg: string; text: string }
> = {
  training: {
    icon: Dumbbell,
    bg: "bg-primary-subtle border border-primary/20",
    text: "text-primary",
  },
  attendance: {
    icon: ClipboardCheck,
    bg: "bg-warning/10 border border-warning/20",
    text: "text-warning",
  },
  document: {
    icon: FileText,
    bg: "bg-info/10 border border-info/20",
    text: "text-info",
  },
  match: {
    icon: Trophy,
    bg: "bg-tertiary/20 border border-tertiary/30",
    text: "text-tertiary",
  },
  member: {
    icon: UserCheck,
    bg: "bg-success/10 border border-success/20",
    text: "text-success",
  },
};

export function NotificationsDropdown() {
  const [notifications, setNotifications] =
    useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function toggleNotificationRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell trigger button */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          unreadCount > 0
            ? `Notifications (${unreadCount} unread)`
            : "Notifications"
        }
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
          open && "bg-muted text-foreground"
        )}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />

        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-card"
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications panel"
          className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1rem))] sm:w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden text-card-foreground"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary-subtle px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex border-b border-border px-4 pt-2 gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "pb-2 border-b-2 transition-colors cursor-pointer",
                filter === "all"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "pb-2 border-b-2 transition-colors cursor-pointer",
                filter === "unread"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[22.5rem] overflow-y-auto divide-y divide-border">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <p className="text-sm font-medium text-foreground">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {filter === "unread"
                    ? "You are all caught up with your club updates!"
                    : "Important club updates will show up here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const config =
                  CATEGORY_ICONS[notif.category] ?? CATEGORY_ICONS.training;
                const Icon = config.icon;

                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "group relative flex items-start gap-3 p-3.5 transition-colors hover:bg-muted/40",
                      !notif.isRead && "bg-primary-subtle/30"
                    )}
                  >
                    {/* Category Icon */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                        config.bg,
                        config.text
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>

                    {/* Notification info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={notif.link ?? "/dashboard"}
                          onClick={() => {
                            if (!notif.isRead) {
                              toggleNotificationRead(notif.id);
                            }
                            setOpen(false);
                          }}
                          className={cn(
                            "text-xs leading-snug hover:text-primary transition-colors",
                            notif.isRead
                              ? "font-medium text-foreground/80"
                              : "font-semibold text-foreground"
                          )}
                        >
                          {notif.title}
                        </Link>

                        {!notif.isRead && (
                          <span
                            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                            title="Unread"
                          />
                        )}
                      </div>

                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                        {notif.description}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {notif.timestamp}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleNotificationRead(notif.id)}
                          className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity cursor-pointer"
                        >
                          {notif.isRead ? "Mark unread" : "Mark read"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 p-2.5 text-center">
            <Link
              href="/dashboard/communication"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              <span>View communication hub</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
