import type React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { Bell, FileText, ShieldCheck, Fish } from "lucide-react";
import {
  DashboardSquare02Icon,
  Settings01Icon,
  UserMultiple03Icon,
  Analytics01Icon,
  Image03Icon,
  Mail02Icon,
} from "@hugeicons/core-free-icons";

export interface SidebarSubLink {
  label: string;
  href: string;
  permission?: string;
}

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ElementType | React.ReactElement | IconSvgElement;
  subLinks?: SidebarSubLink[];
  permission?: string;
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: DashboardSquare02Icon,
    permission: "view_dashboard", // Anyone with view_dashboard atom
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserMultiple03Icon,
  },
  {
    label: "Lakes",
    href: "/admin/lakes",
    icon: Fish,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    label: "BassPorn Requests",
    href: "/admin/bassporn-requests",
    icon: Image03Icon,
  },

  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: Analytics01Icon,
  },

  {
    label: "Contact Us",
    href: "/admin/contact-us",
    icon: Mail02Icon,
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: Bell,
  },
  {
    label: "Privacy & policy",
    href: "/admin/privacy-policy",
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings01Icon,
    permission: "customer",
  },
];
