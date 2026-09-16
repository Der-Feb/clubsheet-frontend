import {
  LayoutDashboard,
  Users,
  Shield,
  ShieldCheck,
  KeyRound,
  Dumbbell,
  Trophy,
  ClipboardCheck,
  UserCheck,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "default" | "primary" | "warning";
  /** When true, only matches the exact path (not child routes). */
  matchExact?: boolean;
}

export interface NavGroupConfig {
  id: string;
  title?: string;
  items: NavItemConfig[];
}

export const DASHBOARD_NAVIGATION: NavGroupConfig[] = [
  {
    id: "overview",
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        matchExact: true,
      },
    ],
  },
  {
    id: "club",
    title: "CLUB",
    items: [
      {
        label: "Athletes",
        href: "/dashboard/athletes",
        icon: Users,
        badge: "248",
      },
      { label: "Teams", href: "/dashboard/teams", icon: Shield },
    ],
  },
  {
    id: "sport",
    title: "SPORT",
    items: [
      {
        label: "Training",
        href: "/dashboard/training",
        icon: Dumbbell,
        badge: 4,
        badgeVariant: "primary",
      },
      {
        label: "Matches",
        href: "/dashboard/matches",
        icon: Trophy,
        badge: 2,
        badgeVariant: "primary",
      },
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: ClipboardCheck,
        badge: "87%",
      },
    ],
  },
  {
    id: "operations",
    title: "OPERATIONS",
    items: [
      { label: "Memberships", href: "/dashboard/memberships", icon: UserCheck },
      { label: "Members", href: "/dashboard/members", icon: UserCheck },
      { label: "Roles", href: "/dashboard/roles", icon: ShieldCheck },
      { label: "Permissions", href: "/dashboard/permissions", icon: KeyRound },
      {
        label: "Chat",
        href: "/chat",
        icon: MessageSquare,
        badge: 3,
        badgeVariant: "warning",
      },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
    ],
  },
  {
    id: "insights",
    title: "INSIGHTS",
    items: [{ label: "Reports", href: "/dashboard/reports", icon: BarChart3 }],
  },
  {
    id: "system",
    title: "SYSTEM",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
