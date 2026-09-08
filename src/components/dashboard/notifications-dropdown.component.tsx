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
    bg: "bg-emerald-50",
    text: "text-[#005F31]",
  },
  attendance: {
    icon: ClipboardCheck,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  document: {
    icon: FileText,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  match: {
    icon: Trophy,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  member: {
    icon: UserCheck,
    bg: "bg-teal-50",
    text: "text-teal-600",
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
          "relative rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800",
          open && "bg-zinc-100 text-zinc-900"
        )}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />

        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#005F31] px-1 text-[10px] font-bold text-white ring-2 ring-white"
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
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-200 bg-white shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#005F31]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-[#005F31] hover:text-[#01562D] transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex border-b border-zinc-100 px-4 pt-2 gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "pb-2 border-b-2 transition-colors",
                filter === "all"
                  ? "border-[#005F31] text-[#005F31] font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              )}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "pb-2 border-b-2 transition-colors",
                filter === "unread"
                  ? "border-[#005F31] text-[#005F31] font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <p className="text-sm font-medium text-zinc-700">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications"}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
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
                      "group relative flex items-start gap-3 p-3.5 transition-colors hover:bg-zinc-50",
                      !notif.isRead && "bg-emerald-50/20"
                    )}
                  >
                    {/* Category Icon */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
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
                            "text-xs leading-snug hover:text-[#005F31] transition-colors",
                            notif.isRead
                              ? "font-medium text-zinc-700"
                              : "font-semibold text-zinc-900"
                          )}
                        >
                          {notif.title}
                        </Link>

                        {!notif.isRead && (
                          <span
                            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#005F31]"
                            title="Unread"
                          />
                        )}
                      </div>

                      <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-2">
                        {notif.description}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">
                          {notif.timestamp}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleNotificationRead(notif.id)}
                          className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-700 transition-opacity"
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
          <div className="border-t border-zinc-100 bg-zinc-50/50 p-2.5 text-center">
            <Link
              href="/dashboard/communication"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#005F31] hover:text-[#01562D] transition-colors"
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
