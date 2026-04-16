import type React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { FileText } from "lucide-react";
import {
  DashboardSquare02Icon,
  Settings01Icon,
  UserMultiple03Icon,
  Analytics01Icon,
  CreditCardIcon,
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
  section?: "main" | "system";
  subLinks?: SidebarSubLink[];
  permission?: string;
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: DashboardSquare02Icon,
    section: "main",
    permission: "admin",
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: UserMultiple03Icon,
    section: "main",
    permission: "admin",
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCardIcon,
    section: "main",
    permission: "admin",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: Analytics01Icon,
    section: "main",
    permission: "admin",
  },
  {
    label: "Profile Settings",
    href: "/admin/settings",
    icon: Settings01Icon,
    section: "system",
    permission: "admin",
  },
  {
    label: "Terms & Conditions",
    href: "/admin/terms-conditions",
    icon: FileText,
    section: "system",
    permission: "admin",
  },
];
