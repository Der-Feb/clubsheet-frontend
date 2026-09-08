export type NotificationCategory =
  | "training"
  | "attendance"
  | "document"
  | "match"
  | "member";

export interface MockNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: NotificationCategory;
  isRead: boolean;
  link?: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "notif-1",
    title: "Training session tomorrow at 18:00",
    description: "Senior Team • Pitch A — Tactical preparation",
    timestamp: "10m ago",
    category: "training",
    isRead: false,
    link: "/dashboard/training",
  },
  {
    id: "notif-2",
    title: "3 players have not confirmed attendance",
    description: "U17 Weekly Training • Session starts in 24h",
    timestamp: "45m ago",
    category: "attendance",
    isRead: false,
    link: "/dashboard/attendance",
  },
  {
    id: "notif-3",
    title: "New document uploaded",
    description: "Medical Clearance 2026.pdf added to Medical folder",
    timestamp: "2h ago",
    category: "document",
    isRead: false,
    link: "/dashboard/documents",
  },
  {
    id: "notif-4",
    title: "Match scheduled for Saturday",
    description: "Kigali FC vs APR FC • Amahoro Stadium at 15:00",
    timestamp: "Yesterday",
    category: "match",
    isRead: true,
    link: "/dashboard/matches",
  },
  {
    id: "notif-5",
    title: "New member invitation accepted",
    description: "Jean Claude joined as Assistant Coach",
    timestamp: "2 days ago",
    category: "member",
    isRead: true,
    link: "/dashboard/members",
  },
];
